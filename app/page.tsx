"use client";

import Lheader from "@/components/Lheader";
import Pricing from "@/components/Pricing";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CircleDollarSign } from "lucide-react";
import Image from "next/image";
export default function Home() {
  const router = useRouter();

  return (
    <>
      <Lheader />
      <section id="home">
        <div className="flex container mx-auto justify-center w-full">
          <div className="my-10 py-4 w-1/2">
            <div className="inline-block py-1 px-4 bg-green-700/70 text-white rounded-full">
              <p className="font-semibold text-sm">Finance Solutions for you</p>
            </div>
            <h1 className="text-6xl font-bold pt-5 py-3">Maximize your finances with our tools <CircleDollarSign className="inline-block w-12 h-12 text-green-700" /></h1>
            <p className="text-gray-500">Welcome to ClearCash, where we help you manage your finances with ease.</p>
            <Button className="mt-5 bg-linear-to-r from-green-600 to-teal-600 hover:bg-linear-to-r hover:from-green-700 hover:to-teal-700 w-1/2" onClick={() => router.push("/auth")}>Get Started</Button>
          </div>
          <div className="">
            <Image src="/heroImage.png" alt="home" width={700} height={700} className="rounded-lg w-2/3" />
          </div>
        </div>
      </section>
      <Pricing />
    </>
  );
}