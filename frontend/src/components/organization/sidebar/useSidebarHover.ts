'use client';
import { useEffect } from 'react';
import type React from 'react';

interface UseSidebarHoverProps {
  sidebarRef: React.RefObject<HTMLDivElement>;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export function useSidebarHover({
  sidebarRef,
  isExpanded,
  setIsExpanded,
}: UseSidebarHoverProps) {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;

      const sidebarRect = sidebarRef.current.getBoundingClientRect();

      // Check if mouse is within the sidebar bounds
      const isOverSidebar =
        e.clientX >= sidebarRect.left &&
        e.clientX <= sidebarRect.right &&
        e.clientY >= sidebarRect.top &&
        e.clientY <= sidebarRect.bottom;

      if (isOverSidebar) {
        if (!isExpanded) {
          setIsExpanded(true);
        }
      } else {
        if (isExpanded) {
          setIsExpanded(false);
        }
      }
    };

    // Add mousemove listener to document to track mouse position globally
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sidebarRef, isExpanded, setIsExpanded]);
}
