import React, { useState, useEffect } from 'react';
import { Post } from '../types/index.ts';
import { postsAPI, API_BASE_URL } from '../services/api.ts';
import CreatePost from './CreatePost.tsx';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsData = await postsAPI.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setShowCreatePost(false);
  };

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        color: '#000000'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'normal',
          color: '#000000'
        }}>
          Feed
        </h1>
        <button
          onClick={() => setShowCreatePost(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#000000',
            color: '#ffffff',
            border: '1px solid #000000',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          New Post
        </button>
      </div>

      {showCreatePost && (
        <CreatePost
          onPostCreated={handlePostCreated}
          onCancel={() => setShowCreatePost(false)}
        />
      )}

      <div style={{ marginTop: '2rem' }}>
        {posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#666666'
          }}>
            No posts yet. Create the first one!
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handlePostDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface PostCardProps {
  post: Post;
  onDelete: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsDeleting(true);
      try {
        await postsAPI.deletePost(post.id);
        onDelete(post.id);
      } catch (error) {
        console.error('Error deleting post:', error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div style={{
      border: '1px solid #000000',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 'normal',
            color: '#000000',
            marginBottom: '0.5rem'
          }}>
            {post.title || 'Untitled'}
          </h3>
          <p style={{
            color: '#666666',
            fontSize: '0.9rem'
          }}>
            by {post.author.username} • {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ffffff',
            color: '#000000',
            border: '1px solid #000000',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      
      <div style={{
        color: '#000000',
        lineHeight: '1.6',
        marginBottom: '1rem'
      }}>
        {post.content}
      </div>
      
      {post.image_url && (
        <img
          src={post.image_url.startsWith('http') ? post.image_url : `${API_BASE_URL}${post.image_url}`}
          alt="Post image"
          style={{
            maxWidth: '100%',
            height: 'auto',
            border: '1px solid #000000'
          }}
        />
      )}
    </div>
  );
};

export default Feed;
