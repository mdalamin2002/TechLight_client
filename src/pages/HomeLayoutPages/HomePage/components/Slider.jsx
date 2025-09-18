import { useState } from "react";

export default function Slider({ slides }) {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="relative">
      {/* Slide */}
      <div className="relative overflow-hidden flex items-center justify-between text-white h-[390px]">
        
        <img
          src={slides[activeSlide].image}
          alt={slides[activeSlide].title}
          className="w-full object-contain"
        />
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            className={`w-3 h-3 rounded-full ${
              idx === activeSlide ? "bg-black" : "bg-gray-400"
            }`}
            onClick={() => setActiveSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
}
