import PostCard from "./post-card";

const posts = [
  {
    id: 1,
    author: "Training Manager",
    avatar: "https://i.pravatar.cc/40",
    time: "2 hours ago",
    content: "New B2 driving exam schedule has been released.",
    image: "/CourseImage.jpg"
  },
  {
    id: 2,
    author: "Instructor Nam",
    avatar: "https://i.pravatar.cc/41",
    time: "5 hours ago",
    content: "Remember to practice parallel parking before the exam!"
  }
];

export default function PostList() {
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}