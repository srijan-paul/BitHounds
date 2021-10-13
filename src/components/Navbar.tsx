import React from "react";
import PropTypes from "prop-types";
import { Book, Code, Dog, User } from "./svgs";
import "./css/Navbar.css";
import { Link } from "react-router-dom";

function NavItem(props: { name: string; link?: string; children: PropTypes.ReactNodeLike }) {
  return (
    <Link to={props.link || "/"}>
      <div className="nav__item">
        {props.children}
        <span style={{ fontSize: "1.1rem" }}>{props.name}</span>
      </div>
    </Link>
  );
}

function Navbar(): JSX.Element {
  return (
    <div className="navbar">
      <div className="navbar__items">
        <NavItem name="HoundPedia">
          <Dog size="35px" />
        </NavItem>

        <NavItem name="Market" link="/market">
          <Book size="30px" />
        </NavItem>

        <NavItem name="Source">
          <Code size="30px" />
        </NavItem>

        <NavItem name="People" link="/search">
          <User size="35px" />
        </NavItem>
      </div>
    </div>
  );
}

export default Navbar;
