import React from "react";

const Footer = () => {
  const d = new Date();
  let year = d.getFullYear();

  return (
    <div className="footer">
      <p>@ {year}</p>
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/juliabandeira"
      >
        <div className="github"></div>
      </a>
    </div>
  );
};

export default Footer;
