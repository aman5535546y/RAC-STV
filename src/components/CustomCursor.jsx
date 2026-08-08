import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on fine pointer (desktop / mouse) devices
    const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice()) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let animationFrameId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Check if target is an interactive clickable element
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input, select, textarea, label, ' +
        '.btn, .nav-link, .bento-card, .board-card-container, .cms-item-card, ' +
        '.leaderboard-card, .tab-btn, .modal-tab-btn, .flip-back-btn, .social-icon-btn, ' +
        '.action-dot-btn, .custom-tab, .photo-upload-btn, .filter-chip, [tabindex]:not([tabindex="-1"])'
      );

      setIsHovered(!!interactive);
    };

    // Smooth animation loop using lerp (linear interpolation) for subtle fluid trail
    const render = () => {
      // Lerp factor (0.2 = fluid, responsive trailing follow)
      const ease = 0.22;
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isHovered ? 'cursor-hover' : ''} ${isClicked ? 'cursor-click' : ''} ${isVisible ? 'cursor-visible' : 'cursor-hidden'}`}
      aria-hidden="true"
    />
  );
}
