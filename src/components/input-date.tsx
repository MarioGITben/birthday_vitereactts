import React, { useState } from "react";
import { Check } from "lucide-react";
import OrbitalDatePicker from "./orbital-date-picker";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { delay, motion } from "framer-motion";

interface Props {
  onSubmit:(year: number) => void
}

const InputDate: React.FC<Props> = ({onSubmit}) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [currentYear] = useState(new Date().getFullYear())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  const handleClickOpen = (message: string) => {
    setDialogMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const SubmitDate = () => {
    if (selectedYear >= currentYear) {
      handleClickOpen("You selected a year in the future. Are you sure?");
    } else if (selectedYear >= 2005) {
      handleClickOpen("This doesn't seem to be right.");
    } else {
      onSubmit(selectedYear)
      setShowPicker(false)
    }
  };
  return (
    <div 
    className="input-date flex flex-col justify-center items-center z-50">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center justify-evenly mb-4 gap-4"
      >
        {/* Label */}
        <label htmlFor="birthyear" className="text-white">
          Enter your birth year:
        </label>

        {/* Clickable Year Display */}
        <p
          className="birth-year flex items-center justify-between gap-1 cursor-pointer text-pink-300 hover:text-pink-400"
          onClick={() => setShowPicker((prev) => !prev)}
        >
          --/--/{selectedYear}
        </p>

        {/* Submit button */}
        <button
          className="submit-button flex items-center bg-pink-500 hover:bg-pink-600 text-white px-3 py-2 rounded-md"
          type="button"
          onClick={SubmitDate}
        >
          <Check />
        </button>
      </form>

      {/* Orbital Picker Modal */}
      {showPicker && (
        <OrbitalDatePicker
          initialYear={selectedYear}
          onClose={() => setShowPicker(false)}
          onYearSelect={(year) => setSelectedYear(Math.round(year))}
        />
      )}

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="custom-dialog"
      >
        <DialogTitle id="alert-dialog-title">Birth Year Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InputDate;
