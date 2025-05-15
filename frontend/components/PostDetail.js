import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      _id
      title
      content
      author
      createdAt
    }
  }
`;

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { loading, error, data } = useQuery(GET_POST, { variables: { id } });

  if (loading) return <div className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>;
  if (error) return <div className="text-red-600">Error loading post: {error.message}</div>;
  if (!data?.post) return <div className="text-gray-600">Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-8 text-blue-600 hover:text-blue-700 flex items-center"
      >
        ← Back to Posts
      </button>
      
      <article className="bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{data.post.title}</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <p className="text-lg font-medium text-blue-600">{data.post.author}</p>
          {data.post.createdAt && (
            <time className="text-gray-500">
              {format(new Date(data.post.createdAt), 'MMMM dd, yyyy')}
            </time>
          )}
        </div>
        
        <div className="prose max-w-none text-gray-700">
          {data.post.content}
        </div>
      </article>
    </div>
  );
}