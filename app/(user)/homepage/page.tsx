"use client";

import { useState } from "react";
import CreatePost from "@/components/ui/create-post";
import PostList from "@/components/ui/post-list";
import Sidebar from "@/components/ui/sidebar";
import feedStyles from "@/styles/feed.module.css";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/homepage.module.css";

export default function PostPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="homepage" />

      <section className={`${shellStyles.content} ${styles.content}`}>
        <div className={`${feedStyles.feedContainer} ${shellStyles.feedOverride}`}>
          <CreatePost onPostCreated={() => setRefreshKey(k => k + 1)} />
          <PostList refreshKey={refreshKey} />
        </div>
      </section>
    </div>
  );
}
