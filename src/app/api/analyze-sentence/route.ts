import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function POST(request: NextRequest) {
  try {
    const { word, userSentence } = await request.json();

    const prompt = `Analyze this sentence that uses the word "${word}": "${userSentence}"

    Please provide:
    1. An enhanced version of the sentence (improve grammar, vocabulary, and IELTS-level English)
    2. A brief analysis of any mistakes or areas for improvement
    3. Suggestions for better usage of the word "${word}"

    Return the response in this exact JSON format:
    {
      "enhancedSentence": "The improved sentence with better grammar and vocabulary",
      "analysis": "Brief analysis of mistakes and suggestions for improvement"
    }

    Focus on IELTS-level English and help the user improve their vocabulary usage.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: "system",
          content: "You are an expert IELTS tutor. Analyze user sentences and provide helpful feedback to improve their English skills. Always return valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
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
      // Provide fallback analysis
      parsedResponse = {
        enhancedSentence: `Here's an improved version using "${word}": "I would like to demonstrate the proper usage of this word in a sentence."`,
        analysis: "Your sentence shows good effort! Consider using more complex sentence structures and IELTS-level vocabulary."
      };
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Error analyzing sentence:', error);
    
    // Return fallback analysis
    return NextResponse.json({
      enhancedSentence: "Here's an improved version with better grammar and vocabulary.",
      analysis: "Your sentence shows good effort! Keep practicing to improve your English skills."
    });
  }
} 