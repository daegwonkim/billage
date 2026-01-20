import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generateSignedUrl } from '@/api/storage/storage'
import defaultProfileImage from '@/assets/default-profile.png'

interface ChatHeaderProps {
  seller: {
    id: number
    nickname: string
    profileImageUrl: string
  }
  onBack: () => void
}

export function ChatHeader({ seller, onBack }: ChatHeaderProps) {
  const [profileImageUrl, setProfileImageUrl] = useState<string>('')

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (seller.profileImageUrl) {
        try {
          const { signedUrl } = await generateSignedUrl({
            bucket: 'user-profile-images',
            fileKey: seller.profileImageUrl
          })
          setProfileImageUrl(signedUrl)
        } catch (error) {
          console.error('Failed to fetch profile image URL:', error)
        }
      }
    }

    fetchProfileImage()
  }, [seller.profileImageUrl])

  return (
    <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
      <button
        onClick={onBack}
        className="cursor-pointer border-none bg-transparent p-0 text-gray-600 transition-colors hover:text-black">
        <ChevronLeft size={28} strokeWidth={1.5} />
      </button>

      <div className="flex flex-1 items-center gap-3">
        <img
          src={profileImageUrl || defaultProfileImage}
          alt={seller.nickname}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <div className="text-base font-bold text-gray-900">
            {seller.nickname}
          </div>
        </div>
      </div>
    </header>
  )
}
