import React, { useState, useEffect } from "react";
import ScrollReveal from "scrollreveal";
import { delay, motion } from "framer-motion";
import luffyImage from "../../public/models/celebluffyv1.png";
import luffyImagev2 from "../../public/models/celebluffyv2.png";
import luffyImagev3 from "../../public/models/celebluffyv3.png";  
import InputDate from "../components/input-date";

const Main = () => {
  const [currentImage, setCurrentImage] = useState(luffyImage);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [startCycle, setStartCycle] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  ScrollReveal().reveal('.logo');
  ScrollReveal().reveal('.tagline', { delay: 500 });

  const greetings = [
    "HAPPY BIRTHDAY!🎉",
    "WISHING YOU A DAY FILLED WITH LOVE AND JOY ❤️",
    "STAY PRETTY🥰",
    "KEEP SMILING😊",
  ];
  useEffect(() => {

    const sr = ScrollReveal();

    sr.reveal(".reveal", {
      duration: 500, 
      origin: "bottom", 
      distance: "50px", 
      delay: 200, 
      easing: "ease-in-out",
      reset: true, 
    });
    sr.reveal(".image-animation", {
      duration: 900, 
      origin: "right", 
      distance: "50px", 
      delay: 1000, 
      easing: "ease-out",
      reset: true, 
    })
    sr.reveal(".text-animation", {
      duration: 900, 
      origin: "left", 
      distance: "50px", 
      delay: 1000,
      easing: "ease-out",
      reset: true,
    })
  }, []);

  useEffect(() => {
    if (startCycle) {
      const interval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % greetings.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [startCycle, greetings.length]);

  
  useEffect(() => {
    if (startCycle && !isHovered) {
      const interval = setInterval(() => {
        setCurrentImage((prev) =>
          prev === luffyImage ? luffyImagev2 : luffyImage
        );
      }, 700);
      return () => clearInterval(interval);
    }
  }, [startCycle, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCurrentImage(luffyImagev3);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImage(luffyImage);
  };

  //###################################
  //      THIS IS OLD ANIMATION
  //###################################

  // const containerVariants = {
  //   hidden: { opacity: 0, y: 100 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.6,
  //       when: "beforeChildren", 
  //     },
  //   },
  // };

  // const textVariants = {
  //   hidden: { opacity: 0, x: -120 },
  //   visible: {
  //     opacity: 1,
  //     x: 0,
  //     transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  //   },
  // };

  // const imageVariants = {
  //   hidden: { opacity: 0, x: 120 },
  //   visible: {
  //     opacity: 1,
  //     x: 0,
  //     transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  //   },
  // };

  const textChanging = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeIn" },
    },
  }; 
  
  return (
    <>
      <motion.div
      initial="hidden"
      animate="visible"
      // variants={containerVariants}
      onAnimationComplete={() => setStartCycle(true)}
      className={`section-1 flex items-center max-w-2/4 min-vh-3/4 justify-center overflow-hidden z-11 `}
    >
      <div className={`hero-content ${isHovered ? "border-hover" : ""}  rounded-3xl flex flex-col md:flex-row items-center space-y-8 md:space-y-5 md:space-x-16 justify-evenly gap-4 reveal`}>
        <motion.div
          // variants={textVariants}
          className="lg:text-7xl md:text-4xl sm:text-4xl head-title font-bold baloo-2-regular text-center md:text-left text-animation"
        >
          <motion.p
            key={currentTextIndex}
            variants={textChanging}
            initial="hidden"
            animate="visible"
          >
            {greetings[currentTextIndex]}
          </motion.p>
        </motion.div>

        <motion.div 
        // variants={imageVariants} 
        className="relative hero-image image-animation">
          <motion.img
            src={currentImage}
            alt="Luffy"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="rounded-full"
            width={550}
            style={{ imageRendering: "pixelated" }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </motion.div>
      </div>
    </motion.div>
    </>
    
  );
};

export default Main;
