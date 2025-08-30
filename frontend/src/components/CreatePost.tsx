import React, { useState } from 'react';
import { Post, PostCreate } from '../types/index.ts';
import { postsAPI } from '../services/api.ts';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
  onCancel: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, onCancel }) => {
  const [formData, setFormData] = useState<PostCreate>({
    title: '',
    content: '',
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const form = new FormData();
      if (formData.title) form.append('title', formData.title);
      form.append('content', formData.content);
      if (file) form.append('file', file);

      const newPost = await postsAPI.createPostForm(form);
      onPostCreated(newPost);
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('An error occurred while creating the post');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #000000',
      padding: '1.5rem',
      marginBottom: '2rem',
      backgroundColor: '#ffffff'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'normal',
        color: '#000000',
        marginBottom: '1.5rem'
      }}>
        Create New Post
      </h2>

      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: '#f5f5f5',
          border: '1px solid #000000',
          color: '#000000'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#000000'
          }}>
            Title (optional)
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #000000',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#000000'
          }}>
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #000000',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontSize: '1rem',
              resize: 'vertical'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#000000'
          }}>
            Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #000000',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #000000',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: '1px solid #000000',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
