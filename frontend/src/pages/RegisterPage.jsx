import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import TextInput from "../components/ui/TextInput";
import Button from "../components/ui/Button";

const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const [serverError, setServerError] = useState(null);
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const password = watch("password");

    const onSubmit = async (data) => {
        setServerError(null);
        setIsLoading(true);
        try {
            const user = await registerUser({
                username: data.username,
                email: data.email,
                password: data.password,
                full_name: data.fullName,
            });
            if (user) {
                // Redirect to the main page after successful registration
                navigate("/", { state: { profilePhoto: user.profile_photo } });
            }
        } catch (error) {
            console.error("Registration error:", error);
            setServerError(
                error.response?.data?.detail ||
                    "Registration failed. Please try again."
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
                        Create a new account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{" "}
                        <Link
                            to="/login"
                            className="font-medium text-purple-600 hover:text-purple-500"
                        >
                            sign in to your existing account
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
                                label="Full Name"
                                {...register("fullName", {
                                    required: "Full name is required",
                                })}
                                placeholder="John Doe"
                                error={errors.fullName?.message}
                                required
                            />
                        </div>
                        <div>
                            <TextInput
                                label="Username"
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: {
                                        value: 3,
                                        message:
                                            "Username must be at least 3 characters",
                                    },
                                })}
                                placeholder="johndoe"
                                error={errors.username?.message}
                                required
                            />
                        </div>
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
                        <div>
                            <TextInput
                                label="Confirm Password"
                                type="password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === password ||
                                        "The passwords do not match",
                                })}
                                placeholder="••••••••"
                                error={errors.confirmPassword?.message}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
