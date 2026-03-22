import CreatePost from "@/components/ui/create-post";
import PostList from "@/components/ui/post-list";
import Sidebar from "@/components/ui/sidebar";
import feedStyles from "@/styles/feed.module.css";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/homepage.module.css";

export default function PostPage() {
  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="homepage" />

      <section className={`${shellStyles.content} ${styles.content}`}>
        <div className={`${feedStyles.feedContainer} ${shellStyles.feedOverride}`}>
          <CreatePost />
          <PostList />
        </div>
      </section>
    </div>
  );
}
