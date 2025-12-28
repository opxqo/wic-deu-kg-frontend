import React, { useState } from 'react';
import messageApi, { SeniorMessageVO } from '../services/messageApi';

const MessageTest: React.FC = () => {
    const [studentId, setStudentId] = useState('');
    const [messages, setMessages] = useState<SeniorMessageVO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetch = async () => {
        if (!studentId) {
            setError('Please enter a Student ID');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await messageApi.getUserMessages(studentId);
            if (res.code === 0 && res.data) {
                setMessages(res.data.records);
            } else {
                setError(res.message || 'Failed to fetch messages');
                setMessages([]);
            }
        } catch (err) {
            setError('Error fetching messages');
            console.error(err);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">User Messages API Test</h1>

            <div className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter Student ID"
                    className="flex-1 p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
                />
                <button
                    onClick={handleFetch}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Fetching...' : 'Fetch Messages'}
                </button>
            </div>

            {error && (
                <div className="p-4 mb-6 bg-red-100 text-red-700 rounded dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg.id} className="p-4 border rounded dark:bg-slate-800 dark:border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-mono text-sm text-gray-500">ID: {msg.id}</span>
                                <span className="text-sm text-gray-500">{msg.createdAt}</span>
                            </div>
                            <p className="mb-2 text-lg">{msg.content}</p>
                            <div className="text-right text-gray-600 dark:text-gray-400">
                                — {msg.signature || 'Anonymous'}
                            </div>
                            <div className="mt-2 text-xs text-gray-400">
                                Font: {msg.font?.name} | Card: {msg.cardColor} | Ink: {msg.inkColor}
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && !error && (
                        <div className="text-center text-gray-500">
                            No messages found or enter an ID to search.
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default MessageTest;
