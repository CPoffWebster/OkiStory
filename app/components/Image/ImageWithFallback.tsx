import React, { useState, useEffect } from "react";

interface ImageWithFallbackProps {
  filename: string;
  error?: boolean;
  defaultImage?: string;
  alt?: string;
  className?: string;
  onLoad?: () => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  filename,
  error,
  defaultImage = "/error_image.png",
  alt,
  className,
  onLoad,
}) => {
  const initialSrc = `/api/images/getImage?filename=${filename}`;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  useEffect(() => {
    if (error) {
      setCurrentSrc(defaultImage);
    }
  }, [error, defaultImage]);

  return (
    <img className={className} src={currentSrc} alt={alt} onLoad={onLoad} />
  );
};

export default ImageWithFallback;
