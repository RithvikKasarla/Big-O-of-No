import React from "react";
import { useRouter } from "next/router";
import Discussion from "../../app/components/discussion";
import { GetServerSideProps } from "next";
import Header from "../../app/components/Header";
import Page from "../../app/components/sidebar";
import { compileFunction } from "vm";
import config from "../../config";

// // interface DiscussionPageProps {
// //   comments: Comment_[];
// //   username: string;
// // }

// // interface Comment_ {
// //   id: number;
// //   content: string;
// //   authorId: number;
// //   fileId: number;
// //   author: {
// //     username: string;
// //   };
// }

//: React.FC<DiscussionPageProps>
const DiscussionPage = (comments) => {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <>
      <Header />
      <div className="flex" style={{ height: "calc(101vh - 4rem)" }}>
        <Page />
        <div className="flex ...">
          <Discussion
            discussionSlug={slug}
            comments={comments.comments}
            fileId={router.query.id}
            Username={comments.username}
          />
        </div>
      </div>
    </>
  );
};

export default DiscussionPage;
//GetServerSideProps
export const getServerSideProps = async (context) => {
  // Fetch the comments for this discussion from your backend
  // const comments: Comment[] = await fetch(
  //   `https://yourapi.com/discussions/${params.slug}/comments`
  // ).then((res) => res.json());
  // Return the comments as props to the component
  let commentsData = null;
  console.log("context", context);
  const authToken = context.req.headers.cookie?.split("authToken=")[1];
  const username = context.req.headers.cookie
    ?.split("username=")[1]
    ?.split(";")[0];
  console.log("tplem", username);

  try {
    console.log("fetching");
    console.log(`${config.apiUrl}/file/${context.query.id}/comment`);
    const response = await fetch(
      `${config.apiUrl}/file/${context.query.id}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ token: authToken }),
      }
    );
    const responseData = await response.json();
    console.log(responseData);
    commentsData = responseData;
  } catch (error) {
    console.log("error");
    console.log(error);
  }
  console.log("dafa");
  console.log(commentsData);
  if (commentsData !== undefined && commentsData !== null) {
    return { props: { comments: commentsData, username: username } };
  } else {
    return { props: { comments: [] } };
  }
};
