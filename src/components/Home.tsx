import React from "react";
import Navbar from "./Navbar";

function Hero() {
	return (
		<div className="hero">
			<div className="hero__text">
				<div className="hero__text__title">
					<img src="./logo.svg" alt="logo" />
					<h1>
						<span>Bit</span>Hounds
					</h1>
				</div>

				<p className="hero__text__desc">Digital collectible trading cards with beasts inside.</p>
			</div>

		</div>
	);
}

function Home() {
	return (
		<div>
			<Navbar />
			<Hero />
		</div>
	);
}

export default Home;
