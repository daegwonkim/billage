import { useRef } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface RentalItemDetailImagesProps {
  imageUrls: string[]
}

export function RentalItemDetailImages({
  imageUrls
}: RentalItemDetailImagesProps) {
  const sliderRef = useRef<Slider>(null)

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

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-gray-100 shadow-[0_0_60px_rgba(0,0,0,0.1)]">
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
