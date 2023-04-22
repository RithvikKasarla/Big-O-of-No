"use client";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function Header() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const localStorageToken = localStorage.getItem("token");
    if (localStorageToken) {
      setToken(localStorageToken);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    // Perform any other sign-out related operations here
    setToken("");
  };

  if (!token) {
    return (
      <header className="p-3 bg-blue-500 flex justify-between">
        <div>
          <Link
            href="/"
            className="m-1 px-2 py-1 bg-white text-blue-500 rounded-lg"
          >
            Home
          </Link>
        </div>
        <div>
          <Link
            href="/signup"
            className="bg-white text-blue-500 rounded-lg px-3 py-1"
          >
            Signin
          </Link>
        </div>
      </header>
    );
  } else {
    return (
      <header className="p-3 bg-blue-500 flex justify-between">
        <div>
          <Link
            href="/"
            className="m-1 px-2 py-1 bg-white text-blue-500 rounded-lg"
          >
            Home
          </Link>
          {/* <Link
            href="/discussion"
            className="m-1 px-2 py-1 bg-white text-blue-500 rounded-lg"
          >
            Discussion Board
          </Link> */}
          <Link
            href="/joinclasses"
            className="m-1 px-2 py-1 bg-white text-blue-500 rounded-lg"
          >
            Join Classes
          </Link>
        </div>
        <div>
          <button
            className="bg-white text-blue-500 rounded-lg px-3 py-1"
            onClick={handleSignOut}
          >
            Signout
          </button>
        </div>
      </header>
    );
  }
}

export default Header;
