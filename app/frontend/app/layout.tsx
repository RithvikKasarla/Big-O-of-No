import "../styles/globals.css";
import Header from "./Header";
import Page from "./sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>
      <body>
        <Header />
        <div className="flex h-screen">
          <Page />
          {children}
        </div>
      </body>
    </html>
  );
}
