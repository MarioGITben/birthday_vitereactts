import React, { useEffect, useRef, useState } from "react";
import RedBalloon from "../../public/models/balloonv1.png"
import YellowBalloon from "../../public/models/balloonv2.png"
import BlueBalloon from "../../public/models/balloonv3.png"
import PinkBalloon from "../../public/models/balloonv4.png"

const BalloonCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [balloonSprites, setBalloonSprites] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const sources = [RedBalloon, YellowBalloon, BlueBalloon, PinkBalloon];
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === sources.length) setBalloonSprites(imgs);
      };
      imgs.push(img);
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current || balloonSprites.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    let animationFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Balloon {
      sprite: HTMLImageElement;
      w: number;
      h: number;
      x: number;
      y: number;
      speed: number;
      isPopped: boolean;

      constructor() {
        this.sprite =
          balloonSprites[Math.floor(Math.random() * balloonSprites.length)];
        this.w = 40;
        this.h =80;
        this.x = Math.random() * (canvas.width - this.w);
        this.y = canvas.height + Math.random() * 200;
        this.speed = 0.5 + Math.random() * 1.5;
        this.isPopped = false;
      }

      update() {
        if (!this.isPopped) {
          this.y -= this.speed;
          if (this.y + this.h < 0) this.respawn();
        }
      }

      draw() {
        if (!this.isPopped) {
          ctx.drawImage(this.sprite, this.x, this.y, this.w, this.h);
        }
      }

      respawn() {
        this.sprite =
          balloonSprites[Math.floor(Math.random() * balloonSprites.length)];
        this.x = Math.random() * (canvas.width - this.w);
        this.y = canvas.height + Math.random() * 200;
        this.speed = 0.5 + Math.random() * 1.5;
        this.isPopped = false;
      }

      isClicked(mx: number, my: number) {
        return (
          !this.isPopped &&
          mx >= this.x &&
          mx <= this.x + this.w &&
          my >= this.y &&
          my <= this.y + this.h
        );
      }
    }

    const balloons: Balloon[] = [];
    for (let i = 0; i < 85; i++) {
      balloons.push(new Balloon());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      balloons.forEach((b) => {
        b.update();
        b.draw();
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    const clickHandler = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      balloons.forEach((b) => {
        if (b.isClicked(mx, my)) {
          b.isPopped = true;
          setTimeout(() => b.respawn(), 500);
        }
      });
    };
    canvas.addEventListener("click", clickHandler);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", clickHandler);
    };
  }, [balloonSprites]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-auto z-11"
    />
  );
};

export default BalloonCanvas;
