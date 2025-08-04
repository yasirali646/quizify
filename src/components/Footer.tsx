import {Github} from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-black/20 backdrop-blur-xl border-t border-white/10 shadow-2xl">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 py-6">
        <div className="text-white/60 text-sm">
          © {new Date().getFullYear()} Quizify. Master your IELTS vocabulary with confidence.
        </div>
        <div className="flex gap-4">
          <a 
            href="https://github.com/yasirali646/quizify" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/60 hover:text-white text-sm transition-colors focus:outline-none focus:ring-0 border-0"
          >
            <Github size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}