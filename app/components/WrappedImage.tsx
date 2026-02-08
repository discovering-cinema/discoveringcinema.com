import React from 'react';
import Image from 'next/image';

interface WrappedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  align?: 'left' | 'right';
}

export default function WrappedImage({
  src,
  alt,
  width = 300,
  height = 200,
  align = 'left',
}: WrappedImageProps) {
  const floatClass =
    align === 'left' ? 'float-left mr-6 mb-4' : 'float-right ml-6 mb-4';

  return (
    <div className={`${floatClass} not-prose`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="rounded-lg object-cover"
      />
    </div>
  );
}
