import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, user } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/posts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts();
        } catch (error) {
            alert('Error deleting post');
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md mb-6">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
                </div>
            </nav>

            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Posts</h1>
                    {(user?.role === 'Admin' || user?.role === 'Editor') && (
                        <Link
                            to="/posts/create"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Create New Post
                        </Link>
                    )}
                </div>


                <div className="grid gap-4">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                                    <p className="text-gray-600 mb-2">{post.content.substring(0, 150)}...</p>
                                    <div className="text-sm text-gray-500">
                                        <span>By {post.author_name}</span>
                                        <span className="mx-2">•</span>
                                        <span className={`px-2 py-1 rounded ${post.status === 'Published' ? 'bg-green-100 text-green-800' :
                                                post.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    {(user?.role === 'Admin' || user?.role === 'Editor') && (
                                        <Link
                                            to={`/posts/edit/${post.id}`}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </Link>
                                    )}
                                    {user?.role === 'Admin' && (
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostList;
