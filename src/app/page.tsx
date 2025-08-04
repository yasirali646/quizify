"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, GraduationCap, Plane, Home, ShoppingBag, Heart, Briefcase } from "lucide-react";

const categories = [
  {
    id: "travel",
    name: "Travel & Holidays",
    icon: Plane,
    description: "Essential vocabulary for travel and tourism",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "friends",
    name: "Friends & Relationships",
    icon: Users,
    description: "Vocabulary for social interactions",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    description: "Academic and educational terms",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "home",
    name: "Home & Family",
    icon: Home,
    description: "Family and household vocabulary",
    color: "from-orange-500 to-amber-500"
  },
  {
    id: "shopping",
    name: "Shopping & Consumerism",
    icon: ShoppingBag,
    description: "Shopping and consumer vocabulary",
    color: "from-purple-500 to-violet-500"
  },
  {
    id: "health",
    name: "Health & Fitness",
    icon: Heart,
    description: "Health and medical terminology",
    color: "from-red-500 to-pink-500"
  },
  {
    id: "work",
    name: "Work & Career",
    icon: Briefcase,
    description: "Professional and workplace vocabulary",
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: "general",
    name: "General Vocabulary",
    icon: BookOpen,
    description: "Mixed vocabulary for all topics",
    color: "from-gray-500 to-slate-500"
  }
];

export default function HomePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      router.push(`/mode?category=${categoryId}`);
    }, 300);
  };

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Build your vocabulary easily
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto drop-shadow-md">
            Transform your IELTS vocabulary learning into fully functional quizzes with zero friction.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  selectedCategory === category.id ? "ring-2 ring-white/30" : ""
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="relative p-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center text-white/80 font-medium text-sm group-hover:text-white transition-colors">
                    Start Quiz
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
