import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $author: String!) {
    createPost(title: $title, content: $content, author: $author) {
      _id
      title
      content
      author
    }
  }
`;

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      _id
      title
      content
      author
    }
  }
`;

export default function CreatePost() {
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });
  const router = useRouter();
 const [createPost, { loading, error }] = useMutation(CREATE_POST, {
  update: (cache, { data: { createPost } }) => {
    const existingPosts = cache.readQuery({ query: GET_POSTS }) || { posts: [] };

    cache.writeQuery({
      query: GET_POSTS,
      data: {
        posts: [createPost, ...existingPosts.posts]
      }
    });
  },
  onCompleted: () => {
    router.push('/');
  }
});

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ variables: formData });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            required
            rows="6"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
        
        {error && <p className="text-red-600 mt-4">Error: {error.message}</p>}
      </form>
    </div>
  );
}