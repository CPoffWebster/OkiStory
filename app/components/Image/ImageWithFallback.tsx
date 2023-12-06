import React, { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  defaultImage?: string;
  alt?: string;
  className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  defaultImage = "/error_image.png",
  alt,
  className,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      className={className}
      src={currentSrc}
      alt={alt}
      onError={(err) => {
        setCurrentSrc(defaultImage);
      }}
    />
  );
};

export default ImageWithFallback;
