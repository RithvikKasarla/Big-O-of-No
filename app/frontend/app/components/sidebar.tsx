import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-gray-800">
        <div className="flex items-center justify-center h-14 text-white text-lg font-bold">
          Topics
        </div>
        <ul className="flex flex-col flex-1 overflow-y-auto">
          <Link href="/csds">
            <li className="px-8 py-2 text-gray-300 hover:text-white cursor-pointer">
              CSDS
            </li>
          </Link>
          <Link href="/math">
            <li className="px-8 py-2 text-gray-300 hover:text-white cursor-pointer">
              MATH
            </li>
          </Link>
          <Link href="/phys">
            <li className="px-8 py-2 text-gray-300 hover:text-white cursor-pointer">
              PHYS
            </li>
          </Link>
          <li className="px-8 py-2 text-gray-300 hover:text-white cursor-pointer">
            ENGL
          </li>
          <li className="px-8 py-2 text-gray-300 hover:text-white cursor-pointer">
            ENGR
          </li>
          <li className="px-8 py-2 text-gray-300 hover:text-white cursor-pointer">
            SOCI
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Page;
