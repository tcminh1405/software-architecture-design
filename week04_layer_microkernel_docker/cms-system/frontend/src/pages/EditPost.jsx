import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('Draft');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const post = response.data;
            setTitle(post.title);
            setContent(post.content);
            setStatus(post.status);
        } catch (err) {
            setError('Error loading post');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.put(
                `http://localhost:3000/api/posts/${id}`,
                { title, content, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/posts');
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating post');
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md mb-6">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/posts" className="text-blue-600 hover:underline">← Back to Posts</Link>
                </div>
            </nav>


            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="10"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Pending">Pending</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Update Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
