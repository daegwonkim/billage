import React, { useRef, useState, useEffect } from 'react'
import {
  ChevronLeft,
  Plus,
  Camera,
  CircleAlert,
  Loader2,
  X
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { RegisterRentalItemRequest } from '@/api/rentall_item/dto/RegisterRentalItem'
import type { ModifyRentalItemRequest } from '@/api/rentall_item/dto/ModifyRentalItem'
import {
  register,
  modify,
  getRentalItemForModify
} from '@/api/rentall_item/rentalItem'
import { generateUploadSignedUrl, removeFile } from '@/api/storage/storage'
import { formatPrice } from '@/utils/utils'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetRentalItemCategories } from '@/hooks/useRentalItem'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { ApiError } from '@/api/error'

interface RentalItemRegisterProps {
  mode: 'register' | 'modify'
}

interface FormData {
  category: string
  title: string
  description: string
  pricePerDay: string
  pricePerWeek: string
  enablePricePerDay: boolean
  enablePricePerWeek: boolean
}

interface ImageData {
  file?: File
  preview: string
  fileKey?: string
  isUploading: boolean
  isUploaded: boolean
  isExisting?: boolean
}

export default function RentalItemRegister({ mode }: RentalItemRegisterProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()
  const { id } = useParams<{ id: string }>()
  const rentalItemId = id ? Number(id) : null

  const [isOpen, setIsOpen] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])
  const [isLoading, setIsLoading] = useState(mode === 'modify')
  const [deletedImageKeys, setDeletedImageKeys] = useState<string[]>([])
  const [formData, setFormData] = useState<FormData>({
    category: '',
    title: '',
    description: '',
    pricePerDay: '',
    pricePerWeek: '',
    enablePricePerDay: true,
    enablePricePerWeek: true
  })

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (mode === 'modify' && rentalItemId) {
      getRentalItemForModify(rentalItemId)
        .then(data => {
          setFormData({
            category: data.category,
            title: data.title,
            description: data.description,
            pricePerDay: data.pricePerDay
              ? formatPrice(String(data.pricePerDay))
              : '',
            pricePerWeek: data.pricePerWeek
              ? formatPrice(String(data.pricePerWeek))
              : '',
            enablePricePerDay: !!data.pricePerDay,
            enablePricePerWeek: !!data.pricePerWeek
          })
          // 기존 이미지 설정
          setImages(
            data.images.map(image => ({
              preview: image.url,
              fileKey: image.key,
              isUploading: false,
              isUploaded: true,
              isExisting: true
            }))
          )
        })
        .catch(() => {
          toast.error('데이터를 불러오는데 실패했어요.')
          navigate(-1)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [mode, rentalItemId, navigate])

  const categoryRef = useRef<HTMLSelectElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const pricePerDayRef = useRef<HTMLInputElement>(null)
  const pricePerWeekRef = useRef<HTMLInputElement>(null)

  const [categoryError, setCategoryError] = useState<boolean>(false)
  const [titleError, setTitleError] = useState<boolean>(false)
  const [descriptionError, setDescriptionError] = useState<boolean>(false)
  const [pricePerDayError, setPricePerDayError] = useState<boolean>(false)
  const [pricePerWeekError, setPricePerWeekError] = useState<boolean>(false)

  const registerMutation = useMutation({
    mutationFn: (request: RegisterRentalItemRequest) => register(request),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['rentalItems'] })
      navigate(`/rental-items/${data.id}`, { replace: true })
    },
    onError: () => {
      toast.error('등록에 실패했어요.')
    }
  })

  const modifyMutation = useMutation({
    mutationFn: (request: ModifyRentalItemRequest) =>
      modify(rentalItemId!, request),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['rentalItems'] })
      queryClient.invalidateQueries({ queryKey: ['rentalItem', rentalItemId] })
      navigate(`/rental-items/${data.id}`, { replace: true })
    },
    onError: () => {
      toast.error('수정에 실패했어요.')
    }
  })

  const { data: categoriesData } = useGetRentalItemCategories()

  // 비로그인 시 LoginPrompt 표시
  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  // 가격 변경 시 동작하는 함수
  // 단위 포맷팅 및 상태 업데이트
  const handlePriceChange = (
    field: 'pricePerDay' | 'pricePerWeek',
    value: string
  ) => {
    const formatted = formatPrice(value)
    setFormData(prev => ({ ...prev, [field]: formatted }))
  }

  // 이미지 업로드용 함수
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = 10 - images.length
    const filesToProcess = Math.min(files.length, remainingSlots)

    const newImages: ImageData[] = []
    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i]
      const preview = URL.createObjectURL(file)
      newImages.push({
        file,
        preview,
        isUploading: true,
        isUploaded: false,
        isExisting: false
      })
    }

    setImages(prev => [...prev, ...newImages])

    // 각 이미지를 Supabase Storage에 업로드
    for (let i = 0; i < newImages.length; i++) {
      const newImage = newImages[i]
      const newImageIndex = images.length + i
      const file = newImage.file!

      try {
        // Signed URL 발급
        const { fileKey, signedUrl } = await generateUploadSignedUrl({
          bucket: 'rental-item-images',
          fileName: file.name
        })

        await fetch(signedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type
          },
          body: file
        })

        setImages(prev =>
          prev.map((img, idx) =>
            idx === newImageIndex
              ? {
                  ...img,
                  fileKey: fileKey,
                  isUploading: false,
                  isUploaded: true
                }
              : img
          )
        )
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          toast.error('세션이 만료됐어요. 다시 로그인 해주세요')
        } else {
          toast.error('이미지 업로드에 실패했어요')
        }

        // 업로드에 실패한 이미지 제거
        setImages(prev => prev.filter((_, i) => i !== newImageIndex))
      }
    }
  }

  // 이미지 삭제용 함수
  const removeImage = async (index: number) => {
    const image = images[index]

    if (!image.isExisting) {
      URL.revokeObjectURL(image.preview)
    }

    // 기존 이미지는 삭제 목록에 추가 (수정 시 서버에 전달)
    if (image.isExisting && image.fileKey) {
      setDeletedImageKeys(prev => [...prev, image.fileKey!])
    } else if (image.fileKey && image.isUploaded) {
      // 새로 업로드한 이미지는 Storage에서 바로 삭제
      try {
        await removeFile({
          bucket: 'rental-item-images',
          fileKey: image.fileKey
        })
      } catch (error) {
        console.error('Failed to delete from storage: ', error)
      }
    }

    // 상태에서 제거
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    let hasError = false

    if (formData.enablePricePerWeek && !formData.pricePerWeek) {
      pricePerWeekRef.current?.focus()
      setPricePerWeekError(true)
      hasError = true
    } else {
      setPricePerWeekError(false)
    }

    if (formData.enablePricePerDay && !formData.pricePerDay) {
      pricePerDayRef.current?.focus()
      setPricePerDayError(true)
      hasError = true
    } else {
      setPricePerDayError(false)
    }

    if (!formData.description) {
      descriptionRef.current?.focus()
      setDescriptionError(true)
      hasError = true
    } else {
      setDescriptionError(false)
    }

    if (!formData.title) {
      titleRef.current?.focus()
      setTitleError(true)
      hasError = true
    } else {
      setTitleError(false)
    }

    if (!formData.category) {
      categoryRef.current?.focus()
      setCategoryError(true)
      hasError = true
    } else {
      setCategoryError(false)
    }

    // 업로드 중인 이미지가 있는지 확인
    const isAnyImageUploading = images.some(img => img.isUploading)
    if (isAnyImageUploading) {
      toast.error('이미지 업로드가 진행 중입니다. 잠시만 기다려주세요.')
      return
    }

    if (!hasError) {
      if (mode === 'register') {
        registerMutation.mutate({
          category: formData.category,
          title: formData.title,
          description: formData.description,
          pricePerDay: formData.enablePricePerDay
            ? Number(formData.pricePerDay.replace(/,/g, ''))
            : null,
          pricePerWeek: formData.enablePricePerWeek
            ? Number(formData.pricePerWeek.replace(/,/g, ''))
            : null,
          imageKeys: images
            .map(img => img.fileKey)
            .filter(fileKey => fileKey !== undefined)
        })
      } else {
        // 새로 업로드한 이미지만 필터링
        const newImageKeys = images
          .filter(img => !img.isExisting && img.fileKey)
          .map(img => img.fileKey!)

        modifyMutation.mutate({
          category: formData.category,
          title: formData.title,
          description: formData.description,
          pricePerDay: formData.enablePricePerDay
            ? Number(formData.pricePerDay.replace(/,/g, ''))
            : 0,
          pricePerWeek: formData.enablePricePerWeek
            ? Number(formData.pricePerWeek.replace(/,/g, ''))
            : 0,
          newImageKeys,
          deleteImageKeys: deletedImageKeys
        })
      }
    }
  }

  return (
    <div className="min-h-screen w-md bg-white pb-20">
      <Toaster
        position="bottom-center"
        toastOptions={{ className: 'text-sm' }}
      />

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white">
        <div className="relative flex h-14 items-center px-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-2 rounded-lg p-2 transition-colors hover:bg-gray-50">
            <ChevronLeft
              size={24}
              className="text-neutral-700"
            />
          </button>
          <div className="flex-1 text-center text-base font-extrabold text-neutral-900">
            {mode === 'register' ? '내 물건 대여하기' : '게시글 수정'}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4">
        {/* Image Upload Section */}
        <div className="mb-2 p-4">
          <div className="mb-3 flex items-center">
            <Camera
              size={20}
              className="mr-2 text-gray-600"
            />
            <span className="font-medium">사진</span>
            <span className="ml-2 text-sm text-gray-500">
              ({images.length}/10)
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square">
                <img
                  src={img.preview}
                  className="h-full w-full rounded-lg object-cover"
                />
                {img.isUploading && (
                  <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                    <Loader2
                      size={24}
                      className="animate-spin text-white"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={img.isUploading}
                  className="bg-opacity-70 absolute -top-2 -right-2 rounded-full bg-black p-1 text-white disabled:cursor-not-allowed disabled:opacity-50">
                  <X size={16} />
                </button>
              </div>
            ))}

            {images.length < 10 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition hover:border-gray-400">
                <Plus
                  size={24}
                  className="mb-1 text-gray-400"
                />
                <span className="text-xs text-gray-500">추가</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="mb-2 p-4">
          <label className="mb-2 block font-medium text-gray-700">
            카테고리
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`flex w-full items-center justify-between rounded-xl border-2 bg-white px-3 py-2 text-left font-medium transition-all duration-200 focus:outline-none ${
                categoryError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-black'
              } ${!formData.category ? 'text-gray-400' : 'text-gray-800'}`}>
              <span>
                {formData.category
                  ? categoriesData?.categories.find(
                      c => c.value === formData.category
                    )?.label
                  : '카테고리를 선택해주세요.'}
              </span>
              <svg
                className={`h-5 w-5 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                } ${categoryError ? 'text-red-400' : 'text-gray-400'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-lg">
                  <div className="max-h-60 overflow-y-auto">
                    {categoriesData?.categories.map((category, index) => (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            category: category.value
                          }))
                          setCategoryError(false)
                          setIsOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-neutral-50 ${
                          formData.category === category.value
                            ? 'bg-neutral-50'
                            : 'text-gray-800'
                        } ${index !== categoriesData.categories.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {categoryError && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-red-500">
              <CircleAlert size={16} />
              <span>카테고리는 필수 선택 사항입니다.</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mb-2 p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="font-medium">제목</label>
            <span className="text-sm text-gray-400">
              {formData.title.length}/40
            </span>
          </div>
          <input
            ref={titleRef}
            type="text"
            value={formData.title}
            onChange={e => {
              const value = e.target.value
              if (value.length <= 40) {
                setFormData(prev => ({ ...prev, title: value }))
                setTitleError(false)
              }
            }}
            placeholder="제목을 입력해주세요."
            maxLength={40}
            className={`w-full rounded-lg border-2 bg-white px-3 py-2 focus:outline-none ${
              titleError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-black'
            } `}
          />
          {titleError && (
            <div className="mt-2 flex items-center gap-1 text-sm text-red-500">
              <CircleAlert size={18} />
              <div>제목은 필수 입력 사항입니다.</div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-2 p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="font-medium">자세한 설명</label>
            <span className="text-sm text-gray-400">
              {formData.description.length}/500
            </span>
          </div>
          <textarea
            ref={descriptionRef}
            value={formData.description}
            onChange={e => {
              const value = e.target.value
              if (value.length <= 500) {
                setFormData(prev => ({
                  ...prev,
                  description: value
                }))
                setDescriptionError(false)
              }
            }}
            placeholder="신뢰할 수 있는 거래를 위해 자세한 설명을 적어주세요. 판매 금지 물품은 게시가 제한될 수 있어요."
            rows={6}
            maxLength={500}
            className={`w-full resize-none rounded-lg border-2 bg-white px-3 py-2 focus:outline-none ${
              descriptionError
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 focus:border-black'
            } `}
          />
          {descriptionError && (
            <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
              <CircleAlert size={18} />
              <div>설명은 필수 입력 사항입니다.</div>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="mb-2 p-4">
          <label className="mb-3 block font-medium">대여 가격</label>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-gray-600">일 대여 가격</label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={!formData.enablePricePerDay}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      enablePricePerDay: !e.target.checked
                    }))
                    setPricePerDayError(false)
                  }}
                  disabled={!formData.enablePricePerWeek}
                  className="mr-2 accent-black disabled:cursor-not-allowed"
                />
                <span
                  className={
                    !formData.enablePricePerWeek
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }>
                  비활성화
                </span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                ref={pricePerDayRef}
                type="text"
                value={formData.pricePerDay}
                onChange={e => {
                  handlePriceChange('pricePerDay', e.target.value)
                  setPricePerDayError(false)
                }}
                placeholder="0"
                disabled={!formData.enablePricePerDay}
                className={`w-full resize-none rounded-lg border-2 bg-white px-3 py-2 text-right focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${
                  pricePerDayError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-black'
                } `}
              />
              <span className="ml-2 font-medium text-gray-700">원</span>
            </div>
            {pricePerDayError && (
              <div className="mt-2 flex items-center gap-1 text-sm text-red-500">
                <CircleAlert size={18} />
                <div>가격은 필수 입력 사항입니다.</div>
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-gray-600">주 대여 가격</label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={!formData.enablePricePerWeek}
                  onChange={e => {
                    setFormData(prev => ({
                      ...prev,
                      enablePricePerWeek: !e.target.checked
                    }))
                    setPricePerWeekError(false)
                  }}
                  disabled={!formData.enablePricePerDay}
                  className="mr-2 accent-black disabled:cursor-not-allowed"
                />
                <span
                  className={
                    !formData.enablePricePerDay
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }>
                  비활성화
                </span>
              </label>
            </div>
            <div className="flex items-center">
              <input
                ref={pricePerWeekRef}
                type="text"
                value={formData.pricePerWeek}
                onChange={e => {
                  handlePriceChange('pricePerWeek', e.target.value)
                  setPricePerWeekError(false)
                }}
                placeholder="0"
                disabled={!formData.enablePricePerWeek}
                className={`w-full resize-none rounded-lg border-2 bg-white px-3 py-2 text-right focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${
                  pricePerWeekError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-black'
                } `}
              />
              <span className="ml-2 font-medium text-gray-700">원</span>
            </div>
            {pricePerWeekError && (
              <div className="mt-2 flex items-center gap-1 text-sm text-red-500">
                <CircleAlert size={18} />
                <div>가격은 필수 입력 사항입니다.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 bg-white p-4">
        <button
          className="w-full rounded-lg bg-black py-3 font-medium text-white disabled:bg-gray-300"
          onClick={handleSubmit}
          disabled={isLoading}>
          {mode === 'register' ? '등록하기' : '수정하기'}
        </button>
      </div>
    </div>
  )
}
