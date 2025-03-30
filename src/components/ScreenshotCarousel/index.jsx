import React, { useEffect, useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"

const ScreenshotCarousel = () => {
  const [preloadedImages, setPreloadedImages] = useState([])
  const swiperRef = useRef(null)

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/Evolution-X/www_gitres/refs/heads/main/screenshots/screenshots.json",
        )
        const data = await response.json()

        const imageUrls = data.map(
          (screenshot) =>
            `https://github.com/Evolution-X/www_gitres/blob/main/screenshots/${screenshot}.png?raw=true`,
        )

        const imagePromises = imageUrls.map((url) => {
          return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = url
            img.onload = () => resolve(url)
            img.onerror = reject
          })
        })

        const loadedImages = await Promise.all(imagePromises)
        setPreloadedImages(loadedImages)
      } catch (error) {
        console.error("Error fetching screenshots:", error)
      }
    }
    fetchScreenshots()
  }, [])

  useEffect(() => {
    if (swiperRef.current && preloadedImages.length > 0) {
      const swiperInstance = swiperRef.current.swiper

      swiperInstance.slideTo(3)
    }
  }, [preloadedImages])

  return (
    <section id="screenshots" className="scroll-margin py-12 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full max-w-5xl">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-32 bg-gradient-to-r from-[#040214] to-transparent"></div>
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-32 bg-gradient-to-l from-[#040214] to-transparent"></div>
          <Swiper
            ref={swiperRef}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={3}
            loop={true}
            initialSlide={3}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 1.5,
              slideShadows: true,
            }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            modules={[EffectCoverflow, Autoplay, Pagination]}
            className="w-full"
          >
            {preloadedImages.map((url, index) => (
              <SwiperSlide key={index} className="relative h-auto w-72">
                <div className="relative">
                  <img
                    src={url}
                    alt={`Screenshot ${index + 1}`}
                    className="swiper-slide-img rounded-lg object-cover shadow-lg transition-all duration-300"
                  />
                  <div className="swiper-slide-overlay absolute inset-0 hidden bg-[#0060ff] opacity-30 mix-blend-lighten transition-opacity duration-300"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="custom-pagination mt-6"></div>
        </div>
      </div>

      <style>
        {`
          .swiper-slide:not(.swiper-slide-active) .swiper-slide-img {
            border-radius: 12px;
          }

          .swiper-slide:not(.swiper-slide-active) .swiper-slide-overlay {
            display: block;
            border-radius: 12px;
          }

          .custom-pagination .swiper-pagination-bullet {
            background: #0060ff !important;
            width: 12px;
            height: 12px;
            margin: 0 5px;
            opacity: 0.6;
          }

          .custom-pagination .swiper-pagination-bullet-active {
            opacity: 1;
          }
        `}
      </style>
    </section>
  )
}

export default ScreenshotCarousel
