import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer z-1001">
      <div className="footer-container">
        <p className="footer-text text-lg">
          Source code:{" "}
          <a
            href="https://github.com/MarioGITben/birthday_vitereactts"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Github
          </a>
        </p>
        <p className="footer-text text-lg">Created by Bellen</p>
      </div>
    </footer>
  );
};

export default Footer;
