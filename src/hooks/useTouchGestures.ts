import { useRef, useCallback, useEffect } from 'react';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  swipeThreshold?: number;
  pinchThreshold?: number;
  longPressDelay?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

const useTouchGestures = (options: TouchGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onTap,
    onDoubleTap,
    onLongPress,
    swipeThreshold = 50,
    pinchThreshold = 0.1,
    longPressDelay = 500,
  } = options;

  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);
  const initialDistanceRef = useRef<number>(0);

  // 计算两点之间的距离
  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 计算两点之间的角度 (保留备用)
  // const getAngle = (touch1: Touch, touch2: Touch): number => {
  //   const dx = touch1.clientX - touch2.clientX;
  //   const dy = touch1.clientY - touch2.clientY;
  //   return Math.atan2(dy, dx) * 180 / Math.PI;
  // };

  // 处理触摸开始
  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    const touchPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    touchStartRef.current = touchPoint;

    // 长按检测
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
    }

    // 双指触摸检测（缩放手势）
    if (event.touches.length === 2 && onPinch) {
      initialDistanceRef.current = getDistance(event.touches[0], event.touches[1]);
    }
  }, [onLongPress, onPinch, longPressDelay]);

  // 处理触摸移动
  const handleTouchMove = useCallback((event: TouchEvent) => {
    // 清除长按定时器
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // 缩放手势处理
    if (event.touches.length === 2 && onPinch && initialDistanceRef.current > 0) {
      const currentDistance = getDistance(event.touches[0], event.touches[1]);
      const scale = currentDistance / initialDistanceRef.current;
      
      if (Math.abs(scale - 1) > pinchThreshold) {
        onPinch(scale);
        initialDistanceRef.current = currentDistance;
      }
    }
  }, [onPinch, pinchThreshold]);

  // 处理触摸结束
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    // 清除长按定时器
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (!touchStartRef.current) return;

    const touch = event.changedTouches[0];
    const touchPoint: TouchPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    touchEndRef.current = touchPoint;

    // 计算移动距离和时间
    const deltaX = touchPoint.x - touchStartRef.current.x;
    const deltaY = touchPoint.y - touchStartRef.current.y;
    const deltaTime = touchPoint.time - touchStartRef.current.time;

    // 判断是否为滑动手势
    if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
      // 水平滑动
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // 垂直滑动
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    } else if (deltaTime < 300) {
      // 快速点击，可能是点击或双击
      const now = Date.now();
      const timeSinceLastTap = now - lastTapRef.current;

      if (timeSinceLastTap < 300 && onDoubleTap) {
        // 双击
        onDoubleTap();
        lastTapRef.current = 0; // 重置，避免连续双击
      } else if (onTap) {
        // 单击
        onTap();
        lastTapRef.current = now;
      }
    }

    // 重置状态
    touchStartRef.current = null;
    touchEndRef.current = null;
    initialDistanceRef.current = 0;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, onDoubleTap, swipeThreshold]);

  // 处理触摸取消
  const handleTouchCancel = useCallback(() => {
    // 清除长按定时器
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // 重置状态
    touchStartRef.current = null;
    touchEndRef.current = null;
    initialDistanceRef.current = 0;
  }, []);

  // 绑定触摸事件
  const bindTouchEvents = useCallback((element: HTMLElement) => {
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return {
    bindTouchEvents,
  };
};

export default useTouchGestures;
