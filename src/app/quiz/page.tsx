"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, Trophy, Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Confetti from "react-confetti";

interface Question {
  id: number;
  word: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface UserSentence {
  word: string;
  userSentence: string;
  aiEnhanced?: string;
  analysis?: string;
}

interface QuizState {
  currentQuestion: number;
  score: number;
  sentencePoints: number;
  attempts: number;
  maxAttempts: number;
  timeLeft: number;
  totalTime: number;
  isComplete: boolean;
  showSentenceInput: boolean;
  currentCorrectAnswer: string;
  usedOptions: string[];
  userSentences: UserSentence[];
}

export default function QuizPage() {
  const router = useRouter();
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    sentencePoints: 0,
    attempts: 0,
    maxAttempts: 3,
    timeLeft: 60,
    totalTime: 60,
    isComplete: false,
    showSentenceInput: false,
    currentCorrectAnswer: "",
    usedOptions: [],
    userSentences: []
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [sentenceInput, setSentenceInput] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingSentence, setIsSubmittingSentence] = useState(false);

  useEffect(() => {
    // Get quiz data from sessionStorage
    const quizMode = sessionStorage.getItem("quizMode");
    const quizCategory = sessionStorage.getItem("quizCategory");
    
    if (quizMode === "manual") {
      const words = JSON.parse(sessionStorage.getItem("quizWords") || "[]");
      generateAIQuestionsFromWords(words, quizCategory);
    } else {
      const settings = JSON.parse(sessionStorage.getItem("quizSettings") || "{}");
      generateAIQuestions(settings, quizCategory);
    }

    // Set window dimensions for confetti
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    if (quizState.timeLeft > 0 && !quizState.isComplete && questions.length > 0) {
      const timer = setTimeout(() => {
        setQuizState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);

      return () => clearTimeout(timer);
    } else if (quizState.timeLeft === 0 && !quizState.isComplete) {
      handleQuizComplete();
    }
  }, [quizState.timeLeft, quizState.isComplete, questions.length]);

  const generateAIQuestionsFromWords = async (words: string[], category: string | null) => {
    try {
      setIsLoading(true);
      toast.loading("Generating AI questions from your words...", { id: "ai-loading" });
      
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category,
          words: words,
          mode: "manual"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        setQuizState(prev => ({
          ...prev,
          maxAttempts: 3,
          timeLeft: 60,
          totalTime: 60
        }));
        toast.success("AI questions generated successfully!", { id: "ai-loading" });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating AI questions:', error);
      toast.error("Failed to generate AI questions. Using fallback questions.", { id: "ai-loading" });
      
      // Use fallback questions based on user's words
      const fallbackQuestions = generateFallbackQuestionsFromWords(words);
      setQuestions(fallbackQuestions);
      setQuizState(prev => ({
        ...prev,
        maxAttempts: 3,
        timeLeft: 60,
        totalTime: 60
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackQuestionsFromWords = (words: string[]): Question[] => {
    const questions: Question[] = [];
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const options = generateOptions(word);
      
      questions.push({
        id: i + 1,
        word: word,
        question: `What is the meaning of &quot;${word}&quot;?`,
        options: options,
        correctAnswer: word,
        explanation: `The correct answer is &quot;${word}&quot;`
      });
    }
    
    return questions;
  };

  interface QuizSettings {
    attempts?: number;
    timeLimit?: number;
    questionLimit?: number;

  }

  const generateAIQuestions = async (settings: QuizSettings, category: string | null) => {
    try {
      setIsLoading(true);
      toast.loading("Generating AI questions...", { id: "ai-loading" });
      
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category,
          settings: settings
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        setQuizState(prev => ({
          ...prev,
          maxAttempts: settings.attempts || 3,
          timeLeft: settings.timeLimit || 60,
          totalTime: settings.timeLimit || 60
        }));
        toast.success("AI questions generated successfully!", { id: "ai-loading" });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating AI questions:', error);
      toast.error("Failed to generate AI questions. Using fallback questions.", { id: "ai-loading" });
      
      // Use fallback questions
      const fallbackQuestions = generateFallbackQuestions(category, settings?.questionLimit || 10);
      setQuestions(fallbackQuestions);
      setQuizState(prev => ({
        ...prev,
        maxAttempts: settings.attempts || 3,
        timeLeft: settings.timeLimit || 60,
        totalTime: settings.timeLimit || 60
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackQuestions = (category: string | null, questionCount: number): Question[] => {
    const wordLists = {
      travel: ["itinerary", "accommodation", "destination", "sightseeing", "passport", "visa", "boarding", "departure", "arrival", "luggage"],
      friends: ["companionship", "loyalty", "trust", "bond", "friendship", "relationship", "connection", "support", "understanding", "care"],
      education: ["academic", "curriculum", "scholarship", "graduation", "lecture", "assignment", "research", "thesis", "semester", "faculty"],
      home: ["household", "furniture", "appliance", "maintenance", "renovation", "decoration", "comfort", "cozy", "spacious", "modern"],
      shopping: ["purchase", "discount", "bargain", "receipt", "refund", "exchange", "delivery", "payment", "brand", "quality"],
      health: ["wellness", "nutrition", "exercise", "medicine", "treatment", "recovery", "prevention", "symptoms", "diagnosis", "therapy"],
      work: ["profession", "career", "promotion", "colleague", "deadline", "meeting", "project", "responsibility", "achievement", "leadership"],
      general: ["vocabulary", "language", "communication", "expression", "knowledge", "learning", "practice", "improvement", "confidence", "success"]
    };
    
    const words = wordLists[category as keyof typeof wordLists] || wordLists.general;
    const questions: Question[] = [];
    
    for (let i = 0; i < Math.min(questionCount, words.length); i++) {
      const word = words[i];
      const options = generateOptions(word);
      
      questions.push({
        id: i + 1,
        word: word,
        question: `What is the meaning of "${word}"?`,
        options: options,
        correctAnswer: word,
        explanation: `The correct answer is "${word}"`
      });
    }
    
    return questions;
  };

  const generateOptions = (correctWord: string): string[] => {
    const allWords = [
      "accommodation", "achievement", "appliance", "assignment", "bargain", "boarding", "bond", "brand", "care", "career", "colleague", "comfort", "communication", "companionship", "confidence", "connection", "cozy", "curriculum", "deadline", "decoration", "delivery", "departure", "destination", "diagnosis", "discount", "exchange", "exercise", "expression", "faculty", "friendship", "furniture", "graduation", "household", "improvement", "itinerary", "knowledge", "language", "leadership", "learning", "lecture", "luggage", "loyalty", "maintenance", "medicine", "meeting", "modern", "nutrition", "passport", "payment", "practice", "prevention", "profession", "project", "promotion", "purchase", "quality", "receipt", "recovery", "refund", "relationship", "renovation", "research", "responsibility", "scholarship", "semester", "sightseeing", "spacious", "success", "support", "symptoms", "therapy", "thesis", "treatment", "trust", "understanding", "visa", "vocabulary", "wellness"
    ];
    
    const options = [correctWord];
    const filteredWords = allWords.filter(word => word !== correctWord);
    
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * filteredWords.length);
      options.push(filteredWords[randomIndex]);
      filteredWords.splice(randomIndex, 1);
    }
    
    return shuffleArray(options);
  };

  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswerSelect = (selectedAnswer: string) => {
    const currentQuestion = questions[quizState.currentQuestion];
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      // Correct answer
      toast.success("Correct! +5 points");
      setQuizState(prev => ({
        ...prev,
        score: prev.score + 5,
        showSentenceInput: true,
        currentCorrectAnswer: selectedAnswer
      }));
    } else {
      // Wrong answer
      toast.error("Incorrect! Option removed");
      setQuizState(prev => ({
        ...prev,
        attempts: prev.attempts + 1,
        usedOptions: [...prev.usedOptions, selectedAnswer]
      }));
      
      // Check if attempts exceeded
      if (quizState.attempts + 1 >= quizState.maxAttempts) {
        handleQuizComplete();
      }
    }
  };

  const handleSentenceSubmit = async () => {
    if (sentenceInput.trim()) {
      setIsSubmittingSentence(true);
      try {
        // Get AI analysis and enhancement
        const analysisResponse = await fetch('/api/analyze-sentence', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            word: quizState.currentCorrectAnswer,
            userSentence: sentenceInput.trim()
          }),
        });

        let aiEnhanced = "";
        let analysis = "";

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          aiEnhanced = analysisData.enhancedSentence || "";
          analysis = analysisData.analysis || "";
        }

        // Store user sentence with analysis
        const userSentence: UserSentence = {
          word: quizState.currentCorrectAnswer,
          userSentence: sentenceInput.trim(),
          aiEnhanced: aiEnhanced,
          analysis: analysis
        };

        toast.success("Great sentence! +3 points");
        setQuizState(prev => ({
          ...prev,
          sentencePoints: prev.sentencePoints + 3,
          showSentenceInput: false,
          userSentences: [...prev.userSentences, userSentence]
        }));
        setSentenceInput("");
        moveToNextQuestion(true);
      } catch (error) {
        console.error('Error analyzing sentence:', error);
        // Still award points even if analysis fails
        const userSentence: UserSentence = {
          word: quizState.currentCorrectAnswer,
          userSentence: sentenceInput.trim()
        };
        
        toast.success("Great sentence! +3 points");
        setQuizState(prev => ({
          ...prev,
          sentencePoints: prev.sentencePoints + 3,
          showSentenceInput: false,
          userSentences: [...prev.userSentences, userSentence]
        }));
        setSentenceInput("");
        moveToNextQuestion(true);
      } finally {
        setIsSubmittingSentence(false);
      }
    }
  };

  const handleSkipSentence = () => {
    setQuizState(prev => ({
      ...prev,
      showSentenceInput: false
    }));
    setSentenceInput("");
    moveToNextQuestion(false); // Don't reset attempts when skipping
  };

  const moveToNextQuestion = (resetAttempts: boolean = true) => {
    if (quizState.currentQuestion + 1 < questions.length) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        attempts: resetAttempts ? 0 : prev.attempts, // Only reset if specified
        usedOptions: []
      }));
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    const totalScore = quizState.score + quizState.sentencePoints;
    const isPassing = totalScore >= 50;
    
    if (isPassing) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    
    setQuizState(prev => ({
      ...prev,
      isComplete: true
    }));
  };

  const handleRestart = () => {
    router.push("/");
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return ((quizState.currentQuestion + 1) / questions.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4">
            <Loader2 className="w-12 h-12 text-white" />
          </div>
          <p className="text-white/80 text-lg">Generating your quiz...</p>
          <p className="text-white/60 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizState.isComplete) {
    const totalScore = quizState.score + quizState.sentencePoints;
    const isPassing = totalScore >= 50;
    
    return (
      <div className="min-h-screen relative">
        {showConfetti && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-8 mb-8">
              {isPassing ? (
                <div className="text-center mb-6">
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h1 className="text-4xl font-bold text-green-400 mb-4">Congratulations!</h1>
                  <p className="text-xl text-white/80 mb-6">
                    You&apos;ve successfully completed the quiz with an excellent score!
                  </p>
                </div>
              ) : (
                <div className="text-center mb-6">
                  <Star className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h1 className="text-4xl font-bold text-blue-400 mb-4">Great Job!</h1>
                  <p className="text-xl text-white/80 mb-6">
                    You&apos;re doing great! Keep practicing to improve your score.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
                  <h3 className="text-lg font-semibold text-blue-200 mb-2">Question Points</h3>
                  <p className="text-2xl font-bold text-blue-300">{quizState.score}</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                  <h3 className="text-lg font-semibold text-green-200 mb-2">Sentence Points</h3>
                  <p className="text-2xl font-bold text-green-300">{quizState.sentencePoints}</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6 mb-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-2">Total Score</h2>
                <p className={`text-4xl font-bold ${isPassing ? 'text-green-400' : 'text-blue-400'}`}>
                  {totalScore}
                </p>
                <p className="text-white/60 mt-2">
                  {isPassing ? "Excellent work!" : "Keep practicing!"}
                </p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-8 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Detailed Results</h2>
              
              {/* Questions Review */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Questions Review</h3>
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white">Question {index + 1}</h4>
                        <span className="text-green-400 font-medium">✓ Correct</span>
                      </div>
                      <p className="text-white/80 mb-2">{question.question}</p>
                      <div className="bg-green-500/20 rounded p-3 border border-green-400/30">
                        <p className="text-green-200 font-medium">Correct Answer: {question.correctAnswer}</p>
                        {question.explanation && (
                          <p className="text-green-100 text-sm mt-1">{question.explanation}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Sentences Review */}
              {quizState.userSentences.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Your Sentences</h3>
                  <div className="space-y-4">
                    {quizState.userSentences.map((sentence, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-white">Word: {sentence.word}</h4>
                          <span className="text-blue-400 font-medium">+3 points</span>
                        </div>
                        
                        {/* User's Original Sentence */}
                        <div className="mb-3">
                          <p className="text-white/60 text-sm mb-1">Your sentence:</p>
                          <p className="text-white bg-white/10 rounded p-2 border border-white/20">
                            &quot;{sentence.userSentence}&quot;
                          </p>
                        </div>

                        {/* AI Enhanced Version */}
                        {sentence.aiEnhanced && (
                          <div className="mb-3">
                            <p className="text-green-200 text-sm mb-1">AI Enhanced:</p>
                            <p className="text-green-100 bg-green-500/20 rounded p-2 border border-green-400/30">
                              &quot;{sentence.aiEnhanced}&quot;
                            </p>
                          </div>
                        )}

                        {/* AI Analysis */}
                        {sentence.analysis && (
                          <div>
                            <p className="text-blue-200 text-sm mb-1">Analysis:</p>
                            <p className="text-blue-100 bg-blue-500/20 rounded p-2 border border-blue-400/30 text-sm">
                              {sentence.analysis}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Restart Button */}
              <div className="text-center">
                <button
                  onClick={handleRestart}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Start New Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestion];
  const availableOptions = currentQuestion.options.filter(option => 
    !quizState.usedOptions.includes(option)
  );

  return (
    <div className="min-h-screen relative">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 rounded-lg p-2">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Time Remaining</p>
                  <p className={`text-2xl font-bold ${quizState.timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(quizState.timeLeft)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-white/60">Score</p>
                <p className="text-2xl font-bold text-green-400">{quizState.score + quizState.sentencePoints}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <p className="text-sm text-white/60 mt-2">
              Question {quizState.currentQuestion + 1} of {questions.length}
            </p>
          </div>

          {/* Question */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {currentQuestion.question}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-4 text-left bg-white/5 border border-white/10 rounded-lg hover:border-white/30 hover:bg-white/10 transition-all text-white"
                >
                  <span className="font-medium">{option}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-white/60">
                Attempts: {quizState.attempts}/{quizState.maxAttempts}
              </p>
            </div>
          </div>

          {/* Sentence Input Modal */}
          {quizState.showSentenceInput && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 max-w-md w-full">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Great job! Now write a sentence using &quot;{quizState.currentCorrectAnswer}&quot;
                </h3>
                <textarea
                  value={sentenceInput}
                  onChange={(e) => setSentenceInput(e.target.value)}
                  placeholder="Write your sentence here..."
                  className="w-full p-3 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/30 mb-4 resize-none text-white placeholder-white/40"
                  rows={3}
                />
                <div className="flex space-x-4">
                  <button
                    onClick={handleSentenceSubmit}
                    disabled={!sentenceInput.trim() || isSubmittingSentence}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSubmittingSentence ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit (+3 points)"
                    )}
                  </button>
                  <button
                    onClick={handleSkipSentence}
                    disabled={isSubmittingSentence}
                    className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/20"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 