"use client";

import React from "react";
import { poppins } from "@/components/ui/fonts";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import GoogleLoginButton from "@/components/googleLoginButton";
import { useRouter } from "next/navigation";

type formFields = {
  email: string;
  password: string;
};

const SigninPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { register, handleSubmit, formState, watch } = useForm<formFields>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors, isSubmitting, isSubmitSuccessful } = formState;

  const onSubmit = async (data: formFields) => {
    try {
      if (data.email && data.password) {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
          callbackUrl: "/",
        });
        
        if (result?.error) {
          console.log(result.error);
        } else if (result?.ok) {
          router.push("/");
        }
      } else {
        throw new Error("Email and password are required");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-end ">
      <Image
        src="/images/login.avif"
        alt="login"
        width={100}
        height={100}
        className="w-full p-40"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col items-center justify-around mr-32 w-full p-24"
      >
        <h1
          className={`${poppins.className} text-[#25324B] text-4xl font-extrabold mb-2`}
        >
          Welcome Back,
        </h1>
        <GoogleLoginButton />

        <div className="flex w-full justify-between items-center my-4 ">
          <hr className="w-1/4  bg-black" />
          <span className="text-gray-500">Or Sign in with Email</span>
          <hr className="w-1/4  bg-black" />
        </div>

        <label
          className="w-full font-[600] text-[#515B6F] mb-1"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          className="w-full rounded-lg border-[1px] border-[#D6DDEB]  text-[#A8ADB7] p-2 mb-4"
          type="email"
          id="email"
          {...register("email", { required: "Email is required!" })}
          placeholder="Enter email address"
        />
        <label
          className="w-full font-[600] text-[#515B6F] mb-1"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="w-full rounded-lg border-[1px] border-[#D6DDEB]  text-[#A8ADB7] p-2 mb-4"
          type="password"
          id="password"
          {...register("password", { required: "Password is required!" })}
          placeholder="Enter password"
        />

        <button className="rounded-full bg-[#4640DE] text-white w-full py-2 text-sm font-bold">
          Login
        </button>
        <p className="text-sm my-4 text-gray-500 w-full text-start">
          Don't have an account?
          <Link href="/signup" className="text-indigo-900 ml-2 font-semibold">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SigninPage;
