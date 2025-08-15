# 📌 Quizify - IELTS Vocabulary Quiz

A modern, interactive IELTS vocabulary quiz application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Category Selection**: Choose from 8 different vocabulary categories
- **Two Quiz Modes**: Manual word entry or AI-generated questions
- **Advanced Settings**: Customize difficulty, time limits, and question types
- **Real-time Scoring**: Get points for correct answers and sentence writing
- **Timer Functionality**: Automatic quiz completion when time runs out
- **Interactive Feedback**: Toast notifications and progress tracking
- **Beautiful UI**: Modern design with animations and confetti celebrations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenRouter API key (for AI-generated questions)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yasirali646/quizify
cd quizify
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

4. Get your OpenRouter API key:
- Visit [OpenRouter Platform](https://openrouter.ai/settings/keys)
- Create a new API key
- Rename the `example.env.local` to `.env.local` file

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Breakdown

### 1. Category Selection
- Travel & Holidays
- Friends & Relationships  
- Education
- Home & Family
- Shopping & Consumerism
- Health & Fitness
- Work & Career
- General Vocabulary

### 2. Quiz Modes

#### Manual Mode
- Enter your own vocabulary words
- Full control over quiz content
- Perfect for targeted practice

#### AI Mode
- AI-generated questions using OpenRouter API
- Advanced settings configuration
- Fallback to pre-built questions if AI fails

### 3. Advanced Settings

#### Basic Settings
- Question Limit: 10, 20, or 30 questions
- Difficulty Level: Easy, Medium, Hard
- Attempts: 1, 2, or 3 chances per question

#### Advanced Settings
- Question Type: Multiple Choice or True & False
- Time Limit: 30 seconds, 1 minute, or 5 minutes

### 4. Quiz Features

- **Timer**: Automatic quiz completion when time expires
- **Wrong Answer Handling**: Incorrect options are removed with toast notifications
- **Sentence Writing**: Bonus points for writing sentences with correct words
- **Scoring System**: 5 points for correct answers, 3 points for sentences
- **Results**: Congratulations with confetti for 50+ scores

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Confetti**: React Confetti
- **AI Integration**: OpenRouter API

## Project Structure

```
src/
├── app/
│   ├── api/
|   |   └── analyze-sentence/
│   │   └── generate-questions/     # OpenAI API integration
│   ├── ai/                         # AI settings page
│   ├── manual/                     # Manual word entry page
│   ├── mode/                       # Mode selection page
│   ├── quiz/                       # Main quiz page
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── components/
│   ├── Navbar.tsx                  # Navigation component
│   └── Footer.tsx                  # Footer component
```

## API Integration

The application uses OpenAI's gpt-oss-20b model to generate contextual vocabulary questions based on:
- Selected category
- Difficulty level
- Question type
- Number of questions

If the AI service is unavailable, the app gracefully falls back to pre-built question sets.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub.
