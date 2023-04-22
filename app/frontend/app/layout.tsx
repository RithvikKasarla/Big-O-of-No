// import "../styles/globals.css";
// import Header from "./components/Header";
// import Page from "./components/sidebar";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html>
//       <head></head>
//       <body>
//         <Header />
//         <div className="flex h-screen">
//           <Page />
//           {children}
//         </div>
//       </body>
//     </html>
//   );
// }
"use client";
import "../styles/globals.css";
import Header from "./components/Header";
import Page from "./components/sidebar";
import { HeaderContext } from "./HeaderContext";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [headerData, setHeaderData] = useState<boolean>(false);

  return (
    <html>
      <head></head>
      <body>
        <HeaderContext.Provider value={{ headerData, setHeaderData }}>
          <Header />
          <div
            className="flex"
            style={{ height: "calc(101vh - 4rem)", overflowY: "hidden" }}
          >
            <Page />
            {children}
          </div>
        </HeaderContext.Provider>
      </body>
    </html>
  );
}
