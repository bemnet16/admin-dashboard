import Image from "next/image";
import { signIn } from "next-auth/react";

const GoogleLoginButton = () => {
  const logInWithGoogle = () => {
    try {
      signIn("google", { callbackUrl: "http://localhost:3000/" });
    } catch (error) {}
  };
  return (
    <button
      style={{
        color: "#4640DE",
      }}
      onClick={logInWithGoogle}
      className="bg-white border border-gray-300 text-gray-800 font-medium py-2.5 px-4 my-4 rounded-xl flex items-center justify-center w-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:border-transparent"
    >
      <div className="h-5 w-5 mr-2">
        <Image
          src="https://w7.pngwing.com/pngs/344/344/png-transparent-google-logo-google-logo-g-suite-google-text-logo-symbol-thumbnail.png"
          alt="Google logo"
          width={20}
          height={20}
        />
      </div>
      <span className="font-semibold text-indigo-800">
        Continue with Google
      </span>
    </button>
  );
};

export default GoogleLoginButton;
