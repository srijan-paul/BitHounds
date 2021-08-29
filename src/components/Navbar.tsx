import React from "react";
import { Book, Code, Dog } from "./svgs";
import "./css/Navbar.css";

function NavItem(props: { name: string; children: any }) {
	return (
		<div className="nav__item">
			{props.children}
			<span style={{ fontSize: "1.1rem" }}>{props.name}</span>
		</div>
	);
}

function Navbar() {
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
		</div>
	);
}

export default Navbar;
