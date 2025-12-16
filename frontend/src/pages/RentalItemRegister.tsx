import React, { useRef, useState } from 'react'
import { X, Plus, Camera, CircleAlert, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

interface FormData {
  title: string
  description: string
  pricePerDay: string
  pricePerWeek: string
  enablePricePerDay: boolean
  enablePricePerWeek: boolean
}

interface ImageData {
  file: File
  preview: string
  fileName?: string
  isUploading: boolean
  isUploaded: boolean
}

export default function RentalItemRegister() {
  const navigate = useNavigate()

  const [images, setImages] = useState<ImageData[]>([])
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    pricePerDay: '',
    pricePerWeek: '',
    enablePricePerDay: true,
    enablePricePerWeek: true
  })

  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const pricePerDayRef = useRef<HTMLInputElement>(null)
  const pricePerWeekRef = useRef<HTMLInputElement>(null)

  const [titleError, setTitleError] = useState<boolean>(false)
  const [descriptionError, setDescriptionError] = useState<boolean>(false)
  const [pricePerDayError, setPricePerDayError] = useState<boolean>(false)
  const [pricePerWeekError, setPricePerWeekError] = useState<boolean>(false)

  // 가격 포맷팅용 함수
  const formatPrice = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
      newImages.push({ file, preview, isUploading: true, isUploaded: false })
    }

    setImages(prev => [...prev, ...newImages])

    // 각 이미지를 Supabase Storage에 업로드
    for (let i = 0; i < newImages.length; i++) {
      const newImage = newImages[i]
      const newImageIndex = images.length + i

      try {
        // 고유한 파일명 생성
        const fileExt = newImage.file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // 스토리지에 업로드
        const { data, error } = await supabase.storage
          .from('rental-item')
          .upload(fileName, newImage.file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) throw error

        setImages(prev =>
          prev.map((img, idx) =>
            idx === newImageIndex
              ? {
                  ...img,
                  fileName: fileName,
                  isUploading: false,
                  isUploaded: true
                }
              : img
          )
        )
      } catch (error) {
        alert('이미지 업로드에 실패했습니다.')

        // 업로드에 실패한 이미지 제거
        setImages(prev => prev.filter((_, i) => i !== newImageIndex))
      }
    }
  }

  // 이미지 삭제용 함수
  const removeImage = async (index: number) => {
    const image = images[index]

    URL.revokeObjectURL(image.preview)

    // Supabase Storage에서 파일 삭제
    if (image.fileName && image.isUploaded) {
      try {
        await supabase.storage.from('rental-item').remove([image.fileName])
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

    // 업로드 중인 이미지가 있는지 확인
    const isAnyImageUploading = images.some(img => img.isUploading)
    if (isAnyImageUploading) {
      alert('이미지 업로드가 진행 중입니다. 잠시만 기다려주세요.')
      return
    }

    if (!hasError) {
      const imageUrls = images.map(img => img.fileName).filter(Boolean)

      console.log('제출 데이터:', {
        ...formData,
        images: imageUrls
      })
    }
  }

  return (
    <div className="min-h-screen w-md bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black">
        <div className="relative mx-auto flex max-w-2xl items-center px-4 py-4">
          <button className="text-gray-600">
            <X
              size={24}
              color="white"
              onClick={() => {
                navigate(-1)
              }}
            />
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 font-semibold text-white">
            내 물건 대여하기
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto max-w-2xl">
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

        {/* Title */}
        <div className="mb-2 p-4">
          <label className="mb-2 block font-medium">제목</label>
          <input
            ref={titleRef}
            type="text"
            value={formData.title}
            onChange={e => {
              setFormData(prev => ({ ...prev, title: e.target.value }))
              setTitleError(false)
            }}
            placeholder="제목을 입력해주세요."
            className={`w-full rounded-lg border px-3 py-2 focus:outline-none ${
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
          <label className="mb-2 block font-medium">자세한 설명</label>
          <textarea
            ref={descriptionRef}
            value={formData.description}
            onChange={e => {
              setFormData(prev => ({ ...prev, description: e.target.value }))
              setDescriptionError(false)
            }}
            placeholder="신뢰할 수 있는 거래를 위해 자세한 설명을 적어주세요. 판매 금지 물품은 게시가 제한될 수 있어요."
            rows={6}
            className={`w-full resize-none rounded-lg border px-3 py-2 focus:outline-none ${
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
                className={`w-full resize-none rounded-lg border px-3 py-2 text-right focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${
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
                className={`w-full resize-none rounded-lg border px-3 py-2 text-right focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${
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

        {/* Submit Button */}
        <div className="sticky bottom-0 z-10 bg-gray-50 p-4">
          <button
            className="w-full rounded-lg bg-black py-3 font-medium text-white"
            onClick={handleSubmit}>
            등록하기
          </button>
        </div>
      </div>
    </div>
  )
}
