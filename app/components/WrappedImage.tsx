import React from 'react';
import Image from 'next/image';

interface WrappedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  align?: 'left' | 'right';
  description?: string;
}

export default function WrappedImage({
  src,
  alt,
  width = 300,
  height = 200,
  align = 'left',
  description,
}: WrappedImageProps) {
  const floatClass =
    align === 'left' ? 'float-left mr-6 mb-4' : 'float-right ml-6 mb-4';

  return (
    <div className={`${floatClass} not-prose max-w-[300px]`}>
      <Image
        src={src}
        alt={description || alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="rounded-lg object-cover"
      />
      {description && (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-tight italic">
          {description}
        </p>
      )}
    </div>
  );
}
