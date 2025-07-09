import FeedCollectionPost from "@/views/feed/feed-collection-post";
import FeedNormalPost from "@/views/feed/feed-normal-post";

export default function FeedTrending({
  user,
  posts,
}: {
  user: any;
  posts: any[];
}) {
  // TODO: make here a function that will select the 'trending' posts using an algorithm
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
