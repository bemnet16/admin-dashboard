"use client";

import { userInfoStateType } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { useVerifyEmailMutation, useResendOtpMutation } from "@/store/services/authApi";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface ErrorResponse {
  message: string;
}

type OtpFormFields = {
  otp: string[];
};

const OtpPage = () => {
  const router = useRouter();
  const userInfo = useSelector((state: userInfoStateType) => state.userInfo);
  const [
    verifyEmail,
    {
      isError: isVerifyError,
      isLoading,
      data: verifiedData,
      isSuccess,
      error: verifyError,
    },
  ] = useVerifyEmailMutation();

  const [
    resendOtp,
    { isError: isResendingError, isLoading: isResending, error: resendError },
  ] = useResendOtpMutation();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { isLoading: isVerifying, isSubmitting },
  } = useForm<OtpFormFields>({
    defaultValues: {
      otp: ["", "", "", "", "", ""],
    },
  });

  const [resendTimer, setResendTimer] = useState(30);
  const [resendEnabled, setResendEnabled] = useState(true);
  const [showError, setShowError] = useState(false);

  const otpValues = watch("otp");

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 100);
      return () => clearTimeout(timerId);
    } else {
      setResendEnabled(true);
    }
  }, [resendTimer]);

  const onSubmit = async (verifiedData: OtpFormFields) => {
    if (!userInfo.email) {
      router.push("/signup");
      return;
    }

    const otpValue = verifiedData.otp.join("");

    try {
      const result = await verifyEmail({
        email: userInfo.email,
        verificationCode: otpValue,
      });

      if (result.error) {
        setShowError(true);
        console.log("OTP verification failed:", result.error);
        return;
      }

      if (result.data) {
        const signInResult = await signIn("credentials", {
          email: userInfo.email,
          password: userInfo.password,
          redirect: false,
          callbackUrl: "/",
        });
        console.log(signInResult, "signInResult");
        if (signInResult?.url) {
          router.push(signInResult.url);
        } else {
          console.log("Sign-in failed, no redirect URL found.");
        }
      }
    } catch (err) {
      console.error("Error during OTP verification or sign-in:", err);
      setShowError(true);
    }
  };

  const handleInputChange = (value: string, index: number) => {
    const otpValues = getValues("otp");
    otpValues[index] = value;
    setValue("otp", otpValues);

    if (value && index < 5) {
      const nextField = document.getElementById(`otp-${index + 1}`);
      if (nextField) nextField.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !e.currentTarget.value) {
      const prevField = document.getElementById(`otp-${index - 1}`);
      if (prevField) prevField.focus();
    }
  };

  const handleResend = async () => {
    if (resendEnabled) {
      setShowError((preVal) => false);
      setResendTimer(30);
      setResendEnabled(false);
      await resendOtp({ email: userInfo.email });
    }
  };

  const isOtpComplete = otpValues.every((value) => value !== "");
  // if (isVerifyError) {
  //   setShowError((preVal) => true);
  // }

  // if (isResendingError) {
  //   setShowError((preVal) => true);
  // }

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-around w-96"
      >
        <h1 className="text-3xl font-extrabold text-[#25324B] mb-8">
          Verify Email
        </h1>
        <p className="text-[14px] text-gray-500 text-justify">
          We've sent a verification code to the email address you provided. To
          complete the verification process, please enter the code here.
        </p>
        <div className="flex justify-around w-full mb-8 mt-14">
          {Array.from({ length: 6 }, (_, index) => (
            <Controller
              key={index}
              control={control}
              name={`otp.${index}`}
              render={({ field }) => (
                <input
                  {...field}
                  id={`otp-${index}`}
                  type="text"
                  placeholder="0"
                  maxLength={1}
                  className="w-12 h-10 text-center text-gray-600 text-2xl border-2 border-[#4640DE]/35 bg-gray-50 rounded-md focus:outline-none"
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                />
              )}
            />
          ))}
        </div>

        {showError &&
          isVerifyError &&
          resendEnabled &&
          "data" in verifyError && (
            <p className="w-full text-sm text-center my-2  text-red-500 ">
              {(verifyError.data as ErrorResponse).message}
            </p>
          )}

        {showError &&
          !isVerifyError &&
          isResendingError &&
          resendEnabled &&
          "data" in resendError && (
            <p className="w-full text-sm text-center my-2  text-red-500 ">
              {(resendError.data as ErrorResponse).message}
            </p>
          )}

        {!resendEnabled && (
          <p className="text-sm my-4 text-gray-500 w-full text-center">
            <span>
              You can request to
              <span className="text-[#4640DE] font-semibold">
                {" "}
                Resend code{" "}
              </span>
              in
              <span className="text-[#4640DE] font-semibold">
                {" " + resendTimer + " "}
              </span>
              seconds
            </span>
          </p>
        )}

        <button
          type="submit"
          disabled={!isOtpComplete || isVerifying}
          className={`rounded-full ${
            !isOtpComplete || isVerifying || isSubmitting
              ? "bg-gray-300"
              : "bg-[#4640DE]"
          } text-white w-full py-2 text-sm font-bold`}
        >
          {isVerifying || isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-sm my-4 text-gray-500 w-full text-center">
          {resendEnabled && (
            <button
              type="button"
              onClick={handleResend}
              className="text-indigo-900 font-semibold"
            >
              Resend OTP
            </button>
          )}
        </p>
      </form>
    </div>
  );
};

export default OtpPage;
