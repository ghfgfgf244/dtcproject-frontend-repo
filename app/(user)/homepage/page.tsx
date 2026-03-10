import CreatePost from "@/components/ui/create-post";
import PostList from "@/components/ui/post-list";
import styles from "@/styles/feed.module.css";

export default function PostPage() {
  return (
    <div className={styles.feedContainer}>

      <CreatePost />

      <PostList />

    </div>
  );
}