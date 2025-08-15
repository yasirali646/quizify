import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function POST(request: NextRequest) {
  try {
    const { category, settings, words, mode } = await request.json();

    if (mode === "manual") {
      // Generate questions based on user-provided words
      const questionCount = words.length;
      const prompt = `Generate ${questionCount} IELTS vocabulary quiz questions based on these specific words: ${words.join(', ')} for the category "${category}".

      Requirements:
      - Create questions that test understanding of each word
      - Each question should have 4 multiple choice options (A, B, C, D)
      - Include the correct answer
      - Make questions appropriate for IELTS vocabulary level
      - Focus on the specific words provided by the user
      - Questions can be about definitions, synonyms, usage, or context

      Return the response in this exact JSON format:
      {
        "questions": [
          {
            "id": 1,
            "word": "example_word",
            "question": "What is the meaning of 'example_word'?",
            "options": ["option A", "option B", "option C", "option D"],
            "correctAnswer": "option A",
            "explanation": "Brief explanation of the correct answer"
          }
        ]
      }

      Words: ${words.join(', ')}
      Category: ${category}`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: "system",
            content: "You are an expert IELTS vocabulary tutor. Generate high-quality vocabulary questions based on specific words provided by the user. Always return valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No response from OpenAI');
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response);
      } catch (error) {
        console.error('Failed to parse OpenAI response:', error);
        parsedResponse = generateFallbackQuestionsFromWords(words, category);
      }

      return NextResponse.json(parsedResponse);
    } else {
      
      // Original AI mode logic
      const questionCount = settings.questionLimit || 10;
      const difficultyLevel = settings.difficultyLevel || 'medium';
      const questionType = settings.questionType || 'multiple-choice';

      const prompt = `Generate ${questionCount} IELTS vocabulary quiz questions for the category "${category}" with ${difficultyLevel} difficulty level.

      Requirements:
      - Question type: ${questionType}
      - Each question should have 4 multiple choice options (A, B, C, D)
      - Include the correct answer
      - Make questions appropriate for IELTS vocabulary level
      - Focus on words commonly used in ${category} context

      Return the response in this exact JSON format:
      {
        "questions": [
          {
            "id": 1,
            "word": "example_word",
            "question": "What is the meaning of 'example_word'?",
            "options": ["option A", "option B", "option C", "option D"],
            "correctAnswer": "option A",
            "explanation": "Brief explanation of the correct answer"
          }
        ]
      }

      Category: ${category}
      Difficulty: ${difficultyLevel}
      Question Type: ${questionType}`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENROUTER_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: "system",
            content: "You are an expert IELTS vocabulary tutor. Generate high-quality vocabulary questions that help students prepare for the IELTS exam. Always return valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No response from OpenAI');
      }

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response);
      } catch (error) {
        console.error('Failed to parse OpenAI response:', error);
        parsedResponse = generateFallbackQuestions(category, questionCount);
      }

      return NextResponse.json(parsedResponse);
    }

  } catch (error) {
    console.error('Error generating questions:', error);

    const { category, settings, words, mode } = await request.json();
    
    if (mode === "manual") {
      const fallbackQuestions = generateFallbackQuestionsFromWords(words, category);
      return NextResponse.json({ questions: fallbackQuestions });
    } else {
      const fallbackQuestions = generateFallbackQuestions(category, settings?.questionLimit || 10);
      return NextResponse.json({ questions: fallbackQuestions });
    }
  }
}

function generateFallbackQuestionsFromWords(words: string[], category: string) {
  const questions: {
    id: number;
    word: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[] = [];
  
  for (let i = 0; i < words.length; i++) {
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
}

function generateFallbackQuestions(category: string, questionCount: number) {
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
  const questions: {
    id: number;
    word: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[] = [];
  
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
}

function generateOptions(correctWord: string): string[] {
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
}

function shuffleArray(array: string[]): string[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
} 