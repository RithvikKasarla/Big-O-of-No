"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import config from "../../config";
import { HeaderContext } from "../HeaderContext";
const Page = () => {
  const [classes, setClasses] = useState([]);
  const [classesUpdated, setClassesUpdated] = useState(false);
  const { headerData } = useContext(HeaderContext);

  useEffect(() => {
    console.log("1st EFFECT ALLCED");
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
    fetchClasses();
  }, [headerData]);

  // useEffect(() => {
  //   console.log("useEffect hook called");

  //   const localStorageUpdated = () => {
  //     console.log("localStorageUpdated called");
  //     if (localStorage.getItem("classes-updated")) {
  //       setClassesUpdated(true);
  //       localStorage.removeItem("classes-updated");
  //       console.log("classes-updated flag lowered");
  //     }
  //   };
  //   window.addEventListener("storage", localStorageUpdated);
  //   return () => {
  //     window.removeEventListener("storage", localStorageUpdated);
  //   };
  // }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-gray-800">
        <div className="flex items-center justify-center h-14 text-white text-lg font-bold">
          Topics
        </div>
        <ul className="flex flex-col flex-1 overflow-y-auto">
          {Array.isArray(classes) &&
            classes.map((c) => (
              <Link key={c.id} href={`/class/${c.name}`}>
                <li className="px-8 py-2 text-gray-300 hover:text-white cursor-pointer">
                  {c.name}
                </li>
              </Link>
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
