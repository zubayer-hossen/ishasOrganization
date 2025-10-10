// src/components/common/BannerSlider.jsx
import { useState, useEffect } from "react";

export default function BannerSlider({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="w-full h-64 relative overflow-hidden rounded shadow">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt="banner"
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
