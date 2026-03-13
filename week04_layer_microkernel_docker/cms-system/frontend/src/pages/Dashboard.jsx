import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">CMS Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Welcome, {user?.username} ({user?.role})</span>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/posts" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                        <h2 className="text-xl font-bold mb-2">Posts</h2>
                        <p className="text-gray-600">Manage your posts</p>
                    </Link>

                    {(user?.role === 'Admin' || user?.role === 'Editor') && (
                        <Link to="/posts/create" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                            <h2 className="text-xl font-bold mb-2">Create Post</h2>
                            <p className="text-gray-600">Write a new post</p>
                        </Link>
                    )}

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">Statistics</h2>
                        <p className="text-gray-600">View analytics</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
