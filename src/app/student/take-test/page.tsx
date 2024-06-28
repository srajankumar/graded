"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
}

interface Test {
  id: number;
  title: string;
  module_name: string;
  module_number: number;
  test_duration: number;
  questions: Question[];
}

const TakeTestPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const supabase = createClient();
  const { userId } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchTests = async () => {
      const { data, error } = await supabase.from("tests").select("*");
      if (error) {
        console.error("Error fetching tests:", error.message);
      } else {
        setTests(data as Test[]);
      }
    };

    fetchTests();
  }, [supabase]);

  useEffect(() => {
    if (timer !== null && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => (prevTimer !== null ? prevTimer - 1 : null));
      }, 1000);
    } else if (timer === 0) {
      clearInterval(timerRef.current!);
      handleSubmit();
    }

    return () => clearInterval(timerRef.current!);
  }, [timer]);

  const handleSelectTest = async (test: Test) => {
    // Check if the user has already taken the test
    const { data: existingAnswers, error: existingError } = await supabase
      .from("student_answers")
      .select("id")
      .eq("userId", userId)
      .eq("testId", test.id);

    if (existingError) {
      console.error("Error checking existing answers:", existingError.message);
      return;
    }

    if (existingAnswers.length > 0) {
      toast.info("You have already taken this test.");
      return;
    }

    const shuffledTestQuestions = [...test.questions].sort(
      () => Math.random() - 0.5
    );
    setSelectedTest(test);
    setAnswers(new Array(shuffledTestQuestions.length).fill(null));
    setShuffledQuestions(shuffledTestQuestions);
    setTimer(test.test_duration * 60); // Set timer in seconds
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleClearAll = () => {
    setAnswers(new Array(shuffledQuestions.length).fill(null));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("student_answers").insert([
      {
        userId: userId,
        testId: selectedTest?.id,
        answers: answers,
      },
    ]);

    if (error) {
      setLoading(false);
      console.error("Error submitting answers:", error.message);
    } else {
      handleClearAll();
      setLoading(false);
      console.log("Answers submitted successfully:", data);
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto py-20 px-5">
        <div>
          {!selectedTest ? (
            <div>
              <div className="text-3xl py-24">Select a test to take</div>
              <div className="flex flex-col gap-5">
                {tests.map((test) => (
                  <Button
                    key={test.id}
                    className="flex justify-start"
                    onClick={() => handleSelectTest(test)}
                  >
                    Module {test.module_number}: {test.title}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="py-20">
                <div className="text-primary font-medium text-sm tracking-wide pb-2">
                  MODULE {selectedTest.module_number}:{" "}
                  {selectedTest.module_name}
                </div>
                <div className="text-3xl">{selectedTest.title}</div>
                {timer !== null && (
                  <div className="text-destructive pt-2">
                    Time Remaining: {Math.floor(timer / 60)}:
                    {String(timer % 60).padStart(2, "0")}
                  </div>
                )}
              </div>
              {shuffledQuestions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-10">
                  <div className="text-lg mb-2 font-medium">
                    {questionIndex + 1}. {question.question}
                  </div>
                  <RadioGroup
                    value={answers[questionIndex]?.toString() ?? ""}
                    onValueChange={(value) =>
                      handleAnswerChange(questionIndex, parseInt(value))
                    }
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        className="flex items-center space-x-2"
                        key={optionIndex}
                      >
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`option-${questionIndex}-${optionIndex}`}
                        />
                        <Label
                          htmlFor={`option-${questionIndex}-${optionIndex}`}
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              <div className="flex w-full gap-5">
                <Button
                  type="button"
                  className="w-full"
                  variant={"secondary"}
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() => setIsOpen(true)}
                >
                  {loading && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 animate-spin"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  )}
                  {loading ? "Submitting" : "Submit"}
                </Button>
                <SpringModal
                  isLoading={loading}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SpringModal = ({
  isOpen,
  isLoading,
  setIsOpen,
  handleSubmit,
}: {
  isOpen: boolean;
  isLoading: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleSubmit: () => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-black/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-primary text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <AlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
            <div className="relative z-10">
              <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-primary grid place-items-center mx-auto">
                <AlertCircle />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">
                Are you sure you want to submit?
              </h3>
              <p className="text-center mb-6">
                Think carefully before submitting - you won&apos;t be able to
                change your answers once you&apos;ve submitted.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                >
                  Review
                </button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-white hover:bg-white/85 transition-opacity text-primary font-semibold w-full py-2 rounded"
                >
                  {isLoading && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 animate-spin"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  )}
                  {isLoading ? "Submitting" : "Submit"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TakeTestPage;
