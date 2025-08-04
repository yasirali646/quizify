"use client";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={() => router.push("/")}> 
          <BookOpen className="w-7 h-7 text-white" />
          <span className="text-2xl font-bold text-white">Quizify</span>
        </div>
        <div className="flex gap-6 items-center">
          <button 
            onClick={() => router.push("/")} 
            className="text-white/80 hover:text-white font-medium transition-colors cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={() => router.push("/mode?category=general")} 
            className="text-white/80 hover:text-white font-medium transition-colors cursor-pointer"
          >
            Start Quiz
          </button>
          <a 
            href="https://ielts.org/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/80 hover:text-white font-medium transition-colors cursor-pointer"
          >
            IELTS
          </a>
        </div>
      </div>
    </nav>
  );
}