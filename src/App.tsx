/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  RefreshCcw, 
  MessageCircle, 
  Trophy, 
  Quote, 
  Home,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  Smile,
  Zap
} from 'lucide-react';
import { cn } from './lib/utils.ts';

// --- Types ---
type GameState = 'landing' | 'quiz' | 'quotes' | 'result';

interface Question {
  id: number;
  scenario: string; // Roman Urdu
  scenarioUrdu: string; // Urdu script
  options: {
    text: string;
    textUrdu: string;
    isCorrect: boolean; // "Correct" here means "Most typical Mom reaction"
    explanation: string;
  }[];
}

// --- Data ---
const QUESTIONS: Question[] = [
  {
    id: 1,
    scenario: "Mummy, where are my socks?",
    scenarioUrdu: "امی، میری جرابیں کہاں ہیں؟",
    options: [
      { 
        text: "Check in the drawer.", 
        textUrdu: "دراز میں دیکھو۔", 
        isCorrect: false,
        explanation: "Too simple! Real moms have a superpower."
      },
      { 
        text: "If I find them, then...?", 
        textUrdu: "اگر میں نے ڈھونڈ لیں، تو پھر؟", 
        isCorrect: true,
        explanation: "The ultimate Mom threat! And she always finds them."
      },
      { 
        text: "Buy new ones.", 
        textUrdu: "نئی خرید لو۔", 
        isCorrect: false,
        explanation: "Moms never give up on the lost pair!"
      }
    ]
  },
  {
    id: 2,
    scenario: "Breaking a glass in the kitchen...",
    scenarioUrdu: "کچن میں گلاس ٹوٹ گیا۔۔۔",
    options: [
      { 
        text: "Are you hurt?", 
        textUrdu: "چوٹ تو نہیں لگی؟", 
        isCorrect: false,
        explanation: "Maybe later, but first..."
      },
      { 
        text: "Break the whole house!", 
        textUrdu: "سارا گھر توڑ دو!", 
        isCorrect: true,
        explanation: "Typical! If one thing breaks, the whole house is next in line."
      },
      { 
        text: "I will clean it.", 
        textUrdu: "میں صاف کر دوں گی۔", 
        isCorrect: false,
        explanation: "Only after the lecture!"
      }
    ]
  },
  {
    id: 3,
    scenario: "Asking for a new phone while the old one is fine.",
    scenarioUrdu: "نئے فون کی فرمائش جبکہ پرانا ٹھیک ہے۔",
    options: [
      { 
        text: "Set it on fire!", 
        textUrdu: "اس کو آگ لگا دو!", 
        isCorrect: true,
        explanation: "According to Moms, the old phone is the root of all evil."
      },
      { 
        text: "Next year.", 
        textUrdu: "اگلے سال۔", 
        isCorrect: false,
        explanation: "That's Dad's line."
      },
      { 
        text: "Okay, let's go buy it.", 
        textUrdu: "چلو ابھی لے لیتے ہیں۔", 
        isCorrect: false,
        explanation: "In our dreams!"
      }
    ]
  },
  {
    id: 4,
    scenario: "When you come home late...",
    scenarioUrdu: "جب آپ دیر سے گھر آئیں۔۔۔",
    options: [
      { 
        text: "Dinner is in the fridge.", 
        textUrdu: "کھانا فریج میں ہے۔", 
        isCorrect: false,
        explanation: "Possible, but not without the 'Look'."
      },
      { 
        text: "Now come home in the morning!", 
        textUrdu: "بس اب صبح ہی آنا!", 
        isCorrect: true,
        explanation: "The classic welcome speech."
      },
      { 
        text: "Welcome home!", 
        textUrdu: "خوش آمدید!", 
        isCorrect: false,
        explanation: "Are we in a movie?"
      }
    ]
  }
];

const MOM_QUOTES = [
  { urdu: "سو جاؤ اب، ساری رات موبائل چلانا ہے۔", roman: "So jao ab, sari raat mobile chalana hai." },
  { urdu: "جب میں چھوٹی تھی تو۔۔۔", roman: "Jab mein chhoti thi toh..." },
  { urdu: "پیسے کیا درخت پر اگتے ہیں؟", roman: "Paise kya darakht par ugtay hain?" },
  { urdu: "آئی بڑی عقل مند!", roman: "Aai bari aqal mand!" },
  { urdu: "کھانا تیار ہے! (جبکہ ابھی پیاز کٹ رہے ہوں)", roman: "Khana tayyar hai! (When onions are still being cut)" },
  { urdu: "سب ٹھیک ہو جائے گا، بس موبائل چھوڑ دو۔", roman: "Sab theek ho jaye ga, bas mobile chhor do." },
  { urdu: "تمہارے لیے تو میں نوکرانی لگی ہوئی ہوں۔", roman: "Tumhare liye toh mein naukrani lagi hui hoon." }
];

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  className, 
  variant = 'primary' 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}) => {
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand/90 shadow-lg active:scale-95 rounded-[40px]',
    secondary: 'bg-text-main text-white hover:bg-text-main/90 shadow-lg active:scale-95 rounded-[40px]',
    outline: 'border-2 border-brand text-brand hover:bg-brand-soft bg-transparent active:scale-95 rounded-[40px]',
    ghost: 'text-text-main hover:bg-brand-soft bg-transparent rounded-[40px]'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'px-6 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [score, setScore] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);

  const startQuiz = () => {
    setScore(0);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setGameState('quiz');
  };

  const startQuotes = () => {
    setCurrentQuoteIdx(Math.floor(Math.random() * MOM_QUOTES.length));
    setGameState('quotes');
  };

  const handleOptionSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    if (QUESTIONS[currentQuestionIdx].options[idx].isCorrect) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(c => c + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setGameState('result');
    }
  };

  const getRandomQuote = () => {
    const newIdx = Math.floor(Math.random() * MOM_QUOTES.length);
    setCurrentQuoteIdx(newIdx);
  };

  return (
    <div className="min-h-screen bg-surface text-text-main font-sans selection:bg-brand/30 overflow-hidden flex flex-col">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <Heart className="absolute -top-10 -left-10 w-64 h-64 rotate-12 text-brand" />
        <Smile className="absolute bottom-10 -right-10 w-48 h-48 -rotate-12 text-text-main" />
        <Quote className="absolute top-1/2 left-1/4 w-32 h-32 opacity-20" />
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          
          {/* Landing State */}
          {gameState === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center max-w-2xl"
            >
              <div className="mb-8 flex justify-center">
                <div className="relative rotate-3">
                  <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full" />
                  <Heart className="w-24 h-24 text-brand fill-brand animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter text-balance font-display">
                Mummy's Logic
              </h1>
              <p className="text-3xl mb-8 font-medium urdu-font text-brand" dir="rtl">
                ماؤں کے عالمی دن پر ایک مزیدار گیم!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={startQuiz} className="text-lg py-4">
                  <Zap className="w-5 h-5 fill-current" />
                  Start Quiz
                </Button>
                <Button onClick={startQuotes} variant="secondary" className="text-lg py-4">
                  <Quote className="w-5 h-5" />
                  Daily Mom Quotes
                </Button>
              </div>

              <p className="mt-12 text-[#2D4263]/60 font-mono text-sm uppercase tracking-widest">
                Happy Mother's Day 2024
              </p>
            </motion.div>
          )}

          {/* Quiz State */}
          {gameState === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-xl"
            >
              <div className="bg-white p-8 rounded-[40px] shadow-xl border-4 border-brand lg:rotate-1">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b-2 border-dashed border-brand-light pb-4">
                  <span className="font-bold text-sm bg-brand-soft px-3 py-1 rounded-full text-brand">
                    QUESTION {currentQuestionIdx + 1} / {QUESTIONS.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-lg">{score}</span>
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-widest text-muted-foreground mb-1 opacity-60 font-bold">Scenario:</p>
                  <h2 className="text-2xl font-bold leading-tight mb-4">{QUESTIONS[currentQuestionIdx].scenario}</h2>
                  <p className="text-4xl font-bold text-right text-brand mb-6 urdu-font" dir="rtl">
                    {QUESTIONS[currentQuestionIdx].scenarioUrdu}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  {QUESTIONS[currentQuestionIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={showFeedback}
                      onClick={() => handleOptionSelect(i)}
                      className={cn(
                        "w-full text-left p-4 rounded-3xl border-2 transition-all flex flex-col items-end gap-1 relative overflow-hidden group",
                        selectedOption === null 
                          ? "border-brand-soft hover:border-brand hover:bg-brand-soft/50 cursor-pointer" 
                          : selectedOption === i
                            ? opt.isCorrect 
                              ? "border-green-500 bg-green-50 ring-2 ring-green-500/20" 
                              : "border-red-500 bg-red-50 ring-2 ring-red-500/20"
                            : opt.isCorrect && showFeedback
                              ? "border-green-200 bg-green-50/50"
                              : "border-gray-100 opacity-50"
                      )}
                    >
                      <span className="text-xs font-mono uppercase opacity-40 group-hover:opacity-100 transition-opacity">Option {i + 1}</span>
                      <span className="text-lg font-semibold">{opt.text}</span>
                      <span className="text-2xl font-bold urdu-font" dir="rtl">{opt.textUrdu}</span>
                      
                      {showFeedback && selectedOption === i && (
                        <div className="absolute right-2 top-2">
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Feedback & Next */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-8 pt-6 border-t"
                    >
                      <p className="text-sm font-medium mb-4 italic text-[#2D4263]/70">
                        {QUESTIONS[currentQuestionIdx].options[selectedOption!].explanation}
                      </p>
                      <Button onClick={nextQuestion} className="w-full">
                        {currentQuestionIdx === QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Quotes State */}
          {gameState === 'quotes' && (
            <motion.div
              key="quotes"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-xl text-center"
            >
              <div className="bg-white p-12 rounded-[40px] shadow-2xl relative overflow-hidden border-4 border-brand -rotate-2">
                <Quote className="absolute -top-6 -left-6 w-32 h-32 text-brand-soft -z-10" />
                
                <h2 className="text-3xl font-bold mb-12 flex items-center justify-center gap-3 font-display">
                  <MessageCircle className="text-brand" />
                  Mummy Says...
                </h2>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuoteIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="min-h-[160px] flex flex-col justify-center gap-6"
                  >
                    <p className="text-4xl md:text-5xl font-bold text-brand leading-relaxed urdu-font" dir="rtl">
                      "{MOM_QUOTES[currentQuoteIdx].urdu}"
                    </p>
                    <p className="text-xl italic text-text-main/60 font-medium">
                      {MOM_QUOTES[currentQuoteIdx].roman}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={getRandomQuote} variant="outline">
                    <RefreshCcw className="w-5 h-5" />
                    Another Quote
                  </Button>
                  <Button onClick={() => setGameState('landing')} variant="ghost">
                    <Home className="w-5 h-5" />
                    Main Menu
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Result State */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-lg"
            >
              <div className="bg-white p-12 rounded-[40px] shadow-2xl relative border-4 border-brand">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                   <div className="bg-brand p-6 rounded-full shadow-lg ring-8 ring-white">
                      <Trophy className="w-16 h-16 text-white" />
                   </div>
                </div>
                
                <h2 className="text-4xl font-bold mt-8 mb-2 font-display">Quiz Complete!</h2>
                <p className="text-lg opacity-60 mb-8 font-medium">Your Mom-o-Meter Score</p>
                
                <div className="text-7xl font-black text-brand mb-8 tabular-nums">
                  {Math.round((score / QUESTIONS.length) * 100)}%
                </div>

                <div className="p-6 bg-brand-soft rounded-3xl mb-8 border-2 border-dashed border-brand">
                  <p className="text-xl font-bold mb-2 urdu-font text-brand" dir="rtl">
                    {score === QUESTIONS.length ? "آپ ایک سچے دیسی بچے ہیں!" : 
                     score >= 2 ? "آپ کو امی کی باتیں سمجھ آتی ہیں!" : "تھوڑی اور ڈانٹ کی ضرورت ہے!"}
                  </p>
                  <p className="opacity-70 leading-relaxed italic font-medium">
                    {score === QUESTIONS.length 
                      ? "You can interpret every 'Hmm' and Flying Chappal accurately." 
                      : "You're still learning the secret language of Urdu Mothers."}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button onClick={startQuiz} className="w-full">
                    <RefreshCcw className="w-5 h-5" />
                    Try Again
                  </Button>
                  <Button onClick={() => setGameState('landing')} variant="ghost" className="w-full">
                    <Home className="w-5 h-5" />
                    Back to Home
                  </Button>
                </div>
                
                <div className="mt-12 pt-8 border-t flex flex-col items-center gap-4">
                  <p className="text-sm font-bold uppercase tracking-tighter opacity-40">Share with Mummy</p>
                  <div className="flex gap-4">
                    <ThumbsUp className="w-6 h-6 text-[#2D4263]/20" />
                    <Smile className="w-6 h-6 text-[#2D4263]/20" />
                    <Heart className="w-6 h-6 text-[#2D4263]/20 fill-current" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-xs font-mono uppercase tracking-[0.2em] opacity-40">
        &copy; 2024 Mummy's Logic &bull; Made with Love
      </footer>
    </div>
  );
}
