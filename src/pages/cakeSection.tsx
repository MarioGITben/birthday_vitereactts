import React, { useEffect, useRef, useState } from "react";
import Cake from "../../public/models/cake-v2.png";
import Candle from "../../public/models/candle-21.png";
import { motion } from "framer-motion";
import { MicOff, Mic, ChevronUp, ChevronRight, Info } from "lucide-react";
import ScrollReveal from "scrollreveal";
import confetti from "canvas-confetti";
import { toast, Slide } from "react-toastify";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import type { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import Image from "../../public/models/happy-camille.jpg";
interface Props {
  candleImage: string;
}
function PaperComponent(props: PaperProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}
const CakeSection: React.FC<Props> = ({ candleImage }) => {
  const [micEnabled, setMicEnabled] = useState(false);
  const [micStatus, setMicStatus] = useState("Microphone: Off");
  const [instruction, setInstruction] = useState(
    "Click the flame to blow it out, or enable microphone and blow!"
  );
  const [flameOut, setFlameOut] = useState(false);
  const [availableMics, setAvailableMics] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState<string>("");
  const [showMicList, setShowMicList] = useState(false);
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [open, setOpen] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startMicStream = async (deviceId?: string) => {
    try {
      const constraints = deviceId
        ? { audio: { deviceId: { exact: deviceId } } }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Mic started successfully:", stream);
      console.log("Active tracks:", stream.getTracks());
      streamRef.current = stream;
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const micSource = audioContext.createMediaStreamSource(stream);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      micSource.connect(analyser);
      console.log("Analyser connected. Mic stream fully active.");
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      setMicEnabled(true);
      setMicStatus("Microphone: On - Blow to extinguish!");
      listenForBlow();
    } catch (error) {
      console.error("Error starting mic:", error);
      alert("Microphone access denied or unavailable.");
    }
  };

  const switchMic = async (deviceId: string) => {
    setSelectedMic(deviceId);
    setShowMicList(false);

    if (micEnabled) {
      console.log("Mic is enabled, restarting stream with new mic...");
      streamRef.current?.getTracks().forEach((t) => t.stop());
      await audioContextRef.current?.close();
      await startMicStream(deviceId);
    }
  };

  const disableMic = () => {
    setMicEnabled(false);
    setMicStatus("Microphone: Off");
    setInstruction("Click the flame to blow it out, or enable microphone!");
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();
  };

  const listenForBlow = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const avg =
      dataArrayRef.current.reduce((a, b) => a + b, 0) /
      dataArrayRef.current.length;
    if (avg > 20 && !flameOut) {
      blowOutFlame();
      console.log("🎙️ Mic Average Volume:", avg);
      disableMic();
      return;
    }
    if (!flameOut && micEnabled) requestAnimationFrame(listenForBlow);
  };

  const blowOutFlame = () => {
    if (flameOut) return;
    setFlameOut(true);
    setIsBlownOut(true);
    setTimeout(() => {
      setFlameOut(true);
    }, 800);
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };
  const checkCandle = (img: string) => {
    if (img == "/models/candle-21.png") {
      return true;
    } else {
      return false;
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const enumerateMics = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter((d) => d.kind === "audioinput");
        setAvailableMics(mics);
        if (!selectedMic && mics.length > 0) setSelectedMic(mics[0].deviceId);
      } catch (err) {
        console.error("Could not list microphones:", err);
      }
    };

    enumerateMics();
    navigator.mediaDevices.addEventListener("devicechange", enumerateMics);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", enumerateMics);
    };
  }, [selectedMic]);
  useEffect(() => {
    const sr = ScrollReveal();

    sr.reveal(".text-reveal", {
      duration: 1000,
      origin: "bottom",
      distance: "50px",
      easing: "ease-out",
      reset: true,
    });
    sr.reveal(".cake-animation", {
      duration: 900,
      origin: "bottom",
      distance: "50px",
      delay: 1000,
      easing: "ease-out",
      reset: true,
    });
    sr.reveal(".mic-animation", {
      duration: 900,
      origin: "right",
      distance: "50px",
      delay: 1500,
      easing: "ease-out",
      reset: true,
      afterReveal: () => {
        toast(
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="flex items-center justify-center bg-white rounded-full p-2 shadow-md">
              <Info className="text-pink-500 text-md" />
            </div>

            {/* Text Content */}
            <div className="flex">
              <span className="text-md">{instruction}</span>
            </div>
          </div>,
          {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
          }
        );
      },
    });
  }, [instruction]);
  return (
    <>
      <div className="cake-section flex items-center justify-center min-h-screen px-4 relative overflow-hidden">
        {isBlownOut && (
          <motion.div
            initial={{ opacity: 0, x: -50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }} 
            className="letter flex justify-between text-lg cursor-pointer"
            onClick={handleClickOpen}
          >
            <h3>Open Letter</h3>
            <span>
              <ChevronRight />
            </span>
          </motion.div>
        )}
        {/* Mic Controls */}
        <div className="mic-button flex mic-animation">
          <button
            className="text-white"
            onClick={() =>
              micEnabled ? disableMic() : startMicStream(selectedMic)
            }
          >
            {micEnabled ? <Mic /> : <MicOff />}
          </button>
          <span className="line"></span>
          <div
            className="option relative "
            onClick={() => setShowMicList((prev) => !prev)}
          >
            <span className="cursor-pointer flex justify-center items-center p-1">
              <ChevronUp
                className={`transition-transform ${
                  showMicList ? "rotate-180" : ""
                }`}
              />
            </span>

            {showMicList && availableMics.length > 0 && (
              <div className="dropup absolute bottom-[120%] bg-black text-white text-sm rounded-md p-2 shadow-lg flex flex-col gap-1 z-50">
                <div className="notif-mic">
                  <p>
                    If Microphone is not detected. you may try to restart the
                    browser
                  </p>
                </div>
                {availableMics.map((mic) => (
                  <>
                    <div className="line-select"></div>
                    <div
                      key={mic.deviceId}
                      className={`px-3 py-1 rounded-md cursor-pointer mic-list ${
                        selectedMic === mic.deviceId
                          ? "bg-gray-600 font-bold selected-mic"
                          : ""
                      }`}
                      onClick={() => {
                        switchMic(mic.deviceId);
                        setSelectedMic(mic.deviceId);
                        setShowMicList(false);
                      }}
                    >
                      {mic.label || `Mic ${mic.deviceId.slice(0, 6)}`}
                    </div>
                  </>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cake + Candle */}
        <div className="cake-content flex flex-col items-center space-y-8 justify-evenly">
          <div className="sub-head text-reveal">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold baloo-2-regular text-center">
              Your special day, your special cake 🎂
            </h2>
            <p className="text-white mt-2 text-sm">
              May today be as bright and sweet as your candle light.
            </p>
          </div>

          <div className="relative flex justify-center items-center w-full max-w-xs sm:max-w-sm md:max-w-md cake-animation">
            <img
              src={Cake}
              alt="Cake"
              className="w-full h-auto object-contain cake"
            />

            {/* Flame + Candle */}
            <div className="absolute top-[10%] flex flex-col items-center">
              <div
                className={`flame ${isBlownOut ? "blown-out" : ""} ${
                  checkCandle(candleImage) ? "margin-left-10" : ""
                } w-5 h-8 sm:w-6 sm:h-10 md:w-8 md:h-13 cursor-pointer `}
                onClick={blowOutFlame}
              ></div>
              <img
                src={candleImage}
                alt="Candle"
                className={` ${
                  checkCandle(candleImage)
                    ? "w-12 sm:w-16 md:w-20"
                    : "w-14 sm:w-20 md:w-24 margin-bottom"
                }  object-contain`}
              />
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        className=""
      >
        <div
          id="draggable-dialog-title"
          style={{ cursor: "move", padding: "8px" }}
        />

        <div className="letter-content paprika-regular ">
          {/* Decorative pastel circles */}
          <div className="decorative-circle circle1"></div>
          <div className="decorative-circle circle2"></div>

          {/* Top-right image */}
          <img
            src={Image}
            alt="Birthday Cake"
            className="card-img"
          />

          <p className="greeting">Hi Camille,</p>
          <div className="message text-1xl ">
            <h2>Happy Birthday 🥳🎉</h2>
            <p>
              Wish you had a wonderful day today and sweet
              memories.
              <br />
              May your year ahead sparkle with happiness and succeed in everything that you worked hard for ✨
              <br />
              Hope to see you more in our senior year at school :{">"}
            </p>
            <p className="text-end">- Bellen</p>
          </div>
        </div>

        <Button
          onClick={handleClose}
          style={{ margin: "12px auto", display: "block" }}
          className="dialog-btn"
        >
          Close
        </Button>
      </Dialog>
    </>
  );
};

export default CakeSection;
