import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

// import type { AppProps } from "next/app";
// import Header from "../app/components/Header";
// import Page from "../app/components/sidebar";
// import "../styles/globals.css";

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <>
//       <Header />
//       <div className="flex h-screen">
//         <Page />
//         <main className="flex-1">
//           <Component {...pageProps} />
//         </main>
//       </div>
//     </>
//   );
// }

// export default MyApp;
