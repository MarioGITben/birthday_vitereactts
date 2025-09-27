import React, { useEffect } from "react";

interface Props {
  birthYear: number;
  onSelectImage: (imagePath: string) => void;
}

const AgeResult: React.FC<Props> = ({ birthYear, onSelectImage }) => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  const getAgeImage = (): string => {
    if (age === 20) {
      return "/models/candle-20.png";
    } else if (age === 21) {
      return "/models/candle-21.png";
    } else if (age === 22) {
      return "/models/candle-22.png";
    } else if (age === 23) {
      return "./models/candle-23.png"
    }else {
      return "/models/candle.png";
    }
  };

  const imagePath = getAgeImage();

  useEffect(() => {
    onSelectImage(imagePath);
  }, [imagePath, onSelectImage]);

  return null; 
};

export default AgeResult;
