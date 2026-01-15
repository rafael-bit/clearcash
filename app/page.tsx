"use client";

import Lheader from "@/components/Lheader";
import Pricing from "@/components/Pricing";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { 
  CheckIcon, 
  CircleDollarSign, 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Bell,
  FileText,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-in-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: "Track Income & Expenses",
      description: "Keep track of all your financial transactions in one place with ease."
    },
    {
      icon: BarChart3,
      title: "Budget Management",
      description: "Create and manage your budget with intelligent categorization."
    },
    {
      icon: FileText,
      title: "Financial Goals",
      description: "Set financial goals and track your progress with detailed insights."
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Receive alerts and notifications for important financial events."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and stored securely."
    },
    {
      icon: Sparkles,
      title: "Detailed Reports",
      description: "Generate comprehensive reports to understand your financial health."
    }
  ];

  return (
    <>
      <Lheader />
      
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-teal-50 to-white -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-20 -z-10" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className={`flex-1 space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full text-sm font-medium shadow-lg shadow-green-500/30">
                <Sparkles className="w-4 h-4" />
                <span>Finance Solutions for You</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Maximize your{" "}
                <span className="bg-gradient-to-r from-green-600 via-teal-600 to-green-600 bg-clip-text text-transparent animate-gradient">
                  finances
                </span>{" "}
                with our tools
                <CircleDollarSign className="inline-block w-12 h-12 md:w-16 md:h-16 text-green-600 ml-3 animate-bounce" />
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
                Welcome to ClearCash, where we help you manage your finances with ease. 
                Take control of your money with powerful tools and insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="group bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105"
                  onClick={() => router.push("/auth")}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-full border-2 hover:bg-gray-50 transition-all duration-300"
                  onClick={() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className={`flex-1 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 rounded-3xl blur-2xl opacity-30 animate-pulse" />
                <Image 
                  src="/heroImage.png" 
                  alt="ClearCash Dashboard" 
                  width={700} 
                  height={700} 
                  className="relative rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comprehensive <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Financial</span> Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive financial analysis of your income, expenses, and investments 
              using advanced algorithms to give you detailed insights into your financial health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 fade-in-on-scroll"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Additional Feature Details */}
          <div className="flex flex-col lg:flex-row gap-8 items-center bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 fade-in-on-scroll">
            <div className="flex-1">
              <Image 
                src="/features.png" 
                alt="Features" 
                width={600} 
                height={600} 
                className="rounded-2xl shadow-lg" 
              />
            </div>
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">Everything you need to manage your finances</h3>
              <div className="space-y-4">
                {[
                  "Keep track of your income and expenses",
                  "Create and manage your budget",
                  "Set financial goals and track your progress",
                  "Receive alerts and notifications for important financial events",
                  "Generate detailed reports and insights"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Pricing />
    </>
  );
}