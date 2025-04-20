import { useRef, useState, useEffect } from 'react';

const MIN = 0;
const MAX = 10000;

const PriceRangeSlider = ({ priceRange, setPriceRange }) => {
  const sliderRef = useRef(null);
  const [dragging, setDragging] = useState(null); // 'min' or 'max'

  const getPercent = (value) => ((value - MIN) / (MAX - MIN)) * 100;

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    let percent = ((e.clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    const value = Math.round((percent / 100) * (MAX - MIN) + MIN);

    if (dragging === 'min' && value < priceRange.max - 100) {
      setPriceRange((prev) => ({ ...prev, min: value }));
    }

    if (dragging === 'max' && value > priceRange.min + 100) {
      setPriceRange((prev) => ({ ...prev, max: value }));
    }
  };

  const stopDrag = () => setDragging(null);

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopDrag);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopDrag);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopDrag);
    };
  }, [dragging]);

  return (
    <div className="w-full md:w-80">
      <label className="text-xs text-gray-600 mb-1 block">
        Price Range: ₹{priceRange.min} – ₹{priceRange.max}
      </label>
      <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded-full">
        {/* Active range */}
        <div
          className="absolute h-2 bg-black rounded-full"
          style={{
            left: `${getPercent(priceRange.min)}%`,
            width: `${getPercent(priceRange.max) - getPercent(priceRange.min)}%`,
          }}
        />

        {/* Min thumb */}
        <div
          className="absolute w-4 h-4 bg-black rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer"
          style={{ left: `${getPercent(priceRange.min)}%` }}
          onMouseDown={() => setDragging('min')}
        />

        {/* Max thumb */}
        <div
          className="absolute w-4 h-4 bg-black rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer"
          style={{ left: `${getPercent(priceRange.max)}%` }}
          onMouseDown={() => setDragging('max')}
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
