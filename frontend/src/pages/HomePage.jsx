import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";
import transcriptService from "../services/transcriptService";

const HomePage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setError(null);
        setIsLoading(true);
        try {
            const result = await transcriptService.extractTranscript(
                data.youtubeUrl
            );
            reset();
            navigate(`/transcript/${result.id}`, {
                state: { transcript: result },
            });
        } catch (err) {
            // Handle error properly - make sure it's a string
            let errorMessage =
                "Failed to extract transcript. Please check the URL and try again.";

            if (err.response?.data?.detail) {
                // If it's a string, use it directly
                if (typeof err.response.data.detail === "string") {
                    errorMessage = err.response.data.detail;
                }
                // If it's an object with message property
                else if (err.response.data.detail.message) {
                    errorMessage = err.response.data.detail.message;
                }
                // If it's a validation error from FastAPI
                else if (Array.isArray(err.response.data.detail)) {
                    errorMessage = err.response.data.detail
                        .map((e) => e.msg)
                        .join(". ");
                }
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Transform YouTube Content with AI
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Extract, rewrite, and generate audio from any
                            YouTube video in seconds
                        </p>

                        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Start by pasting a YouTube URL
                            </h2>

                            {error && (
                                <div className="bg-red-50 p-4 rounded-md mb-6">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                {error}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <TextInput
                                    label="YouTube Video URL"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    {...register("youtubeUrl", {
                                        required: "YouTube URL is required",
                                        pattern: {
                                            value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/,
                                            message:
                                                "Please enter a valid YouTube URL",
                                        },
                                    })}
                                    error={errors.youtubeUrl?.message}
                                    required
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    isLoading={isLoading}
                                >
                                    Extract Transcript
                                </Button>
                            </form>

                            <div className="mt-6 text-sm text-gray-500">
                                <p>Examples of supported video types:</p>
                                <ul className="list-disc list-inside mt-2">
                                    <li>Educational lectures</li>
                                    <li>Podcasts</li>
                                    <li>Tutorials</li>
                                    <li>Interviews</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                                    Extract Transcript
                                </h3>
                                <p className="text-gray-500 text-center">
                                    Pull the complete transcript from any
                                    YouTube video with a single click.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                                    Rewrite Content
                                </h3>
                                <p className="text-gray-500 text-center">
                                    Transform the transcript into clear, concise
                                    text with your preferred tone.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                                    Generate Audio
                                </h3>
                                <p className="text-gray-500 text-center">
                                    Convert your rewritten text into
                                    natural-sounding speech with various voice
                                    options.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default HomePage;
