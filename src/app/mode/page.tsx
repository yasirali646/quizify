"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, PenTool, Sparkles, BookOpen } from "lucide-react";

export default function ModePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
    setTimeout(() => {
      if (mode === "manual") {
        router.push(`/manual?category=${category}`);
      } else {
        router.push(`/ai?category=${category}`);
      }
    }, 300);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Categories
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Choose Quiz Mode
            </h1>
            <p className="text-xl text-white/80">
              Select how you&apos;d like to create your vocabulary quiz
            </p>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Manual Mode */}
            <div
              onClick={() => handleModeSelect("manual")}
              className={`group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedMode === "manual" ? "ring-2 ring-white/30" : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="relative p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <PenTool className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-white transition-colors">
                  Manual Wording
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Create your own vocabulary list by entering words manually. Perfect for targeted practice on specific terms you want to master.
                </p>
                <ul className="text-sm text-white/60 space-y-2 mb-6">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    Enter words one by one
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    Full control over vocabulary
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    Customize your learning focus
                  </li>
                </ul>
                <div className="flex items-center text-white/80 font-medium group-hover:text-white transition-colors">
                  Start Manual Quiz
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* AI Mode */}
            <div
              onClick={() => handleModeSelect("ai")}
              className={`group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                selectedMode === "ai" ? "ring-2 ring-white/30" : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="relative p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-white transition-colors">
                  AI Generated
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  Let AI create vocabulary quizzes for you with advanced settings for difficulty, question types, and time limits.
                </p>
                <ul className="text-sm text-white/60 space-y-2 mb-6">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                    AI-powered question generation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                    Advanced difficulty settings
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                    Multiple question types
                  </li>
                </ul>
                <div className="flex items-center text-white/80 font-medium group-hover:text-white transition-colors">
                  Start AI Quiz
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Category Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-black/20 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/10">
              <BookOpen className="w-5 h-5 text-white mr-3" />
              <span className="text-white font-medium">
                Category: {category ? category.charAt(0).toUpperCase() + category.slice(1) : "General"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 