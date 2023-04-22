import Head from "next/head";

export default function Home() {
  return (
    <div className="w-full">
      <Head>
        <title>ShareNote - The Ultimate Note Sharing Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto py-4">
          <h1 className="text-xl font-bold">ShareNote</h1>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Welcome to ShareNote - The Ultimate Note Sharing Platform
          </h2>
          <p className="text-gray-600">
            ShareNote is a platform for students to connect and share notes with
            each other. Join ShareNote now to get access to all the features.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <FeatureBlock
            title="Create an Account"
            description="Join ShareNote and create your own account to start sharing notes with others."
          />
          <FeatureBlock
            title="Join Classes"
            description="Join classes and connect with other students to view and upload notes."
          />
          <FeatureBlock
            title="View or Upload Notes"
            description="View notes from your classes or upload your own to share with others."
          />
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
  );
}

function FeatureBlock({ title, description }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
