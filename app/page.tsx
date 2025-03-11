"use client";

import Lheader from "@/components/Lheader";
import Pricing from "@/components/Pricing";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckIcon, CircleDollarSign } from "lucide-react";
import Image from "next/image";
export default function Home() {
  const router = useRouter();

  return (
    <>
      <Lheader />
      <section id="home">
        <div className="flex flex-col lg:flex-row container mx-auto justify-center w-full py-10">
          <div className="my-10 lg:w-1/2">
            <div className="inline-block py-1 px-4 bg-green-700/70 text-white rounded-full">
              <p className="font-semibold text-sm">Finance Solutions for you</p>
            </div>
            <h1 className="text-6xl font-bold pt-5 py-3">Maximize your finances with our tools <CircleDollarSign className="inline-block w-12 h-12 text-green-700" /></h1>
            <p className="text-gray-500">Welcome to ClearCash, where we help you manage your finances with ease.</p>
            <Button className="mt-5 bg-linear-to-r from-green-600 to-teal-600 hover:bg-linear-to-r hover:from-green-700 hover:to-teal-700 w-1/2" onClick={() => router.push("/auth")}>Get Started</Button>
          </div>
          <div className="">
            <Image src="/heroImage.png" alt="home" width={700} height={700} className="rounded-2xl" />
          </div>
        </div>
      </section>
      <section id="features">
        <div className="flex flex-col lg:flex-row lg:gap-5 container mx-auto justify-center items-center w-full bg-gray1 m-4 px-7 my-10 rounded-2xl"> 
          <div className="my-10 py-4 w-1/2">
            <Image src="/features.png" alt="features" width={700} height={700} className="rounded-lg" />
          </div> 
          <div className="pb-5 lg:w-1/2">
            <h1 className="text-5xl font-bold">Comprehensive <span className="text-green-600">Financial</span> Analysis</h1>
            <p className="pt-3 text-gray-500">Our platform provides a comprehensive financial analysis of your income, expenses, and investments. We use advanced algorithms to analyze your financial data and provide you with a detailed report of your financial health.</p>
            <hr className="my-5" />
            <div className="">
              <ul>
                <li className="flex items-center gap-3 text-neutral-900">
                  <CheckIcon className="w-4 h-4 text-green-700" />
                  Keep track of your income and expenses  
                </li>
                <li className="flex items-center gap-3 text-neutral-900">
                  <CheckIcon className="w-4 h-4 text-green-700" />
                  Create and manage your budget
                </li>
                <li className="flex items-center gap-3 text-neutral-900">
                  <CheckIcon className="w-4 h-4 text-green-700" />
                  Set financial goals and track your progress
                </li>
                <li className="flex items-center gap-3 text-neutral-900">
                  <CheckIcon className="w-4 h-4 text-green-700" />
                  Receive alerts and notifications for important financial events
                </li>
                <li className="flex items-center gap-3 text-neutral-900">
                  <CheckIcon className="w-4 h-4 text-green-700" />
                  Generate detailed reports and insights
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Pricing />
    </>
  );
}