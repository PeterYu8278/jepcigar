import React, { useState, useEffect } from 'react';
import { Image, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import LazyLoader from './LazyLoader';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
  preview?: boolean;
  loading?: 'lazy' | 'eager';
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  fallback,
  width,
  height,
  className = '',
  style = {},
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  preview = true,
  loading = 'lazy',
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 预加载图片
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  // 处理图片加载
  const handleImageLoad = async () => {
    if (!src || isLoaded) return;

    try {
      setIsLoading(true);
      setHasError(false);
      
      await preloadImage(src);
      setImageSrc(src);
      setIsLoaded(true);
      onLoad?.();
    } catch (error) {
      console.error('Image load error:', error);
      setHasError(true);
      if (fallback && fallback !== src) {
        try {
          await preloadImage(fallback);
          setImageSrc(fallback);
        } catch (fallbackError) {
          console.error('Fallback image load error:', fallbackError);
        }
      }
      onError?.();
    } finally {
      setIsLoading(false);
    }
  };

  // 当组件挂载时开始加载
  useEffect(() => {
    if (src && !isLoaded && !isLoading && loading === 'lazy') {
      handleImageLoad();
    }
  }, [src, isLoaded, isLoading, loading]);

  // 加载指示器
  const loadingIndicator = (
    <div 
      className="flex items-center justify-center bg-gray-100"
      style={{ width, height }}
    >
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} 
        size="large"
      />
    </div>
  );

  // 错误占位符
  const errorPlaceholder = (
    <div 
      className="flex items-center justify-center bg-gray-200 text-gray-500"
      style={{ width, height }}
    >
      <div className="text-center">
        <div className="text-2xl mb-2">📷</div>
        <div className="text-sm">图片加载失败</div>
      </div>
    </div>
  );

  // 如果使用eager加载，直接渲染图片
  if (loading === 'eager') {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        preview={preview}
        fallback={fallback}
        onLoad={onLoad}
        onError={onError}
        placeholder={loadingIndicator}
      />
    );
  }

  return (
    <LazyLoader
      threshold={threshold}
      rootMargin={rootMargin}
      fallback={loadingIndicator}
      className={className}
      style={style}
    >
      <div
        style={{ width, height }}
        className="lazy-image-container"
      >
        {hasError ? (
          errorPlaceholder
        ) : (
          <Image
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            preview={preview}
            fallback={fallback}
            onLoad={onLoad}
            onError={onError}
            placeholder={loadingIndicator}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </LazyLoader>
  );
};

export default LazyImage;
