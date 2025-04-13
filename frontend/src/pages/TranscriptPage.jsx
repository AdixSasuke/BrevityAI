import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import transcriptService from "../services/transcriptService";
import audioService from "../services/audioService";

const TranscriptPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [transcript, setTranscript] = useState(
        location.state?.transcript || null
    );
    const [loading, setLoading] = useState(!location.state?.transcript);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("original");
    const [rewriteOptions, setRewriteOptions] = useState({
        tone: "professional",
        clarity_level: 1,
    });
    const [rewriting, setRewriting] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [selectedVoice, setSelectedVoice] = useState("default");
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        if (!transcript) {
            fetchTranscript();
        }

        fetchVoices();
    }, [id]);

    const fetchTranscript = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transcriptService.getTranscript(id);
            setTranscript(data);
        } catch (err) {
            setError("Failed to load transcript. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchVoices = async () => {
        try {
            const voicesData = await audioService.getVoices();
            setVoices(voicesData);
        } catch (err) {
            console.error("Failed to fetch voices:", err);
        }
    };

    const handleRewrite = async () => {
        setRewriting(true);
        setError(null);
        try {
            const result = await transcriptService.rewriteTranscript(
                id,
                rewriteOptions
            );
            setTranscript({
                ...transcript,
                rewritten_text: result.rewritten_text,
            });
            setActiveTab("rewritten");
        } catch (err) {
            setError("Failed to rewrite the transcript. Please try again.");
            console.error(err);
        } finally {
            setRewriting(false);
        }
    };

    const handleGenerateAudio = async () => {
        setGenerating(true);
        setError(null);
        try {
            // Determine which text to use based on active tab
            const textType =
                activeTab === "original" ? "original" : "rewritten";

            // Generate audio
            const result = await audioService.generateAudio(id, {
                textType,
                voiceModel: selectedVoice,
            });

            setAudioUrl(result.cloudinary_url);
        } catch (err) {
            setError("Failed to generate audio. Please try again.");
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const handleDownloadAudio = async () => {
        // Audio download logic would be implemented here
        // Using the audioService.downloadAudio method
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                        <div className="flex-1 space-y-4 py-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-300 rounded"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="bg-red-50 p-4 rounded-md">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-lg font-medium text-red-800">
                                {error}
                            </h3>
                            <Button
                                variant="primary"
                                className="mt-4"
                                onClick={() => navigate("/")}
                            >
                                Return Home
                            </Button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-2">{transcript.title}</h1>
                <div className="flex flex-wrap gap-4 mb-6">
                    <a
                        href={`https://www.youtube.com/watch?v=${transcript.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 flex items-center"
                    >
                        <svg
                            className="w-5 h-5 mr-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                        View on YouTube
                    </a>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px" aria-label="Tabs">
                            <button
                                className={`py-4 px-6 font-medium ${
                                    activeTab === "original"
                                        ? "border-b-2 border-purple-500 text-purple-600"
                                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                                onClick={() => setActiveTab("original")}
                            >
                                Original Transcript
                            </button>
                            <button
                                className={`py-4 px-6 font-medium ${
                                    activeTab === "rewritten"
                                        ? "border-b-2 border-purple-500 text-purple-600"
                                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                                onClick={() => setActiveTab("rewritten")}
                                disabled={!transcript.rewritten_text}
                            >
                                Rewritten Content
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === "original" ? (
                            <div className="prose max-w-none">
                                <p className="whitespace-pre-line">
                                    {transcript.original_text}
                                </p>
                            </div>
                        ) : (
                            <div className="prose max-w-none">
                                {transcript.rewritten_text ? (
                                    <p className="whitespace-pre-line">
                                        {transcript.rewritten_text}
                                    </p>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 mb-4">
                                            You haven't rewritten this
                                            transcript yet.
                                        </p>
                                        <Button
                                            onClick={handleRewrite}
                                            variant="primary"
                                        >
                                            Rewrite Now
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">
                            Rewrite Options
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tone
                            </label>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                                value={rewriteOptions.tone}
                                onChange={(e) =>
                                    setRewriteOptions({
                                        ...rewriteOptions,
                                        tone: e.target.value,
                                    })
                                }
                                disabled={rewriting}
                            >
                                <option value="professional">
                                    Professional
                                </option>
                                <option value="casual">Casual</option>
                                <option value="formal">Formal</option>
                                <option value="academic">Academic</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Clarity Level
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    value={rewriteOptions.clarity_level}
                                    onChange={(e) =>
                                        setRewriteOptions({
                                            ...rewriteOptions,
                                            clarity_level: parseInt(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    className="w-full h-2 bg-gray-200 rounded-md appearance-none"
                                    disabled={rewriting}
                                />
                                <span className="ml-2 text-gray-700">
                                    {rewriteOptions.clarity_level}
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={handleRewrite}
                            isLoading={rewriting}
                        >
                            {transcript.rewritten_text
                                ? "Rewrite Again"
                                : "Rewrite Content"}
                        </Button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">
                            Generate Audio
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Voice Model
                            </label>
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                                value={selectedVoice}
                                onChange={(e) =>
                                    setSelectedVoice(e.target.value)
                                }
                                disabled={generating}
                            >
                                <option value="default">Default</option>
                                {voices.map((voice) => (
                                    <option key={voice.id} value={voice.id}>
                                        {voice.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-gray-600">
                                Audio will be generated from the{" "}
                                {activeTab === "original"
                                    ? "original"
                                    : "rewritten"}{" "}
                                content.
                            </p>
                        </div>

                        {audioUrl ? (
                            <>
                                <audio
                                    className="w-full mb-4"
                                    controls
                                    src={audioUrl}
                                ></audio>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleGenerateAudio}
                                    >
                                        Regenerate
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        onClick={handleDownloadAudio}
                                    >
                                        Download
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={handleGenerateAudio}
                                isLoading={generating}
                            >
                                Generate Audio
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default TranscriptPage;
