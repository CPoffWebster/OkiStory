import React, { useState, useEffect } from "react";

interface ImageWithFallbackProps {
  filename: string;
  imageType: string;
  error?: boolean;
  defaultImage?: string;
  alt?: string;
  className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  filename,
  imageType,
  error,
  defaultImage = "/error_image.png",
  alt,
  className,
}) => {
  const initialSrc = `/api/images/getImage?filename=${filename}&imageType=${imageType}`;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  useEffect(() => {
    if (error) {
      setCurrentSrc(defaultImage);
    }
  }, [error, defaultImage]);

  return <img className={className} src={currentSrc} alt={alt} />;
};

export default ImageWithFallback;
