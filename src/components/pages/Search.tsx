import React from "react";
import { Link } from "react-router-dom";
import "../css/SearchPage.css";
import Button from "../Button";
import { WalletContext } from "../context/WalletContext";

function SearchBar(): JSX.Element {
  const [searchItem, setSearchItem] = React.useState("");

  return (
    <form className="searchBar">
      <input
        name="name"
        placeholder="Name or wallet address"
        type="text"
        className="searchTerm"
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
      />

      <Link to={`/usr/${searchItem}`}>
        <div className="searchBtn">
          <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12">
            <i className="fa fa-search"> </i>
          </button>
        </div>
      </Link>
    </form>
  );
}

function Search(): JSX.Element {
  const walletInfo = React.useContext(WalletContext);

  return (
    <div className="searchPage">
      <h1 style={{ color: "var(--clr-faded)" }}>Find trainers across the world!</h1>
      <SearchBar />
      <Button>
        <i className="fa fa-user"></i> &nbsp; My Profile
      </Button>
    </div>
  );
}

export default Search;
