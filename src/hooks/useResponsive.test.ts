/**
 * @fileoverview Tests for useResponsive hook
 * @since 1.0.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useResponsive, BREAKPOINTS } from './useResponsive';

// Mock window object
const mockWindow = {
  innerWidth: 1200,
  innerHeight: 800,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Store original values
const originalWindow = global.window;

describe('useResponsive', () => {
  beforeEach(() => {
    // Setup mock window
    Object.defineProperty(global, 'window', {
      writable: true,
      value: mockWindow,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original window
    global.window = originalWindow;
  });

  it('returns desktop device type for large screens', () => {
    mockWindow.innerWidth = 1400;
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.deviceType).toBe('desktop');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
  });

  it('returns tablet device type for medium screens', () => {
    mockWindow.innerWidth = 900;
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.deviceType).toBe('tablet');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
  });

  it('returns mobile device type for small screens', () => {
    mockWindow.innerWidth = 600;
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.deviceType).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
  });

  it('returns current window dimensions', () => {
    mockWindow.innerWidth = 1200;
    mockWindow.innerHeight = 800;
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.windowSize.width).toBe(1200);
    expect(result.current.windowSize.height).toBe(800);
  });

  it('handles window undefined on server-side', () => {
    // Temporarily remove window
    const tempWindow = global.window;
    delete (global as any).window;
    
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.windowSize.width).toBe(1200); // default value
    expect(result.current.windowSize.height).toBe(800); // default value
    expect(result.current.deviceType).toBe('desktop'); // default device type
    
    // Restore window
    global.window = tempWindow;
  });

  it('adds resize event listener on mount', () => {
    renderHook(() => useResponsive());
    
    expect(mockWindow.addEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });

  it('removes resize event listener on unmount', () => {
    const { unmount } = renderHook(() => useResponsive());
    
    unmount();
    
    expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });

  it('updates device type when window is resized', () => {
    mockWindow.innerWidth = 1200; // desktop
    const { result } = renderHook(() => useResponsive());
    
    expect(result.current.deviceType).toBe('desktop');
    
    // Simulate resize to mobile
    act(() => {
      mockWindow.innerWidth = 600;
      mockWindow.innerHeight = 900;
      // Trigger the resize handler
      const resizeHandler = mockWindow.addEventListener.mock.calls
        .find(call => call[0] === 'resize')?.[1];
      if (resizeHandler) {
        resizeHandler();
      }
    });
    
    expect(result.current.deviceType).toBe('mobile');
    expect(result.current.windowSize.width).toBe(600);
    expect(result.current.windowSize.height).toBe(900);
  });

  describe('BREAKPOINTS', () => {
    it('has correct breakpoint values', () => {
      expect(BREAKPOINTS.mobile).toBe(768);
      expect(BREAKPOINTS.tablet).toBe(1024);
      expect(BREAKPOINTS.desktop).toBe(1200);
    });
  });
});
