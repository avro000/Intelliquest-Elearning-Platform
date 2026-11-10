import { useState, useEffect, useMemo, useRef } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { Clock, GraduationCapIcon, HelpCircle, RotateCcw, ChevronLeft, ChevronRight, LayoutGrid, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { Badge } from "../components/ui/badge"
import QuizResults from "./quiz-results"
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub?: string;
}

interface Option {
    id: string
    text: string
}

interface Question {
    id: string
    question: string
    correctOptionId?: string
    marksForCorrect: number
    marksForIncorrect: number
    options: Option[]
}

interface Quiz {
    id: number
    title: string
    playingTime: number
    instructorId: number
    instructorName: string
    instructorEmail: string
    level: string
    category: string
    thumbnailUrl: string
    questions: Question[]
}

export default function TestInterface() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>()
    const sub = useMemo(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
                return decoded.sub || null;
            } catch {
                return null;
            }
        }
        return null;
    }, []);
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [skippedQuestions, setSkippedQuestions] = useState<string[]>([])
    const [timeLeft, setTimeLeft] = useState(0)
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(true)
    const [resultData, setResultData] = useState<{
        totalMarks: number;
        marksAchieved: number;
        correctAnswers: number;
        wrongAnswers: number;
        totalQuestions: number;
        attemptedQuestions: number;
    } | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [paletteOpen, setPaletteOpen] = useState(false);
    const mobileSliderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mobileSliderRef.current && mobileSliderRef.current.children[currentQuestionIndex]) {
            const activeEl = mobileSliderRef.current.children[currentQuestionIndex] as HTMLElement;
            activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }, [currentQuestionIndex]);


    useEffect(() => {
        if (!id) return

        setLoading(true)
        axios
            .get(`http://localhost:9092/auth/get-quiz/${id}`)
            .then((res) => {
                const quizData: Quiz = res.data
                setQuiz(quizData)
                setTimeLeft(quizData.playingTime)
                setCurrentQuestionIndex(0)
                setAnswers({})
                setSkippedQuestions([])
                setProgress(0)
            })
            .catch(() => {
                toast.error(`No quiz found with id: ${id}`)
            })
            .finally(() => setLoading(false))
    }, [id])

    useEffect(() => {

        if (timeLeft <= 0 || isSubmitted) return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    toast("Time's up!", {
                        description: "Your test has been submitted automatically.",
                        style: {
                            background: "green",
                            border: "green",
                        },
                    })
                    handleFinishTest()
                    setIsSubmitted(true);
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, isSubmitted])

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-3xl space-y-6">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-32 rounded-md" />
                        <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-full" />
                    <div className="rounded-2xl border border-border p-8 bg-card shadow-lg space-y-6">
                        <Skeleton className="h-8 w-4/5 rounded-lg" />
                        <div className="space-y-4 pt-2">
                            <Skeleton className="h-14 w-full rounded-xl" />
                            <Skeleton className="h-14 w-full rounded-xl" />
                            <Skeleton className="h-14 w-full rounded-xl" />
                            <Skeleton className="h-14 w-full rounded-xl" />
                        </div>
                        <div className="flex justify-between pt-4">
                            <Skeleton className="h-10 w-24 rounded-xl" />
                            <Skeleton className="h-10 w-28 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    if (!quiz) return <div className="p-10 text-center text-red-600">Quiz not found.</div>
    if (!quiz.questions || quiz.questions.length === 0)
        return <div className="p-10 text-center">No questions available for this quiz.</div>

    const currentQuestion = quiz.questions[currentQuestionIndex]

    const handleAnswerChange = (value: string) => {
        setAnswers((prev) => {
            const newAnswers = {
                ...prev,
                [currentQuestion.id]: value,
            }

            if (skippedQuestions.includes(currentQuestion.id)) {
                setSkippedQuestions((prevSkipped) => prevSkipped.filter((q) => q !== currentQuestion.id))
            }

            const answeredCount = Object.keys(newAnswers).length
            setProgress(Math.round((answeredCount / quiz.questions.length) * 100))

            return newAnswers
        })
    }

    const handleClearAnswer = () => {
        setAnswers((prev) => {
            const newAnswers = { ...prev }
            delete newAnswers[currentQuestion.id]

            const answeredCount = Object.keys(newAnswers).length
            setProgress(Math.round((answeredCount / quiz.questions.length) * 100))

            return newAnswers
        })
    }

    const handleSkip = () => {
        if (!skippedQuestions.includes(currentQuestion.id)) {
            setSkippedQuestions((prev) => [...prev, currentQuestion.id])
        }

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
        }
    }

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }

    const handleFinishTest = async () => {
        if (isSubmitted) return;

        let correct = 0;
        let wrong = 0;
        let score = 0;

        quiz.questions.forEach((q) => {
            const userAnswer = answers[q.id];
            if (userAnswer === q.correctOptionId) {
                correct++;
                score += q.marksForCorrect;
            } else if (userAnswer && userAnswer !== q.correctOptionId) {
                wrong++;
                score += q.marksForIncorrect;
            }
        });

        const totalMarks = quiz.questions.reduce((sum, q) => sum + (q.marksForCorrect || 1), 0);
        const totalQuestions = quiz.questions.length;
        const attemptedQuestions = Object.keys(answers).length;

        const submittedData = {
            quizId: quiz.id,
            sub: sub,
            totalMarks,
            marksAchieved: score,
            correctAnswers: correct,
            wrongAnswers: wrong,
            totalQuestions,
            attemptedQuestions,
            selectedAnswers: answers,
        };

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:9092/auth/submit-quiz", submittedData, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            const finalResult = response.data && typeof response.data === 'object' && response.data.totalQuestions 
                ? response.data 
                : submittedData;
            setResultData(finalResult);

            toast.success("Test Submitted!", {
                description: `You answered ${attemptedQuestions} out of ${totalQuestions} questions.`,
                style: {
                    background: "green",
                    border: "green",
                },
            });
            setIsSubmitted(true);
            setShowResults(true);
        } catch (error: any) {
            toast.error("Failed to submit test result", {
                description: error.response?.data?.error || error.response?.data || "Something went wrong!",
            });
        }
    };

    const handleQuestionNavigation = (index: number) => {
        setCurrentQuestionIndex(index)
    }

    if (showResults && resultData && quiz) {
        return (
            <QuizResults
                totalMarks={resultData.totalMarks}
                marksAchieved={resultData.marksAchieved}
                correctAnswers={resultData.correctAnswers}
                wrongAnswers={resultData.wrongAnswers}
                quizTitle={quiz.title}
                totalQuestions={resultData.totalQuestions}
                attemptedQuestions={resultData.attemptedQuestions}
                onGoToHome={() => navigate("/quiz-list")}
                onRetryQuiz={() => window.location.reload()}
            />
        );
    }

    const answeredCount = Object.keys(answers).length;
    const skippedCount = skippedQuestions.filter((qid) => !answers[qid]).length;
    const unvisitedCount = quiz.questions.length - answeredCount - skippedCount;

    return (
        <div className="w-full min-h-screen lg:h-screen lg:overflow-hidden bg-background text-foreground">
            {/* ========================================================================= */}
            {/* DESKTOP VIEW (100% UNTOUCHED LAYOUT)                                      */}
            {/* ========================================================================= */}
            <div className="hidden lg:flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="border-b shrink-0">
                    <div className="container mx-auto px-6 flex items-center justify-between py-5">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold">
                                <div className="flex justify-center items-center">
                                    <div className="bg-[oklch(0.488_0.243_264.376)] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg mr-2">
                                        <GraduationCapIcon className="size-4" />
                                    </div>
                                    <span className="text-foreground">
                                        Intelliquest<span className="text-blue-500 text-3xl">.</span>
                                    </span>
                                </div>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                className="border border-red-500 text-red-500 hover:text-red-500 px-6 py-2"
                                onClick={handleFinishTest}
                            >
                                <span className="mr-2">■</span> FINISH TEST
                            </Button>
                            <div className="flex items-center gap-2">
                                <Progress value={progress} className="w-16 h-4" />
                                <span className="text-sm font-medium">{progress}%</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                                <Clock className="h-5 w-5" />
                                <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <div className="container px-6 flex flex-1 gap-8 py-6 overflow-hidden">
                    {/* Question area */}
                    <div className="flex-1 !max-w-[920px] overflow-y-auto scrollbar-hidden">
                        <h2 className="text-3xl font-bold mb-8">
                            Q{currentQuestionIndex + 1}: {currentQuestion.question}
                        </h2>

                        <RadioGroup
                            value={answers[currentQuestion.id] || ""}
                            onValueChange={handleAnswerChange}
                            className="space-y-3"
                        >
                            {currentQuestion.options.map((option) => (
                                <div
                                    key={option.id}
                                    className={`flex items-center border rounded-lg p-4 transition-colors cursor-pointer ${answers[currentQuestion.id] === option.id
                                        ? "bg-background border-blue-500"
                                        : "hover:bg-muted"
                                        }`}
                                    onClick={() => handleAnswerChange(option.id)}
                                >
                                    <RadioGroupItem
                                        value={option.id}
                                        id={`option-${option.id}`}
                                        className="mr-4 h-4 w-4 rounded-full border border-gray-400 data-[state=checked]:bg-background"
                                    />
                                    <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer text-base break-words">
                                        {option.text}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        <div className="flex gap-4 mt-8">
                            <Button
                                variant="outline"
                                className="px-6 py-5"
                                onClick={handleClearAnswer}
                                disabled={!answers[currentQuestion.id]}
                            >
                                <RotateCcw /> CLEAR ANSWER
                            </Button>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-10 w-10 p-5">
                                            <HelpCircle className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Need help with the test?</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* Navigation sidebar */}
                    <div className="w-106 border-l shrink-0 overflow-y-auto max-h-full scrollbar-hidden">
                        <div className="py-5 pl-8">
                            <h3 className="text-lg font-semibold">
                                {quiz.title} - {quiz.category}/{quiz.level}
                            </h3>
                            <div className="mb-5">
                                <span className="text-muted-foreground mr-1">by -</span> <Badge className="bg-cyan-500 text-foreground">{quiz.instructorName}</Badge> | <Badge>{quiz.instructorEmail}</Badge>
                            </div>
                            <div className="grid grid-cols-7 gap-3 justify-items-center">
                                {quiz.questions.map((q, i) => {
                                    const answered = answers[q.id] !== undefined
                                    const skipped = skippedQuestions.includes(q.id)
                                    const isCurrent = i === currentQuestionIndex
                                    return (
                                        <Button
                                            key={q.id}
                                            variant="outline"
                                            className={`h-10 w-10 p-0 text-sm font-medium transition-all ${isCurrent
                                                ? skipped
                                                    ? "bg-red-500 text-foreground ring-2 ring-red-300 ring-offset-1 hover:bg-red-800"
                                                    : answered
                                                        ? "bg-blue-600 text-foreground hover:bg-blue-700 ring-2 ring-blue-300 ring-offset-1"
                                                        : "bg-muted text-foreground ring-2 ring-foreground ring-offset-1"
                                                : answered
                                                    ? "bg-blue-600 text-foreground hover:bg-blue-700"
                                                    : skipped
                                                        ? "bg-red-500 text-foreground hover:bg-red-800"
                                                        : "hover:bg-muted"
                                                }`}
                                            onClick={() => handleQuestionNavigation(i)}
                                        >
                                            {i + 1}
                                        </Button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-5 pl-8">
                            <div className="w-4 h-4 rounded-sm bg-red-500"></div>
                            <span className="text-sm text-muted-foreground">Skipped Question</span>
                        </div>

                        <div className="text-sm text-center ml-8 my-5 py-4 bg-gray-100 rounded-lg">
                            <span className="text-green-600 font-medium">Correct answer: +{quiz.questions[currentQuestionIndex]?.marksForCorrect ?? 0}</span>
                            <span className="mx-3 text-gray-400">|</span>
                            <span className="text-red-600 font-medium">Wrong answer: {quiz.questions[currentQuestionIndex]?.marksForIncorrect ?? 0}</span>
                        </div>

                        <div className="flex gap-3 py-5 pl-8">
                            <Button
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                PREVIOUS
                            </Button>
                            <Button variant="outline" className="flex-1 py-3" onClick={handleSkip} disabled={!!answers[currentQuestion.id]}>
                                SKIP
                            </Button>
                            {currentQuestionIndex === quiz.questions.length - 1 ? (
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                                    onClick={handleFinishTest}
                                >
                                    SUBMIT
                                </Button>
                            ) : (
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                                    onClick={handleNext}
                                >
                                    NEXT
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* MOBILE VIEW (Exclusively for mobile - fits standard MCQ test apps UX)    */}
            {/* ========================================================================= */}
            <div className="lg:hidden flex flex-col min-h-screen bg-background text-foreground pb-20">
                {/* 1. Mobile Fixed Top Navigation Bar */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b px-3.5 py-2.5 h-14 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                        <div className="bg-primary/10 text-primary p-1.5 rounded-lg shrink-0">
                            <GraduationCapIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xs font-bold text-foreground truncate leading-tight">
                                {quiz.title}
                            </h2>
                            <p className="text-[10px] text-muted-foreground truncate">
                                {quiz.category} • {quiz.level}
                            </p>
                        </div>
                    </div>

                    {/* Timer Chip */}
                    <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono font-bold text-xs shrink-0 ${
                            timeLeft < 60
                                ? "bg-red-500/15 text-red-600 animate-pulse border border-red-500/30"
                                : timeLeft < 300
                                  ? "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        }`}
                    >
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>

                    {/* Question Palette Trigger & Finish */}
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <Sheet open={paletteOpen} onOpenChange={setPaletteOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 rounded-lg text-xs font-semibold gap-1 border-border/80"
                                    aria-label="Question Palette"
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                    <span className="text-[11px] font-bold">{answeredCount}/{quiz.questions.length}</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] p-4 flex flex-col">
                                <SheetHeader className="pb-2 text-left">
                                    <SheetTitle className="text-base font-bold flex items-center justify-between">
                                        <span>Question Palette</span>
                                        <Badge variant="outline" className="text-xs font-normal">
                                            {quiz.questions.length} Questions
                                        </Badge>
                                    </SheetTitle>
                                    <SheetDescription className="text-xs text-muted-foreground truncate">
                                        {quiz.title} ({quiz.category})
                                    </SheetDescription>
                                </SheetHeader>

                                {/* Legend */}
                                <div className="flex items-center justify-around py-2.5 px-2 bg-muted/40 rounded-xl text-xs font-medium border border-border/50">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                                        <span>Answered ({answeredCount})</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                                        <span>Skipped ({skippedCount})</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30 border border-muted-foreground/50"></span>
                                        <span>Left ({unvisitedCount})</span>
                                    </div>
                                </div>

                                {/* Grid */}
                                <div className="flex-1 overflow-y-auto py-3 max-h-[48vh] [scrollbar-width:thin]">
                                    <div className="grid grid-cols-5 xs:grid-cols-6 gap-2.5 justify-items-center">
                                        {quiz.questions.map((q, i) => {
                                            const answered = answers[q.id] !== undefined
                                            const skipped = skippedQuestions.includes(q.id) && !answered
                                            const isCurrent = i === currentQuestionIndex
                                            return (
                                                <Button
                                                    key={q.id}
                                                    variant="outline"
                                                    className={`h-11 w-11 p-0 text-sm font-bold rounded-xl transition-all ${
                                                        isCurrent ? "ring-2 ring-primary ring-offset-2" : ""
                                                    } ${
                                                        answered
                                                            ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 shadow-xs"
                                                            : skipped
                                                              ? "bg-red-500 text-white hover:bg-red-600 border-red-500 shadow-xs"
                                                              : "bg-card text-foreground hover:bg-muted"
                                                    }`}
                                                    onClick={() => {
                                                        handleQuestionNavigation(i)
                                                        setPaletteOpen(false)
                                                    }}
                                                >
                                                    {i + 1}
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Finish Test in Drawer */}
                                <SheetFooter className="pt-2 border-t mt-auto">
                                    <Button
                                        variant="destructive"
                                        className="w-full font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
                                        onClick={() => {
                                            setPaletteOpen(false)
                                            handleFinishTest()
                                        }}
                                    >
                                        <span>■ Finish & Submit Test</span>
                                    </Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>

                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-bold rounded-lg"
                            onClick={handleFinishTest}
                        >
                            Finish
                        </Button>
                    </div>
                </header>

                {/* 2. Mobile Question Slider Ribbon */}
                <div className="fixed top-14 left-0 right-0 z-30 bg-card/95 backdrop-blur-md border-b px-3 py-1 flex items-center shadow-2xs h-13">
                    <div
                        ref={mobileSliderRef}
                        className="flex items-center gap-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full py-2 px-1"
                    >
                        {quiz.questions.map((q, i) => {
                            const answered = answers[q.id] !== undefined
                            const skipped = skippedQuestions.includes(q.id) && !answered
                            const isCurrent = i === currentQuestionIndex
                            return (
                                <button
                                    key={q.id}
                                    type="button"
                                    onClick={() => handleQuestionNavigation(i)}
                                    className={`h-8 w-8 rounded-lg shrink-0 text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                                        isCurrent
                                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background font-extrabold shadow-sm"
                                            : "hover:border-foreground/30"
                                    } ${
                                        answered
                                            ? "bg-blue-600 text-white border border-blue-600"
                                            : skipped
                                              ? "bg-red-500 text-white border border-red-500"
                                              : "bg-muted/60 text-muted-foreground border border-border/60 hover:bg-muted"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* 3. Main Question Scroll View */}
                <main className="flex-1 px-4 pt-30 pb-4 w-full max-w-full overflow-x-hidden">
                    {/* Question Header Chip */}
                    <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs font-bold px-2.5 py-1 bg-muted/40">
                            Question {currentQuestionIndex + 1} of {quiz.questions.length}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                +{currentQuestion.marksForCorrect} Marks
                            </span>
                            {currentQuestion.marksForIncorrect !== 0 && (
                                <span className="text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                                    {currentQuestion.marksForIncorrect} Mark
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Question Title */}
                    <h3 className="text-base sm:text-lg font-bold text-foreground leading-relaxed mb-5 break-words">
                        {currentQuestion.question}
                    </h3>

                    {/* Options list */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, optIdx) => {
                            const isSelected = answers[currentQuestion.id] === option.id
                            const optionLetter = String.fromCharCode(65 + optIdx)
                            return (
                                <div
                                    key={option.id}
                                    onClick={() => handleAnswerChange(option.id)}
                                    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                                        isSelected
                                            ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 shadow-xs"
                                            : "border-border/80 bg-card hover:bg-muted/40"
                                    }`}
                                >
                                    <span
                                        className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                            isSelected
                                                ? "bg-blue-600 text-white shadow-xs"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {optionLetter}
                                    </span>
                                    <span
                                        className={`text-sm leading-relaxed flex-1 break-words font-medium pt-0.5 ${
                                            isSelected ? "text-blue-950 dark:text-blue-100 font-semibold" : "text-foreground"
                                        }`}
                                    >
                                        {option.text}
                                    </span>
                                    <div
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-1.5 transition-colors ${
                                            isSelected
                                                ? "border-blue-600 bg-blue-600"
                                                : "border-muted-foreground/40"
                                        }`}
                                    >
                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Instructor info banner */}
                    <div className="mt-6 p-3 rounded-xl bg-muted/30 border border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
                        <span className="truncate">
                            Instructor: <span className="font-semibold text-foreground">{quiz.instructorName}</span>
                        </span>
                        <span className="shrink-0 font-medium">
                            {answers[currentQuestion.id] ? "✓ Answered" : "Not answered yet"}
                        </span>
                    </div>
                </main>

                {/* 4. Fixed Bottom Action Navigation Bar */}
                <footer className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t px-3 py-2.5 flex items-center justify-between gap-2 shadow-lg">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className="h-10 px-3 text-xs font-bold rounded-xl flex items-center gap-1 border-border/80 cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Prev</span>
                    </Button>

                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAnswer}
                            disabled={!answers[currentQuestion.id]}
                            className="h-10 px-2.5 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />
                            <span>Clear</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            disabled={!!answers[currentQuestion.id]}
                            className="h-10 px-2.5 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <span>Skip</span>
                        </Button>
                    </div>

                    {currentQuestionIndex === quiz.questions.length - 1 ? (
                        <Button
                            size="sm"
                            onClick={handleFinishTest}
                            className="h-10 px-4 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                            <span>Submit</span>
                            <CheckCircle2 className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={handleNext}
                            className="h-10 px-4 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1 cursor-pointer"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                </footer>
            </div>
        </div>
    )
}
