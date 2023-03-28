import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div className="nav">
      <p className="logo">Moedas</p>
      <div className="nav-items">
        <Link to={`/`}>
          <p>Converter</p>
        </Link>
        <Link to={`/rates`}>
          <p>Exchange Rates</p>
        </Link>
      </div>
    </div>
  );
};

export default Nav;
