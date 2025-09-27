import { useState, useEffect } from "react";
import "./App.css";
import Content from "./pages/content";
import FLoatingBalloonBg from "./components/floating-balloon-bg";
import "./index.css";

import { ToastContainer } from "react-toastify";
import { Slide as ToastSlide } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import BgGradient from "./components/bgGradient";
import LoadingScreen from "./components/loading-screen";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = Slide;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setOpen(true); // 🔑 automatically open modal on mobile
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // Show loading screen first
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center min-h-screen justify-center text-white z-50">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <>
      {/* Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={ToastSlide}
      />

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <BgGradient />
      </div>
      <div className="fixed inset-0 z-12">
        <FLoatingBalloonBg />
      </div>

      {/* Content */}
      <div className="relative">
        <Content />

        {/* Mobile-only modal */}
        {isMobile && (
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            className="custom-dialog"
          >
            <DialogTitle>{"Ehh.."}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                This website is not yet optimized for mobile screen sizes. For better experience, please use desktop screen size :{">"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </>
  );
}

export default App;
