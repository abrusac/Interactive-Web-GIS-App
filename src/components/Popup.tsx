import React from "react";

interface PopupProps {
  data: {
    clickedCoordinate: Array<number>;
    parcelNumber: string;
    area: string;
  } | null;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ data }) => {
  if (!data) return null;
  const [x, y] = data.clickedCoordinate;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  let translateX = x;
  let translateY = y;

  if (x > screenWidth - 180) {
    translateX = x - 180;
  }
  if (y > screenHeight - 120) {
    translateY = y - 120;
  }

  return (
    <div
      className="absolute top-1 left-1 bg-white shadow-xl border border-gray-200 rounded px-4 py-3"
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
      }}
    >
      <h3 className="mb-1">Cadastral parcel</h3>
      <p className="text-sm">
        Number <strong>{data.parcelNumber}</strong>
      </p>
      <p className="text-sm">
        Area <strong>{data.area} m²</strong>
      </p>
    </div>
  );
};

export default Popup;
