import { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { generateSignedUrl } from '@/api/storage/storage'
import { Loader2 } from 'lucide-react'

interface RentalItemDetailImagesProps {
  imageKeys: string[]
}

export function RentalItemDetailImages({
  imageKeys
}: RentalItemDetailImagesProps) {
  const sliderRef = useRef<Slider>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSignedUrls = async () => {
      try {
        setLoading(true)
        const urls = await Promise.all(
          imageKeys.map(async fileKey => {
            const { signedUrl } = await generateSignedUrl({
              bucket: 'rental-item-images',
              fileKey
            })
            return signedUrl
          })
        )
        setImageUrls(urls)
      } catch (error) {
        console.error('Failed to fetch signed URLs:', error)
      } finally {
        setLoading(false)
      }
    }

    if (imageKeys.length > 0) {
      fetchSignedUrls()
    }
  }, [imageKeys])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    customPaging: () => (
      <div className="h-1.5 w-1.5 rounded-full bg-white/50 transition-colors" />
    ),
    dotsClass: 'slick-dots custom-dots'
  }

  if (loading) {
    return (
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <div className="flex h-full items-center justify-center">
          <Loader2
            color="black"
            size={24}
            className="animate-spin text-white"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
      <style>{`
        .custom-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex !important;
          gap: 6px;
          list-style: none;
          padding: 0;
          margin: 0;
          justify-content: center;
        }

        .custom-dots li {
          width: 6px;
          height: 6px;
          margin: 0;
        }

        .custom-dots li button {
          width: 6px;
          height: 6px;
          padding: 0;
        }

        .custom-dots li button:before {
          display: none;
        }

        .custom-dots li.slick-active div {
          background-color: white !important;
        }

        .slick-slider {
          height: 100%;
        }

        .slick-list {
          height: 100%;
        }

        .slick-track {
          height: 100%;
          display: flex;
        }

        .slick-slide {
          height: 100%;
        }

        .slick-slide > div {
          height: 100%;
        }
      `}</style>

      <Slider
        ref={sliderRef}
        {...settings}>
        {imageUrls.map((url, idx) => (
          <div
            key={idx}
            className="h-full">
            <img
              src={url}
              alt={`Slide ${idx + 1}`}
              className="pointer-events-none h-full w-full object-cover select-none"
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}
