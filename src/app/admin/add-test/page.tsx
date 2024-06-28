"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const AddTest = () => {
  const supabase = createClient();
  const [testDuration, setTestDuration] = useState<number>(0);
  const [testTitle, setTestTitle] = useState<string>("");
  const [moduleName, setModuleName] = useState<string>("");
  const [moduleNumber, setModuleNumber] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const values = [...questions];
    values.splice(index, 1);
    setQuestions(values);
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...questions];
    if (event.target.name === "question") {
      values[index].question = event.target.value;
    } else if (event.target.name.startsWith("option-")) {
      const optionIndex = parseInt(event.target.name.split("-")[1], 10);
      values[index].options[optionIndex] = event.target.value;
    } else if (event.target.name === "correctAnswer") {
      values[index].correctAnswer = parseInt(event.target.value, 10);
    }
    setQuestions(values);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.from("tests").insert([
      {
        title: testTitle,
        module_name: moduleName,
        module_number: moduleNumber,
        test_duration: testDuration,
        questions: questions,
      },
    ]);

    setIsLoading(false);

    if (error) {
      toast.error("Error creating test!");
      console.error("Error creating test:", error.message);
    } else {
      console.log("Test created successfully:", data);
      toast.success("Test added successfully!");
      setTestTitle("");
      setModuleName("");
      setModuleNumber(0);
      setTestDuration(0);
      setQuestions([
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ]);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto py-20 px-5">
        <div className="flex flex-col gap-5">
          <div className="text-3xl py-24 pb-20">Create a new test</div>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                required
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-5 gap-5">
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="module_number">Module Number</Label>
                <Input
                  required
                  type="number"
                  value={moduleNumber}
                  onChange={(e) =>
                    setModuleNumber(parseInt(e.target.value, 10))
                  }
                />
              </div>
              <div className="col-span-2 grid gap-2">
                <Label htmlFor="module_name">Module Name</Label>
                <Input
                  required
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="test_duration">Test Duration (minutes)</Label>
                <Input
                  required
                  type="number"
                  value={testDuration}
                  onChange={(e) =>
                    setTestDuration(parseInt(e.target.value, 10))
                  }
                />
              </div>
            </div>
            {questions.map((question, index) => (
              <div className="flex flex-col gap-5 border-b-2 pb-10" key={index}>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="question" className="text-lg">
                    Question {index + 1}
                  </Label>
                  <Input
                    required
                    placeholder="What is your question?"
                    type="text"
                    name="question"
                    value={question.question}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex}>
                    <Input
                      required
                      type="text"
                      placeholder={`Option ${optionIndex}`}
                      name={`option-${optionIndex}`}
                      value={option}
                      onChange={(e) => handleInputChange(index, e)}
                    />
                  </label>
                ))}
                <div className="grid gap-2">
                  <Label htmlFor="correctAnswer"> Correct Answer (0-3):</Label>
                  <Input
                    required
                    type="number"
                    name="correctAnswer"
                    min="0"
                    max="3"
                    value={question.correctAnswer}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Remove Question
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddQuestion}
            >
              Add more questions
            </Button>
            <Button type="submit" disabled={isLoading}>
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
              {isLoading ? "Creating" : "Create"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTest;
