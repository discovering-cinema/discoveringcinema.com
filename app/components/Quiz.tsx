"use client";

import React, { useState, useRef } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

// ── Types ────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;          // zero-based index of the correct option
    explanation?: string;     // shown after answering
}

export interface QuizProps {
    questions: QuizQuestion[];
    title?: string;           // optional heading above the quiz
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const LETTER = ['A', 'B', 'C', 'D', 'E', 'F'];

function ScoreMessage({ score, total }: { score: number; total: number }) {
    const pct = score / total;
    if (pct === 1)    return <>Perfect score. Every question right.</>;
    if (pct >= 0.8)   return <>Strong result — {score} out of {total}.</>;
    if (pct >= 0.6)   return <>{score} out of {total}. Not bad.</>;
    if (pct >= 0.4)   return <>{score} out of {total}. Room to go again.</>;
    return <>{score} out of {total}. The article is still there.</>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Quiz({ questions, title }: QuizProps) {
    const [current, setCurrent] = useState(0);
    const [chosen, setChosen] = useState<number | null>(null);
    const [answers, setAnswers] = useState<(number | null)[]>(
        Array(questions.length).fill(null)
    );
    const [finished, setFinished] = useState(false);

    // Fires quiz_started only once — on first answer, not on render.
    const hasStarted = useRef(false);
    const quizTitle = title ?? 'quiz';

    const q = questions[current];
    const isAnswered = chosen !== null;
    const isCorrect  = chosen === q.correct;
    const score      = answers.filter((a, i) => a === questions[i].correct).length;

    function handleChoice(idx: number) {
        if (isAnswered) return;

        if (!hasStarted.current) {
            hasStarted.current = true;
            sendGAEvent('event', 'quiz_started', {
                quiz_title: quizTitle,
                total_questions: questions.length,
            });
        }

        const correct = idx === q.correct;
        sendGAEvent('event', 'quiz_question_answered', {
            quiz_title:       quizTitle,
            question_index:   current,           // 0-based, useful for funnel analysis
            question_number:  current + 1,        // 1-based, human-readable
            question_text:    q.question,
            answer_chosen:    q.options[idx],
            correct_answer:   q.options[q.correct],
            is_correct:       correct,
        });

        setChosen(idx);
        const next = [...answers];
        next[current] = idx;
        setAnswers(next);
    }

    function handleNext() {
        if (current < questions.length - 1) {
            setCurrent(current + 1);
            setChosen(answers[current + 1]);
        } else {
            // Calculate final score including the last answer
            const finalScore = answers.filter((a, i) => a === questions[i].correct).length;
            sendGAEvent('event', 'quiz_completed', {
                quiz_title:     quizTitle,
                score:          finalScore,
                total:          questions.length,
                score_percent:  Math.round((finalScore / questions.length) * 100),
            });
            setFinished(true);
        }
    }

    function handleRestart() {
        sendGAEvent('event', 'quiz_restarted', {
            quiz_title:    quizTitle,
            score:         score,
            total:         questions.length,
            score_percent: Math.round((score / questions.length) * 100),
        });
        hasStarted.current = false;
        setCurrent(0);
        setChosen(null);
        setAnswers(Array(questions.length).fill(null));
        setFinished(false);
    }

    const progress = finished
        ? 100
        : ((current + (isAnswered ? 1 : 0)) / questions.length) * 100;

    // ── Results screen ────────────────────────────────────────────────────────
    if (finished) {
        const pct = score / questions.length;
        const barColor = pct === 1 ? 'bg-emerald-400' : pct >= 0.6 ? 'bg-indigo-400' : 'bg-amber-400';

        return (
            <div className="my-8 rounded-2xl border border-slate-700 bg-slate-900 text-white overflow-hidden font-sans">
                {title && (
                    <div className="px-6 pt-5 pb-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
                    </div>
                )}

                {/* Progress bar — full */}
                <div className="h-1 w-full bg-slate-800 mt-4">
                    <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: '100%' }} />
                </div>

                <div className="p-6 md:p-8">
                    {/* Score */}
                    <div className="flex items-end gap-3 mb-2">
                        <span className="text-5xl font-black tabular-nums text-white leading-none">{score}</span>
                        <span className="text-slate-400 font-semibold text-lg leading-none mb-1">/ {questions.length}</span>
                    </div>

                    {/* Score bar */}
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                            style={{ width: `${(score / questions.length) * 100}%` }}
                        />
                    </div>

                    <p className="text-base text-slate-300 mb-8" aria-live="polite">
                        <ScoreMessage score={score} total={questions.length} />
                    </p>

                    {/* Answer review */}
                    <div className="space-y-3 mb-8">
                        {questions.map((q, i) => {
                            const userAnswer = answers[i];
                            const correct = userAnswer === q.correct;
                            return (
                                <div
                                    key={i}
                                    className={`rounded-xl px-4 py-3 border text-sm ${
                                        correct
                                            ? 'bg-emerald-400/10 border-emerald-400/30'
                                            : 'bg-rose-400/10 border-rose-400/30'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className={`text-base font-black leading-none mt-0.5 flex-shrink-0 ${correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {correct ? '✓' : '✕'}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-white leading-snug mb-1">{q.question}</p>
                                            {!correct && userAnswer !== null && (
                                                <p className="text-rose-300 text-xs mb-0.5">
                                                    You answered: {q.options[userAnswer]}
                                                </p>
                                            )}
                                            <p className={`text-xs font-semibold ${correct ? 'text-emerald-300' : 'text-slate-300'}`}>
                                                {correct ? '' : 'Correct: '}{q.options[q.correct]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleRestart}
                        className="w-full py-3 px-4 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-indigo-400 text-sm font-semibold text-slate-200 hover:text-white transition-all"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    // ── Question screen ───────────────────────────────────────────────────────
    return (
        <div className="my-8 rounded-2xl border border-slate-700 bg-slate-900 text-white overflow-hidden font-sans">
            {title && (
                <div className="px-6 pt-5 pb-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
                </div>
            )}

            {/* Progress bar */}
            <div className="h-1 w-full bg-slate-800 mt-4">
                <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-6 md:p-8">
                {/* Counter */}
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                    Question {current + 1} of {questions.length}
                </p>

                {/* Question */}
                <p className="text-lg font-bold text-white leading-snug mb-6">
                    {q.question}
                </p>

                {/* Options */}
                <div
                    className="space-y-2 mb-6"
                    role="radiogroup"
                    aria-label={q.question}
                >
                    {q.options.map((option, idx) => {
                        const isChosen  = chosen === idx;
                        const isRight   = idx === q.correct;

                        let optionStyle = 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500 hover:bg-slate-700 cursor-pointer';

                        if (isAnswered) {
                            if (isRight) {
                                optionStyle = 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200 cursor-default';
                            } else if (isChosen) {
                                optionStyle = 'border-rose-400/60 bg-rose-400/10 text-rose-200 cursor-default';
                            } else {
                                optionStyle = 'border-slate-800 bg-slate-800/50 text-slate-500 cursor-default';
                            }
                        }

                        return (
                            <button
                                key={idx}
                                role="radio"
                                aria-checked={isChosen}
                                disabled={isAnswered}
                                onClick={() => handleChoice(idx)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all text-sm font-medium ${optionStyle}`}
                            >
                                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${
                                    isAnswered && isRight
                                        ? 'border-emerald-400 text-emerald-400'
                                        : isAnswered && isChosen && !isRight
                                        ? 'border-rose-400 text-rose-400'
                                        : isAnswered
                                        ? 'border-slate-700 text-slate-600'
                                        : 'border-slate-600 text-slate-400'
                                }`}>
                                    {isAnswered && isRight ? '✓' : isAnswered && isChosen ? '✕' : LETTER[idx]}
                                </span>
                                {option}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {isAnswered && q.explanation && (
                    <div
                        className={`rounded-xl px-4 py-3 border mb-6 text-sm leading-relaxed ${
                            isCorrect
                                ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-200'
                                : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                        aria-live="polite"
                    >
                        {!isCorrect && (
                            <span className="font-bold text-white block mb-1">
                                The correct answer was: {q.options[q.correct]}
                            </span>
                        )}
                        {q.explanation}
                    </div>
                )}

                {/* Feedback line when no explanation */}
                {isAnswered && !q.explanation && (
                    <p
                        className={`text-sm font-semibold mb-6 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}
                        aria-live="polite"
                    >
                        {isCorrect ? 'Correct.' : `Incorrect. The answer was: ${q.options[q.correct]}`}
                    </p>
                )}

                {/* Next / Finish */}
                {isAnswered && (
                    <button
                        onClick={handleNext}
                        className="w-full py-3 px-4 rounded-xl border border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-indigo-400 text-sm font-semibold text-slate-200 hover:text-white transition-all"
                    >
                        {current < questions.length - 1 ? 'Next question' : 'See results'}
                    </button>
                )}
            </div>
        </div>
    );
}