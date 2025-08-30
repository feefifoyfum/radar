import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Post } from '../types/index.ts';
import { usersAPI, postsAPI } from '../services/api.ts';
import { useAuth } from '../contexts/AuthContext.tsx';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    bio: ''
  });

  const isOwnProfile = currentUser && userId && currentUser.id === parseInt(userId);

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      const userData = await usersAPI.getUser(parseInt(userId!));
      setUser(userData);
      setEditForm({
        username: userData.username,
        email: userData.email,
        bio: userData.bio || ''
      });

      const userPosts = await postsAPI.getUserPosts(parseInt(userId!));
      setPosts(userPosts);
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await usersAPI.updateUser(editForm);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await usersAPI.deleteUser();
        window.location.href = '/login';
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
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

  if (!user) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#000000'
      }}>
        User not found
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
        border: '1px solid #000000',
        padding: '2rem',
        marginBottom: '2rem',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'normal',
              color: '#000000',
              marginBottom: '0.5rem'
            }}>
              {user.username}
            </h1>
            <p style={{
              color: '#666666',
              fontSize: '1rem'
            }}>
              {user.email}
            </p>
          </div>
          {isOwnProfile && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: '1px solid #000000',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button
                onClick={handleDeleteAccount}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: '1px solid #000000',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Delete Account
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#000000'
              }}>
                Username
              </label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #000000',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '1rem'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#000000'
              }}>
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #000000',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '1rem'
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
                Bio
              </label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #000000',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid #000000',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div>
            {user.bio && (
              <p style={{
                color: '#000000',
                lineHeight: '1.6',
                marginBottom: '1rem'
              }}>
                {user.bio}
              </p>
            )}
            <p style={{
              color: '#666666',
              fontSize: '0.9rem'
            }}>
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'normal',
          color: '#000000',
          marginBottom: '1.5rem'
        }}>
          Posts ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#666666'
          }}>
            No posts yet.
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              style={{
                border: '1px solid #000000',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                backgroundColor: '#ffffff'
              }}
            >
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
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              <div style={{
                color: '#000000',
                lineHeight: '1.6',
                marginBottom: '1rem'
              }}>
                {post.content}
              </div>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post image"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    border: '1px solid #000000'
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
