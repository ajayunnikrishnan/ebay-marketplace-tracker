import { useEffect, useState } from "react";

interface CarouselProps {
  images: string[];
  size?: string;
  interval?: number;
}

export const Carousel = ({ images, size = "max-h-96", interval = 3500 }: CarouselProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, interval);
    return () => clearInterval(slideInterval);
  }, [images.length, interval]);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl flex-1 lg:w-1/2 lg:h-auto mx-auto lg:mx-0 max-w-3xl ${size}`}
    >
      <div
        className="flex h-full"
        style={{
          transform: `translateX(${- (index % images.length) * 100}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {[...images, ...images].map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Slide ${idx + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
};
