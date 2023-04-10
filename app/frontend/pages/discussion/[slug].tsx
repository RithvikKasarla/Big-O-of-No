import React from "react";
import { useRouter } from "next/router";
import Discussion from "../../app/components/discussion";
import { GetServerSideProps } from "next";
import Header from "../../app/components/Header";
import Page from "../../app/components/sidebar";
import { compileFunction } from "vm";

interface DiscussionPageProps {
  comments: Comment[];
}

interface Comment {
  id: number;
  text: string;
  user: string;
}

const DiscussionPage: React.FC<DiscussionPageProps> = ({ comments }) => {
  const router = useRouter();
  const { slug } = router.query;
  console.log("sfasdf");
  console.log(slug);
  console.log(comments);
  return (
    <>
      <Header />
      <div className="flex h-screen">
        <Page />
        <div className="flex ...">
          <Discussion discussionSlug={slug} comments={comments} />
        </div>
      </div>
    </>
  );
};

export default DiscussionPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Fetch the comments for this discussion from your backend
  // const comments: Comment[] = await fetch(
  //   `https://yourapi.com/discussions/${params.slug}/comments`
  // ).then((res) => res.json());
  const commentsData = {
    "1": [
      {
        id: 1,
        author: "Alice",
        content: "This is a comment",
        likes: 0,
        dislikes: 0,
      },
      {
        id: 2,
        author: "Bob",
        content: "This is another comment",
        likes: 0,
        dislikes: 0,
      },
    ],
    "2": [
      {
        id: 1,
        author: "Charlie",
        content: "I have a question",
        likes: 0,
        dislikes: 0,
      },
      {
        id: 2,
        author: "Dave",
        content: "I like this app",
        likes: 0,
        dislikes: 0,
      },
      {
        id: 3,
        author: "Eve",
        content: "This is a great resource, thank you!",
        likes: 0,
        dislikes: 0,
      },
    ],
    "3": [
      {
        id: 1,
        author: "Frank",
        content: "Can anyone help me with this problem?",
        likes: 0,
        dislikes: 0,
      },
      {
        id: 2,
        author: "Grace",
        content: "I found a bug in the app",
        likes: 0,
        dislikes: 0,
      },
      {
        id: 3,
        author: "Heidi",
        content: "I have a suggestion for a new feature",
        likes: 0,
        dislikes: 0,
      },
    ],
  };
  console.log(commentsData[params.slug]);
  // Return the comments as props to the component
  if (params) {
    const comments = commentsData[params.slug] || [];
    console.log(comments);
    return { props: { comments } };
  } else {
    return { props: { comments: [] } };
  }
};
