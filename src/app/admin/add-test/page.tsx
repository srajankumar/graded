"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Logout from "@/components/Logout";

interface Question {
  question: string;
  options: string[];
}

const CreateTestPage = () => {
  const supabase = createClient();
  const router = useRouter();

  const [testTitle, setTestTitle] = useState<string>("");
  const [moduleName, setModuleName] = useState<string>("");
  const [moduleNumber, setModuleNumber] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""] },
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""] }]);
  };

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...questions];
    if (event.target.name === "question") {
      values[index].question = event.target.value;
    } else {
      const optionIndex = parseInt(event.target.name.split("-")[1], 10);
      values[index].options[optionIndex] = event.target.value;
    }
    setQuestions(values);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data, error } = await supabase.from("tests").insert([
      {
        title: testTitle,
        module_name: moduleName,
        module_number: moduleNumber,
        questions: questions,
      },
    ]);

    if (error) {
      console.error("Error creating test:", error.message);
    } else {
      console.log("Test created successfully:", data);
      router.push("/teacher");
    }
  };

  return (
    <div>
      <Logout />
      <h1>Create a Test</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Test Title:
          <input
            type="text"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Module Name:
          <input
            type="text"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Module Number:
          <input
            type="number"
            value={moduleNumber}
            onChange={(e) => setModuleNumber(parseInt(e.target.value, 10))}
          />
        </label>
        <br />
        <h3>Questions</h3>
        {questions.map((question, index) => (
          <div key={index}>
            <label>
              Question:
              <input
                type="text"
                name="question"
                value={question.question}
                onChange={(e) => handleInputChange(index, e)}
              />
            </label>
            <br />
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex}>
                Option {optionIndex + 1}:
                <input
                  type="text"
                  name={`option-${optionIndex}`}
                  value={option}
                  onChange={(e) => handleInputChange(index, e)}
                />
              </label>
            ))}
            <br />
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>
          Add Question
        </button>
        <br />
        <button type="submit">Create Test</button>
      </form>
    </div>
  );
};

export default CreateTestPage;
