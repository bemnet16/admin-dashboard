"use client";

import React, { useEffect } from "react";
import { poppins } from "@/components/ui/fonts";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";

import { usePostSignupMutation } from "@/store/services/authApi";
import { updateUser } from "@/store/features/userSlice";
import { useDispatch } from "react-redux";

type formFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  gender: string;
};

interface ErrorResponse {
  message: string;
}

const SignupPage = () => {
  const [
    registerUser,
    { isError, isLoading, data: userInfo, error, isSuccess },
  ] = usePostSignupMutation();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState, watch } = useForm<formFields>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      gender: "",
    },
  });
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (userInfo && isSuccess) {
      redirect("/otp-verify");
    }
  }, [userInfo, isSuccess]);

  const onSubmit = async (data: formFields) => {
    const { confirmPassword, ...submitData } = data;
    dispatch(updateUser(submitData));
    try {
      await registerUser(submitData);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col items-center justify-around w-full p-6 sm:w-3/4 md:w-3/5 lg:w-1/2 xl:w-1/3 lg:px-16"
      >
        <h1
          className={`${poppins.className} text-foreground text-4xl font-black`}
        >
          Sign Up Today!
        </h1>

        <label className="w-full font-[600] text-muted-foreground mb-1" htmlFor="firstName">
          First Name
        </label>
        <input
          className="w-full rounded-md border border-input bg-background text-foreground p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
          type="text"
          id="firstName"
          {...register("firstName", { required: "First name is required!" })}
          placeholder="Enter first name"
        />
        {errors?.firstName && (
          <p className="w-full text-xs text-destructive text-end mt-[-14px]">
            {errors.firstName.message}
          </p>
        )}

        <label className="w-full font-[600] text-muted-foreground mb-1" htmlFor="lastName">
          Last Name
        </label>
        <input
          className="w-full rounded-md border border-input bg-background text-foreground p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
          type="text"
          id="lastName"
          {...register("lastName", { required: "Last name is required!" })}
          placeholder="Enter last name"
        />
        {errors?.lastName && (
          <p className="w-full text-xs text-destructive text-end mt-[-14px]">
            {errors.lastName.message}
          </p>
        )}

        <label className="w-full font-[600] text-muted-foreground mb-1" htmlFor="email">
          Email Address
        </label>
        <input
          className="w-full rounded-md border border-input bg-background text-foreground p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required!",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address!",
            },
          })}
          placeholder="Enter email address"
        />
        {errors?.email && (
          <p className="w-full text-xs text-destructive text-end mt-[-14px]">
            {errors.email.message}
          </p>
        )}

        <label className="w-full font-[600] text-muted-foreground mb-1" htmlFor="password">
          Password
        </label>
        <input
          className="w-full rounded-md border border-input bg-background text-foreground p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
          type="password"
          id="password"
          {...register("password", {
            required: "Password is required!",
            minLength: {
              value: 6,
              message: "password length minimum of 6 charachter",
            },
          })}
          placeholder="Enter password"
        />
        {errors?.password && (
          <p className="w-full text-xs text-destructive text-end mt-[-14px]">
            {errors.password.message}
          </p>
        )}

        <label className="w-full font-[600] text-muted-foreground mb-1" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          className="w-full rounded-md border border-input bg-background text-foreground p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
          type="password"
          id="confirmPassword"
          {...register("confirmPassword", {
            required: "Confirm password is required!",
            validate: (value) =>
              value === watch("password") || "Passwords do not match!",
          })}
          placeholder="Confirm password"
        />
        {errors?.confirmPassword && (
          <p className="w-full text-xs text-destructive text-end mt-[-14px]">
            {errors.confirmPassword.message}
          </p>
        )}

        <label className="w-full font-[600] text-muted-foreground mb-1" htmlFor="gender">
          Gender
        </label>
        <select
          className="w-full rounded-md border border-input bg-background text-foreground p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
          id="gender"
          {...register("gender", { required: "Gender is required!" })}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors?.gender && (
          <p className="w-full text-xs text-destructive text-end mt-[-14px]">
            {errors.gender.message}
          </p>
        )}

        {isError && "data" in error && (
          <p className="w-full text-xs text-destructive">
            {(error.data as ErrorResponse).message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`rounded-full bg-primary text-primary-foreground w-full py-2 text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting || isLoading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-sm my-4 text-muted-foreground w-full text-center">
          Already have an account?
          <Link href="/signin" className="text-primary ml-2 font-semibold hover:underline">
            Login
          </Link>
        </p>
        <p className="text-[14px] text-muted-foreground">
          By clicking 'Create Account', you acknowledge that you have read and
          accepted our
          <span className="text-primary font-medium"> Terms of Service </span>
          and
          <span className="text-primary font-medium"> Privacy Policy</span>.
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
