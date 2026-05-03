'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface LazyImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallback?: string;
  blurDataURL?: string;
}

export function LazyImage({ 
  src, 
  alt, 
  fallback = '/images/placeholder.png',
  blurDataURL,
  className,
  ...props 
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <Image
        src={hasError ? fallback : src}
        alt={alt}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        {...props}
      />
    </div>
  );
}
