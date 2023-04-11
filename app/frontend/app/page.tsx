import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full">
      <div className="w-full bg-gray-100 min-h-screen">
        <Head>
          <title>ShareNote</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header className="bg-white shadow">
          <div className="container mx-auto py-4">
            <h1 className="text-xl font-bold">ShareNote</h1>
          </div>
        </header>

        <main className="container mx-auto py-8">
          <h2 className="text-2xl font-bold mb-4">
            Select a Class to view notes:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ClassCard href="/csds" title="CSDS" />
            <ClassCard href="/math" title="MATH" />
            <ClassCard href="/phys" title="PHYS" />
            <ClassCard href="#" title="ENGL" />
            <ClassCard href="#" title="ENGR" />
            <ClassCard href="#" title="SOCI" />
          </div>
        </main>

        <footer className="bg-white shadow py-4">
          <div className="container mx-auto">
            <p className="text-center text-gray-500 text-sm">
              ShareNote &copy; 2023
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ClassCard({ href, title }) {
  return (
    <Link href={href} className="bg-white rounded-lg shadow p-4 block">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <span className="text-blue-500 hover:underline">View Notes</span>
    </Link>
  );
}
