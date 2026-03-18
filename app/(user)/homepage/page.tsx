import CreatePost from "@/components/ui/create-post";
import PostList from "@/components/ui/post-list";
import Sidebar from "@/components/ui/sidebar";
import feedStyles from "@/styles/feed.module.css";
import layoutStyles from "@/styles/user-shell.module.css";

export default function PostPage() {
  return (
    <div className={layoutStyles.page}>
      <Sidebar activeKey="courses" />

      <section className={layoutStyles.content}>
        <div className={`${feedStyles.feedContainer} ${layoutStyles.feedOverride}`}>
          <CreatePost />
          <PostList />
        </div>
      </section>
    </div>
  );
}
