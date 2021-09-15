import React, { useState } from "react";
import PropTypes from "prop-types";
import { Book, Code, Dog, User } from "./svgs";
import "./css/Navbar.css";
import { Link } from "react-router-dom";

function NavItem(props: { name: string; children: PropTypes.ReactNodeLike }) {
  return (
    <div className="nav__item">
      {props.children}
      <span style={{ fontSize: "1.1rem" }}>{props.name}</span>
    </div>
  );
}

function Navbar(): JSX.Element {
  const [searchItem, setSearchItem] = useState("");

  function handleChange(e: any) {
    console.log(e.target.value);
    setSearchItem(e.target.value);
  }
  return (
    <div className="navbar">
      <NavItem name="HoundPedia">
        <Dog size="35px" />
      </NavItem>

      <NavItem name="Book">
        <Book size="30px" />
      </NavItem>

      <NavItem name="Source">
        <Code size="30px" />
      </NavItem>

      <NavItem name="Profile">
        <User size="35px" />
      </NavItem>

      <div className="searchbar">
        <form>
          <input
            name="name"
            placeholder=" Find User"
            type="text"
            className="searchTerm"
            value={searchItem}
            onChange={handleChange}
          />
          <Link to={`/usr/${searchItem}`}>
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Navbar;
