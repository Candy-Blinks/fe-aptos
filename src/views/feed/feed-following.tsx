import FeedCollectionPost from "@/views/feed/feed-collection-post";
import FeedNormalPost from "@/views/feed/feed-normal-post";

export default function FeedFollowing({
  user,
  posts,
}: {
  user: any;
  posts: any[];
}) {
  // TODO: make here a function that will select the 'following' posts using an algorithm
  // ? only filter the post from the following users of the usre
  return (
    <>
      {posts.map((post, i) => {
        if (post.isColelctionShare) {
          return <FeedCollectionPost key={i} userData={user} postData={post} />;
        } else {
          return <FeedNormalPost key={i} userData={user} postData={post} />;
        }
      })}
    </>
  );
}
