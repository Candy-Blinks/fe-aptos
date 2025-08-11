import FeedCollectionPost from "@/views/feed/feed-collection-post";
import FeedNormalPost from "@/views/feed/feed-normal-post";
import { PostWithRelations } from "@/hooks/api/post/types";

export default function FeedForyou({
  user,
  posts,
}: {
  user: any;
  posts: PostWithRelations[];
}) {
  // TODO: make here a function that will select the 'for you' posts using an algorithm
  return (
    <>
      {posts.map((post, i) => {
        // Check if post has_blink to determine if it's a collection post
        if (post.has_blink) {
          return <FeedCollectionPost key={post.id || i} userData={user} postData={post} />;
        } else {
          return <FeedNormalPost key={post.id || i} userData={user} postData={post} />;
        }
      })}
    </>
  );
}
