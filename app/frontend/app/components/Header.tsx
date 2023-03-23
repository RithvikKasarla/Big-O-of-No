import Head from "next/head";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <header className="p-5 bg-blue-500">
      <Link
        href="/"
        className="m-1 px-2 py-1 bg-white text-blue-500 rounded-lg"
      >
        Home
      </Link>
      <Link
        href="/discussion"
        className="m-1 px-2 py-1 bg-white text-blue-500 rounded-lg"
      >
        Discussion Board
      </Link>
    </header>
  );
}

export default Header;
