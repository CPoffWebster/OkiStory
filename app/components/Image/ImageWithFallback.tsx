import React, { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  defaultImage?: string;
  alt?: string;
  className?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  defaultImage = "/happy_book.png",
  alt,
  className,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      className={className}
      src={currentSrc}
      alt={alt}
      onLoad={(test) => {
        // console.log("loaded", src, test);
      }}
      onError={(err) => {
        // console.log("error", err);
        setCurrentSrc(defaultImage);
      }}
    />
  );
};

export default ImageWithFallback;
