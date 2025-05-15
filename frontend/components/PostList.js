import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { format } from 'date-fns';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      _id
      title
      author
      content
    }
  }
`;

export default function PostList() {
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) return (
    <div className="animate-pulse space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  );

  if (error) return <div className="text-red-600">Error loading posts: {error.message}</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.posts.map(post => (
        <Link key={post._id} href={`/posts/${post._id}`}>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h2>
            <p className="text-gray-600 mb-2">By {post.author}</p>
            {post.createdAt && (
              <p className="text-sm text-gray-500">
                {format(new Date(post.createdAt), 'MMM dd, yyyy')}
              </p>
            )}
            <p className="mt-4 text-gray-700 line-clamp-3">{post.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}