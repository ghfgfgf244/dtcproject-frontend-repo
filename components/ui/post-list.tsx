"use client";

import { useState } from "react";
import PostCard from "./post-card";

const initialPosts = [
  {
    id: 1,
    author: "Training Manager",
    avatar: "https://i.pravatar.cc/40",
    time: "2 hours ago",
    content: "New B2 driving exam schedule has been released.",
    image: "/CourseImage.jpg",
  },
  {
    id: 2,
    author: "Instructor Nam",
    avatar: "https://i.pravatar.cc/41",
    time: "5 hours ago",
    content: "Remember to practice parallel parking before the exam!",
  },
];

export default function PostList() {
  const [posts, setPosts] = useState(initialPosts);

  const handleDelete = (id: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handleEdit = (id: number, content: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, content } : post
      )
    );
  };

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={() => handleDelete(post.id)}
          onEdit={(content) => handleEdit(post.id, content)}
        />
      ))}
    </div>
  );
}
