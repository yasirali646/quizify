"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Settings, Sparkles, BookOpen, Play } from "lucide-react";

interface QuizSettings {
  // Basic Settings
  questionLimit: number;
  difficultyLevel: string;
  attempts: number;
  
  // Advanced Settings
  questionType: string;
  timeLimit: number;
}

export default function AIPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  const [settings, setSettings] = useState<QuizSettings>({
    questionLimit: 10,
    difficultyLevel: "medium",
    attempts: 3,
    questionType: "multiple-choice",
    timeLimit: 60
  });

  const handleSettingChange = (key: keyof QuizSettings, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerateQuiz = () => {
    // Store settings in sessionStorage for the quiz
    sessionStorage.setItem("quizSettings", JSON.stringify(settings));
    sessionStorage.setItem("quizMode", "ai");
    sessionStorage.setItem("quizCategory", category || "general");
    
    router.push("/quiz");
  };

  const handleBack = () => {
    router.push(`/mode?category=${category}`);
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <button
            onClick={handleBack}
            className="flex items-center text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Mode Selection
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              AI Quiz Settings
            </h1>
            <p className="text-xl text-white/80">
              Configure your AI-generated vocabulary quiz
            </p>
          </div>

          {/* Category Info */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-black/20 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/10">
              <BookOpen className="w-5 h-5 text-white mr-3" />
              <span className="text-white font-medium">
                Category: {category ? category.charAt(0).toUpperCase() + category.slice(1) : "General"}
              </span>
            </div>
          </div>

          {/* Settings Container */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab("basic")}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === "basic"
                    ? "text-white border-b-2 border-white/30 bg-white/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Settings className="w-5 h-5 inline mr-2" />
                Basic Settings
              </button>
              <button
                onClick={() => setActiveTab("advanced")}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === "advanced"
                    ? "text-white border-b-2 border-white/30 bg-white/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                Advanced Settings
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Basic Settings</h2>
                  
                  {/* Question Limit */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Questions Limit
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[10, 20, 30].map((limit) => (
                        <button
                          key={limit}
                          onClick={() => handleSettingChange("questionLimit", limit)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all ${
                            settings.questionLimit === limit
                              ? "border-white/50 bg-white/10 text-white"
                              : "border-white/20 hover:border-white/30 text-white/70 hover:text-white"
                          }`}
                        >
                          {limit} Questions
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "easy", label: "Easy" },
                        { value: "medium", label: "Medium" },
                        { value: "hard", label: "Hard" },
                        { value: "easy, medium, and hard", label: "Mixed" }
                      ].map((level) => (
                        <button
                          key={level.value}
                          onClick={() => handleSettingChange("difficultyLevel", level.value)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                            settings.difficultyLevel === level.value
                              ? "border-white/50 bg-white/10 text-white"
                              : "border-white/20 hover:border-white/30 text-white/70 hover:text-white"
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Attempts */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Attempts (Chances)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((attempt) => (
                        <button
                          key={attempt}
                          onClick={() => handleSettingChange("attempts", attempt)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all ${
                            settings.attempts === attempt
                              ? "border-white/50 bg-white/10 text-white"
                              : "border-white/20 hover:border-white/30 text-white/70 hover:text-white"
                          }`}
                        >
                          {attempt} {attempt === 1 ? "Attempt" : "Attempts"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "advanced" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Advanced Settings</h2>
                  
                  {/* Question Type */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Question Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "multiple-choice", label: "Multiple Choice" },
                        { value: "true-false", label: "True & False" },
                        { value: "multiple-choice and true-false", label: "Mixed" }
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => handleSettingChange("questionType", type.value)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all ${
                            settings.questionType === type.value
                              ? "border-white/50 bg-white/10 text-white"
                              : "border-white/20 hover:border-white/30 text-white/70 hover:text-white"
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Limit */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Time Limit
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 30, label: "30 seconds" },
                        { value: 60, label: "1 minute" },
                        { value: 300, label: "5 minutes" }
                      ].map((time) => (
                        <button
                          key={time.value}
                          onClick={() => handleSettingChange("timeLimit", time.value)}
                          className={`px-4 py-3 rounded-lg border-2 transition-all ${
                            settings.timeLimit === time.value
                              ? "border-white/50 bg-white/10 text-white"
                              : "border-white/20 hover:border-white/30 text-white/70 hover:text-white"
                          }`}
                        >
                          {time.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generate Quiz Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleGenerateQuiz}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center mx-auto shadow-lg"
            >
              <Play className="w-6 h-6 mr-3" />
              Generate AI Quiz
            </button>
            <p className="text-sm text-white/60 mt-3">
              {settings.questionLimit} questions • {settings.difficultyLevel} difficulty • {settings.attempts} attempts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 