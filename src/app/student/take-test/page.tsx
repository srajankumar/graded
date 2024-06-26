"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@clerk/nextjs";
import Logout from "@/components/Logout";

interface Question {
  question: string;
  options: string[];
}

interface Test {
  id: number;
  title: string;
  module_name: string;
  module_number: number;
  questions: Question[];
}

const TakeTestPage = () => {
  const supabase = createClient();
  const { userId } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

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

  const handleSelectTest = (test: Test) => {
    // Shuffle questions upon test selection
    const shuffledTestQuestions = [...test.questions].sort(() => Math.random() - 0.5);
    setSelectedTest(test);
    setAnswers(new Array(shuffledTestQuestions.length).fill(null));
    setShuffledQuestions(shuffledTestQuestions);
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data, error } = await supabase.from("student_answers").insert([
      {
        userId: userId,
        testId: selectedTest?.id,
        answers: answers,
      },
    ]);

    if (error) {
      console.error("Error submitting answers:", error.message);
    } else {
      console.log("Answers submitted successfully:", data);
    }
  };

  return (
    <div>
      <Logout />
      <h1>Take a Test</h1>
      {!selectedTest ? (
        <div>
          <h2>Select a Test</h2>
          {tests.map((test) => (
            <button key={test.id} onClick={() => handleSelectTest(test)}>
              {test.title}
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>{selectedTest.title}</h2>
          {shuffledQuestions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <p>{question.question}</p>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex}>
                  <input
                    type="radio"
                    name={`question-${questionIndex}`}
                    value={optionIndex}
                    checked={answers[questionIndex] === optionIndex}
                    onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default TakeTestPage;