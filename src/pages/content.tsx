import React, { useState } from "react";
import Main from "./main";
import CakeContent from "./cakeSection";
import InputDate from "../components/input-date";
import { motion } from "framer-motion";
import Age from "../components/age-checking";
import CardSection from "./cardSection"
import Footer from "../components/footer"
const Content = () => {
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [candleImage, setCandleImage] = useState<string>("")
  const inputDateEntry = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeIn", delay: 5 },
    },
  };

  return (
    <div className="content flex flex-col items-center justify-center relative ">
      <Main />
      {!birthYear ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={inputDateEntry}
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50"
        >
          <InputDate onSubmit={(year) => setBirthYear(year)} />
        </motion.div>
      ) : (
        <>
          <Age birthYear={birthYear} onSelectImage={(img) => setCandleImage(img)}/>
          <CakeContent candleImage={candleImage}/>
          <CardSection/>
          <Footer/>
        </>
      )}
    </div>
  );
};

export default Content;
