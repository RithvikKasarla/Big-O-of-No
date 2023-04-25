"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import config from "../../config";
import { HeaderContext } from "../HeaderContext";

// interface Classes_ {
//   id: number;
//   name: string;
//   description: string;
// }

const Page = () => {
  const [classes, setClasses] = useState([]); //<Classes_[]>
  const [classesUpdated, setClassesUpdated] = useState(false); //<boolean>
  const { headerData } = useContext(HeaderContext);

  const fetchClasses = async () => {
    const res = await fetch(`${config.apiUrl}/class`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    });
    const data = await res.json();
    setClasses(data);
  };

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      try {
        fetchClasses();
      } catch (err) {
        console.log(err);
      }
    }
  }, [headerData]);

  async function leaveClass(id) {
    const res = await fetch(`${config.apiUrl}/class/${id}/leave`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    });
    const data = await res.json();
    if (data.message) {
      fetchClasses();
    }
  }

  return (
    <div className="flex h-screen " style={{ height: "100%" }}>
      <div className="flex flex-col w-64 bg-gray-800">
        <div className="flex items-center justify-center h-14 text-white text-lg font-bold">
          Topics
        </div>
        <ul
          className="flex flex-col flex-1 overflow-y-auto"
          style={{ height: "100%" }}
        >
          {Array.isArray(classes) &&
            classes.map((c) => (
              <li
                className="flex px-8 py-2 text-gray-300 hover:text-white cursor-pointer"
                key={c.id}
              >
                <button
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => leaveClass(c.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.414 10l4.293-4.293a1 1 0 1 0-1.414-1.414L10 8.586l-4.293-4.293a1 1 0 1 0-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 1 0 1.414 1.414L10 11.414l4.293 4.293a1 1 0 1 0 1.414-1.414L11.414 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <a>&emsp;</a>
                <Link
                  href={`/class/${c.id}?name=${encodeURIComponent(c.name)}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import config from "../../config";

// const Page = () => {
//   const [classes, setClasses] = useState([]);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       const res = await fetch(`${config.apiUrl}/class`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           token: localStorage.getItem("token"),
//         }),
//       });
//       const data = await res.json();
//       setClasses(data);
//     };
//     fetchClasses();
//   }, []);

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="flex flex-col w-64 bg-gray-800">
//         <div className="flex items-center justify-center h-14 text-white text-lg font-bold">
//           Topics
//         </div>
//         <ul className="flex flex-col flex-1 overflow-y-auto">
//           {classes.map((c) => (
//             <Link key={c.id} href={`/class/${c.id}`}>
//               <li className="px-8 py-2 text-gray-300 hover:text-white cursor-pointer">
//                 {c.name}
//               </li>
//             </Link>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Page;
