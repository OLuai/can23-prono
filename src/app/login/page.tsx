/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import GoogleButton from "@/components/buttons/GoogleButton";

export default async function Login() {
  return (
    <div className="flex h-screen flex-col items-center justify-around md:p-24">

      {/* <div className="absolute">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div> */}
      <div className="container relative h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Prono Can
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Cette application est faite pour défier vos amis avec vos pronostics en rapport avec la CAN 2023 en Côte d'Ivoire.&rdquo;
              </p>
              <footer className="text-sm">Bonne fête du football africain</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 h-full">
          <div className="mx-auto flex w-full h-full flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-4 text-center">
              <p className="text-xl font-semibold tracking-tight">
                Prono CAN 2023
              </p>
              <GoogleButton />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
