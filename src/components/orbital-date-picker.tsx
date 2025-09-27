import React, { useEffect, useRef, useState } from "react";
import "../styles/native/orbit.css";
import { delay, motion } from "framer-motion";
interface Props {
  initialYear: number;
  onYearSelect: (year: number) => void;
  onClose: () => void;
}

const OrbitalDatePicker: React.FC<Props> = ({
  initialYear,
  onYearSelect,
  onClose,
}) => {
  const [year, setYear] = useState(initialYear);
  const [visualRotation, setVisualRotation] = useState(0);

  const orbitRef = useRef<HTMLDivElement | null>(null);
  const planetRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const lastAngleRef = useRef(0);
  const totalRotationRef = useRef(0);

  const DatePickerAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  useEffect(() => {
    totalRotationRef.current = 0;
    setVisualRotation(0);
    setYear(initialYear);
  }, []);

  useEffect(() => {
    const orbit = orbitRef.current;
    const planet = planetRef.current;
    if (!orbit || !planet) return;

    const getCoordinates = (clientX: number, clientY: number) => {
      const rect = orbit.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      return { dx, dy };
    };

    const startDrag = (clientX: number, clientY: number) => {
      isDraggingRef.current = true;
      const { dx, dy } = getCoordinates(clientX, clientY);
      lastAngleRef.current = Math.atan2(dy, dx);
    };

    const moveDrag = (clientX: number, clientY: number) => {
      if (!isDraggingRef.current) return;
      const { dx, dy } = getCoordinates(clientX, clientY);
      const currentAngle = Math.atan2(dy, dx);

      let angleDiff = currentAngle - lastAngleRef.current;
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      totalRotationRef.current += angleDiff;
      const newYear =
        initialYear + (totalRotationRef.current / (2 * Math.PI)) * 12;

      setYear(newYear);
      setVisualRotation(totalRotationRef.current * (180 / Math.PI));
      lastAngleRef.current = currentAngle;
    };

    const endDrag = () => {
      if (isDraggingRef.current) {
        onYearSelect(Math.round(year));
      }
      isDraggingRef.current = false;
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => startDrag(e.clientX, e.clientY);
    const handleMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    const handleMouseUp = () => endDrag();

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      moveDrag(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = () => endDrag();

    planet.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    planet.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      planet.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      planet.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [initialYear, year, onYearSelect]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={DatePickerAnimation}
      className="main-container z-100"
    >
      <div className="card">
        <div className="header">
          <h1 className="title">Drag the planet to select year</h1>
        </div>

        <div className="orbital-container" ref={orbitRef}>
          {/* Sun */}
          <div className="central-sun">
            <div className="sun-inner">
              <div className="year-display">{Math.round(year)}</div>
            </div>
          </div>

          {/* Orbit */}
          <div className="orbit-track">
            <div className="orbit-glow"></div>

            <div
              ref={planetRef}
              className="planet"
              style={{
                transform: `translate(-50%, -50%) rotate(${visualRotation}deg) translate(110px)`,
                transformOrigin: "center center",
                cursor: isDraggingRef.current ? "grabbing" : "grab",
              }}
            >
              <div className="planet-core"></div>
              <div className="planet-highlight"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrbitalDatePicker;
