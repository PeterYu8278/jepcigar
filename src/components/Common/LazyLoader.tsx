import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LazyLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

const LazyLoader: React.FC<LazyLoaderProps> = ({
  children,
  fallback = (
    <div className="flex justify-center items-center py-8">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    </div>
  ),
  threshold = 0.1,
  rootMargin = '50px',
  once = true,
  delay = 0,
  className = '',
  style = {},
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 创建 Intersection Observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            timeoutRef.current = setTimeout(() => {
              setShouldRender(true);
            }, delay);
          } else {
            setShouldRender(true);
          }

          // 如果设置了只加载一次，则停止观察
          if (once) {
            observerRef.current?.unobserve(element);
          }
        } else if (!once) {
          setShouldRender(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, once, delay]);

  return (
    <div
      ref={elementRef}
      className={`lazy-loader ${className}`}
      style={style}
    >
      {shouldRender ? children : fallback}
    </div>
  );
};

export default LazyLoader;
