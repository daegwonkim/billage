import { useRef } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface RentalItemDetailImageProps {
  images: string[]
  currentImageIndex: number
}

export function RentalItemDetailImage({
  images,
  currentImageIndex: initialIndex
}: RentalItemDetailImageProps) {
  const sliderRef = useRef<Slider>(null)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialIndex,
    arrows: false,
    customPaging: (i: number) => (
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.5)',
          transition: 'background-color 0.3s'
        }}
      />
    ),
    dotsClass: 'slick-dots custom-dots'
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden'
      }}>
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
        {images.map((image, idx) => (
          <div
            key={idx}
            style={{ height: '100%' }}>
            <img
              src={image}
              alt={`Slide ${idx + 1}`}
              style={{
                width: '400px',
                height: '400px',
                objectFit: 'cover',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}
