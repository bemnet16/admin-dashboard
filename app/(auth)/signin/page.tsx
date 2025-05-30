"use client";

import React from "react";
import { poppins } from "@/components/ui/fonts";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type formFields = {
  email: string;
  password: string;
};

const SigninPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { register, handleSubmit, formState } = useForm<formFields>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { errors, isSubmitting } = formState;
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data: formFields) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-end bg-background">
      <Image
        src="/images/login.avif"
        alt="login"
        width={100}
        height={100}
        className="w-full p-40 hidden md:block"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col items-center justify-around mr-32 w-full p-24"
      >
        <h1
          className={`${poppins.className} text-foreground text-4xl font-extrabold mb-2`}
        >
          Welcome Back,
        </h1>

        <label
          className="w-full font-[600] text-muted-foreground mb-1"
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          className="w-full rounded-lg border border-input bg-background text-foreground p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
          type="email"
          id="email"
          {...register("email", { required: "Email is required!" })}
          placeholder="Enter email address"
        />
        {errors?.email && (
          <p className="w-full text-xs text-destructive text-end mt-[-14px]">
            {errors.email.message}
          </p>
        )}

        <label
          className="w-full font-[600] text-muted-foreground mb-1"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="w-full rounded-lg border border-input bg-background text-foreground p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-ring"
          type="password"
          id="password"
          {...register("password", { required: "Password is required!" })}
          placeholder="Enter password"
        />
        {errors?.password && (
          <p className="w-full text-xs text-destructive text-end mt-[-14px]">
            {errors.password.message}
          </p>
        )}

        <button 
          disabled={isLoading || isSubmitting}
          className={`rounded-full bg-primary text-primary-foreground w-full py-2 text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading || isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm my-4 text-muted-foreground w-full text-center">
          Don't have an account?
          <Link href="/signup" className="text-primary ml-2 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SigninPage;
