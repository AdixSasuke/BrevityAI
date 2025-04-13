import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [serverError, setServerError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setServerError(null);
        setIsLoading(true);
        try {
            const user = await login(data);
            if (user) {
                // Redirect to the main page after successful login
                navigate("/", { state: { profilePhoto: user.profile_photo } });
            }
        } catch (error) {
            setServerError(
                error.response?.data?.detail ||
                    "Login failed. Please check your credentials."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="w-12 h-12 mx-auto bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="font-bold text-xl text-white">B</span>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{" "}
                        <Link
                            to="/register"
                            className="font-medium text-purple-600 hover:text-purple-500"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>

                {serverError && (
                    <div className="bg-red-50 p-4 rounded-md">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    {serverError}
                                </h3>
                            </div>
                        </div>
                    </div>
                )}

                <form
                    className="mt-8 space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <TextInput
                                label="Email Address"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                                placeholder="john.doe@example.com"
                                error={errors.email?.message}
                                required
                            />
                        </div>
                        <div>
                            <TextInput
                                label="Password"
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters",
                                    },
                                })}
                                placeholder="••••••••"
                                error={errors.password?.message}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a
                                href="#"
                                className="font-medium text-purple-600 hover:text-purple-500"
                            >
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
