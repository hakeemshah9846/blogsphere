import Link from "next/link";
import PostList from "../components/PostList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Blog Posts</h1>
          <Link
            href="/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Post
          </Link>
        </div>
        <PostList />
      </div>
    </div>
  );
}
