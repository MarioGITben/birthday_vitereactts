import React, { useState, useEffect, useCallback } from "react";
import luffyImagev3 from "../../public/models/celebluffyv3.png";
import moonBg from "../../public/models/moon-bg-1.jpg";
import lotus from "../../public/models/valo-bg.jpg";
import luffyImageCard from "../../public/models/luffyv3.png";
import pinkRose from "../../public/models/pink-rose.jpeg";
import chopperImage from "../../public/models/tonytonychoppa.png";
import zoroImage from "../../public/models/zorochibiv1.png";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ScrollReveal from "scrollreveal";

interface CardItems {
  id: number;
  title: string;
  alias: string;
  description: string;
  imageUrl: string;
  secret_title: string;
  secret_message: string;
}

const items: CardItems[] = [
  {
    id: 1,
    title: "CHASE THOSE",
    alias: "Moss Head",
    description: `"When the world shoves you around, you've just gotta stand up and shove back. It isn't like you can do anything just by giving excuses." —  Roronoa Zoro`,
    imageUrl: zoroImage,
    secret_title: "",
    secret_message: "",
  },
  {
    id: 2,
    title: "DREAMS,",
    alias: "",
    description: `"Shoot for the Moon; even if you miss it, you will land among the stars." — Les Brown`,
    imageUrl: moonBg,
    secret_title: "",
    secret_message: "",
  },
  {
    id: 3,
    title: "ENJOY LIFE",
    alias: "Cotton Candy Lover",
    description: `"Nothing is impossible for a man with a skull flag! isn't that right, doctor?" —  Tony Tony Chopper`,
    imageUrl: chopperImage,
    secret_title: "",
    secret_message: "",
  },
  {
    id: 4,
    title: "AND REMEMBER",
    alias: "",
    description: `"If there's no place to go, i will open up one myself. — Ao Bing"`,
    imageUrl: pinkRose,
    secret_title: "",
    secret_message: "",
  },
  {
    id: 5,
    title: "TO RELAX!",
    alias: "Mugiwara Luffy",
    description: `"Don't Have Any Regrets, No Matter What Happens." — Monkey D. Luffy`,
    imageUrl: luffyImageCard,
    secret_title: "DID YOU KNOW??",
    secret_message:
      "Alam mo bang may gusto ako sayo simula pa nung first year it was on first sem midterm? Don't know why but i like you. Anyway, Goodluck sa darating na projects/activities. nawa'y pumasa tayo <3  ",
  },
];

const CardSection: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<CardItems | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = useCallback(
    (id: number) => {
      if (!isMobile) setHoveredItem(id);
    },
    [isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) setHoveredItem(null);
  }, [isMobile]);

  const handleClick = useCallback(
    (item: CardItems, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (isMobile) {
        setExpandedItem(expandedItem === item.id ? null : item.id);
      } else {
        setSelectedItem(item);
      }
    },
    [isMobile, expandedItem]
  );

  const handleOutsideClick = useCallback(() => {
    if (isMobile && expandedItem) setExpandedItem(null);
  }, [isMobile, expandedItem]);

  useEffect(() => {
    if (isMobile) {
      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
    }
  }, [isMobile, handleOutsideClick]);

  useEffect(() => {
    const sr = ScrollReveal();
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el, index) => {
      sr.reveal(el, {
        duration: 900,
        origin: "bottom",
        distance: "50px",
        delay: index * 500,
        easing: "ease-out",
        reset: true,
      });
    });
  }, []);
  return (
    <>
      <div className="card-section min-h-screen flex items-center justify-center ">
        <div className="card-container">
          <div className="flex gap-2.5 card-layout overflow-visible md:flex-row flex-col">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`
                  reveal relative overflow-hidden cursor-pointer rounded-2xl bg-cover bg-center bg-no-repeat
                  transition-all duration-600 ease-out opacity-0 animate-slideIn
                  md:flex-1 md:h-auto h-48 card
                  ${
                    hoveredItem === item.id
                      ? "md:flex-[2.5] transform md:-translate-y-2.5 scale-105 md:scale-100"
                      : ""
                  }
                  ${
                    hoveredItem !== null && hoveredItem !== item.id
                      ? "opacity-70"
                      : "opacity-100"
                  }
                  ${
                    isMobile && expandedItem === item.id
                      ? "h-100 scale-[1.02] z-10"
                      : ""
                  }
                `}
                style={{
                  backgroundImage: `url(${item.imageUrl})`,
                  boxShadow:
                    hoveredItem === item.id
                      ? "0 25px 50px rgba(0, 0, 0, 0.4)"
                      : "0 10px 20px rgba(0, 0, 0, 0.3)",
                  animationDelay: `${(index + 1) * 0.1}s`,
                }}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => handleClick(item, e)}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.98)")
                }
                onMouseUp={(e) => (e.currentTarget.style.transform = "")}
              >
                {/* Title overlay */}
                <div
                  className={`
                    absolute z-10 transition-opacity duration-700
                    ${
                      !isMobile && hoveredItem === item.id
                        ? "opacity-0"
                        : "opacity-100"
                    }
                    ${isMobile && expandedItem === item.id ? "hidden" : ""}
                    ${
                      isMobile
                        ? "top-4 left-4 right-4"
                        : "top-0 left-0 right-0 bottom-0 flex items-center justify-center"
                    }
                  `}
                >
                  <h3
                    className={`text-white text-6xl font-bold drop-shadow-lg  px-3 py-6 rounded-lg whitespace-nowrap
                    ${isMobile ? "rotate-360" : "-rotate-90"}
                    `}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Expanded text */}
                <div
                  className={`
                  absolute z-10 transition-all duration-500 ease-out
                  card-description
                  ${
                    !isMobile && hoveredItem === item.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }
                  ${
                    isMobile && expandedItem === item.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6"
                  }
                  ${isMobile ? "bottom-4 left-4 right-4" : "bottom-6 left-6"}
                  
                `}
                >
                  <h3 className=" text-4xl font-bold mb-2 drop-shadow-lg text-rose-400">
                    {item?.alias?.trim() ? item.alias : item?.title}
                  </h3>
                  <p className=" text-white text-lg opacity-90 leading-relaxed max-w-lg drop-shadow-lg">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* MODAL */}
      <Dialog
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="w-full text-center animate-slide-up custom-dialog"
      >
        <DialogTitle
          id="alert-dialog-title"
          className="text-2xl text-foreground mb-4"
        >
          {selectedItem?.secret_title?.trim()
            ? selectedItem.secret_title
            : selectedItem?.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="text-muted-foreground leading-relaxed mb-6"
          >
            {selectedItem?.secret_message?.trim()
              ? selectedItem.secret_message
              : selectedItem?.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelectedItem(null)}
            className="bg-gradient-to-r from-gradient-start to-gradient-end text-white px-6 py-2 rounded-full hover:shadow-lg transition-shadow"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardSection;
