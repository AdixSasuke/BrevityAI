import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import transcriptService from "../services/transcriptService";

const DashboardPage = () => {
    const [transcripts, setTranscripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchTranscripts();
    }, []);

    const fetchTranscripts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transcriptService.listTranscripts();
            setTranscripts(data);
        } catch (err) {
            setError("Failed to load your transcripts. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this transcript?"))
            return;

        try {
            await transcriptService.deleteTranscript(id);
            setTranscripts(
                transcripts.filter((transcript) => transcript.id !== id)
            );
        } catch (err) {
            setError("Failed to delete transcript. Please try again.");
            console.error(err);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Your Dashboard
                    </h1>
                    <Link to="/">
                        <Button>Process New Video</Button>
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 p-4 rounded-md mb-6">
                        <p className="text-sm font-medium text-red-800">
                            {error}
                        </p>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">
                            Your Processed Content
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-6">
                            <div className="animate-pulse space-y-4">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="rounded-md bg-gray-300 h-12 w-12"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : transcripts.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {transcripts.map((transcript) => (
                                <div
                                    key={transcript.id}
                                    className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="mb-4 sm:mb-0">
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            {transcript.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Processed on{" "}
                                            {new Date(
                                                transcript.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                        <div className="mt-1 flex items-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    transcript.rewritten_text
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {transcript.rewritten_text
                                                    ? "Rewritten"
                                                    : "Original Only"}
                                            </span>

                                            {transcript.audio_files?.length >
                                                0 && (
                                                <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Audio Available
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <Link
                                            to={`/transcript/${transcript.id}`}
                                        >
                                            <Button variant="outline" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(transcript.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center">
                            <div className="py-12">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    No transcripts yet
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by processing your first YouTube
                                    video.
                                </p>
                                <div className="mt-6">
                                    <Link to="/">
                                        <Button>Process a YouTube Video</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
