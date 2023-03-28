import { useRouter } from "next/router";
import FileCard from "../app/components/fileCard";
import Upload from "../app/components/upload";

interface Post {
  title: string;
  content: string;
  files: File[];
}

interface PostPageProps {
  post: Post;
}

const PostPage: React.FC<PostPageProps> = ({ post }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex ...">
      <div className="pl-5 pt-3">
        <p className="font-bold text-2xl">{post.title}</p>
        <hr className="mt-3 w-48 h-1 bg-gray-300 border-0 dark:bg-gray-600 rounded"></hr>
        <div className="pl-5 pt-3">
          <p>{post.content}</p>
          <FileCard files={post.files} />
        </div>
      </div>
      <Upload />
    </div>
  );
};

export default PostPage;

export async function getStaticPaths() {
  try {
    // Fetch a list of all blog post slugs
    const res = await fetch("http://localhost:3000/api/posts");
    const posts = await res.json();

    // Map the slugs to an array of objects with params key
    const paths = posts.map((post) => ({ params: { slug: post.slug } }));

    return { paths, fallback: false };
  } catch (error) {
    console.log(error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  // Fetch the post data based on the slug in the URL
  const res = await fetch(`http://localhost:3000/${params.slug}`);
  const post = await res.json();

  return { props: { post } };
}
