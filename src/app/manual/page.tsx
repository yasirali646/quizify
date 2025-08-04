"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, X, Play, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

function ManualContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [words, setWords] = useState<string[]>([""]);
  const [currentInput, setCurrentInput] = useState("");

  const handleAddWord = () => {
    if (currentInput.trim()) {
      setWords([...words, currentInput.trim()]);
      setCurrentInput("");
    }
  };

  const handleRemoveWord = (index: number) => {
    if (words.length > 1) {
      const newWords = words.filter((_, i) => i !== index);
      setWords(newWords);
    }
  };

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const handleGenerateQuiz = () => {
    const validWords = words.filter(word => word.trim() !== "");
    if (validWords.length < 3) {
      toast.error("Please add at least 3 words to generate a quiz");
      return;
    }
    
    // Store words in sessionStorage for the quiz
    sessionStorage.setItem("quizWords", JSON.stringify(validWords));
    sessionStorage.setItem("quizMode", "manual");
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
              Manual Word Entry
            </h1>
            <p className="text-xl text-white/80">
              Enter the vocabulary words you want to practice
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

          {/* Word Entry Section */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Enter Your Words</h2>
            
            {/* Existing Words */}
            <div className="space-y-4 mb-6">
              {words.map((word, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={word}
                      onChange={(e) => handleWordChange(index, e.target.value)}
                      placeholder={`Enter word ${index + 1}`}
                      className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all text-white placeholder-white/40"
                    />
                  </div>
                  {words.length > 1 && (
                    <button
                      onClick={() => handleRemoveWord(index)}
                      className="p-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Word */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddWord()}
                  placeholder="Add another word..."
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all text-white placeholder-white/40"
                />
              </div>
              <button
                onClick={handleAddWord}
                disabled={!currentInput.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
              <h3 className="font-semibold text-blue-200 mb-2">Instructions:</h3>
              <ul className="text-sm text-blue-100 space-y-1">
                <li>• Enter at least 3 words to generate a quiz</li>
                <li>• Each word will be used to create multiple choice questions</li>
                <li>• You can add or remove words as needed</li>
                <li>• Press Enter to quickly add a word</li>
              </ul>
            </div>
          </div>

          {/* Generate Quiz Button */}
          <div className="text-center">
            <button
              onClick={handleGenerateQuiz}
              disabled={words.filter(word => word.trim() !== "").length < 3}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center mx-auto shadow-lg"
            >
              <Play className="w-6 h-6 mr-3" />
              Generate Quiz
            </button>
            <p className="text-sm text-white/60 mt-3">
              {words.filter(word => word.trim() !== "").length} words ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}

export default function ManualPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ManualContent />
    </Suspense>
  );
} 