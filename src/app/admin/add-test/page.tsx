// "use client";

// import { useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import Navbar from "@/components/Navbar";

// interface Question {
//   question: string;
//   options: string[];
//   correctAnswer: number; // Index of the correct answer
// }

// const AddTest = () => {
//   const supabase = createClient();

//   const [testTitle, setTestTitle] = useState<string>("");
//   const [moduleName, setModuleName] = useState<string>("");
//   const [moduleNumber, setModuleNumber] = useState<number>(0);
//   const [questions, setQuestions] = useState<Question[]>([
//     { question: "", options: ["", "", "", ""], correctAnswer: 0 },
//   ]);

//   const handleAddQuestion = () => {
//     setQuestions([
//       ...questions,
//       { question: "", options: ["", "", "", ""], correctAnswer: 0 },
//     ]);
//   };

//   const handleInputChange = (
//     index: number,
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const values = [...questions];
//     if (event.target.name === "question") {
//       values[index].question = event.target.value;
//     } else if (event.target.name.startsWith("option-")) {
//       const optionIndex = parseInt(event.target.name.split("-")[1], 10);
//       values[index].options[optionIndex] = event.target.value;
//     } else if (event.target.name === "correctAnswer") {
//       values[index].correctAnswer = parseInt(event.target.value, 10);
//     }
//     setQuestions(values);
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     const { data, error } = await supabase.from("tests").insert([
//       {
//         title: testTitle,
//         module_name: moduleName,
//         module_number: moduleNumber,
//         questions: questions,
//       },
//     ]);

//     if (error) {
//       console.error("Error creating test:", error.message);
//     } else {
//       console.log("Test created successfully:", data);
//       setTestTitle("");
//       setModuleName("");
//       setModuleNumber(0);
//       setQuestions([
//         ...questions,
//         { question: "", options: ["", "", "", ""], correctAnswer: 0 },
//       ]);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="max-w-5xl pt-5 px-5 pb-20 mx-auto">
//         <div className="flex flex-col gap-5">
//           <h1 className="text-xl">Create a Test</h1>
//           <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
//             <div>
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 required
//                 type="text"
//                 value={testTitle}
//                 onChange={(e) => setTestTitle(e.target.value)}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-5">
//               <div>
//                 <Label htmlFor="module_number">Module Number</Label>
//                 <Input
//                   required
//                   type="number"
//                   value={moduleNumber}
//                   onChange={(e) =>
//                     setModuleNumber(parseInt(e.target.value, 10))
//                   }
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="module_name">Module Name</Label>
//                 <Input
//                   required
//                   type="text"
//                   value={moduleName}
//                   onChange={(e) => setModuleName(e.target.value)}
//                 />
//               </div>
//             </div>
//             {questions.map((question, index) => (
//               <div className="flex flex-col gap-5 border-b-2 pb-10" key={index}>
//                 <div className="flex flex-col gap-2">
//                   <Label htmlFor="question" className="text-lg">
//                     Question {index + 1}
//                   </Label>
//                   <Input
//                     required
//                     type="text"
//                     name="question"
//                     value={question.question}
//                     onChange={(e) => handleInputChange(index, e)}
//                   />
//                 </div>
//                 {question.options.map((option, optionIndex) => (
//                   <label key={optionIndex}>
//                     <Input
//                       required
//                       type="text"
//                       placeholder={`Option ${optionIndex}`}
//                       name={`option-${optionIndex}`}
//                       value={option}
//                       onChange={(e) => handleInputChange(index, e)}
//                     />
//                   </label>
//                 ))}
//                 <label>
//                   Correct Answer (0-3):
//                   <Input
//                     required
//                     type="number"
//                     name="correctAnswer"
//                     min="0"
//                     max="3"
//                     value={question.correctAnswer}
//                     onChange={(e) => handleInputChange(index, e)}
//                   />
//                 </label>
//               </div>
//             ))}
//             <Button
//               type="button"
//               variant={"secondary"}
//               onClick={handleAddQuestion}
//             >
//               Add more questions
//             </Button>
//             <Button type="submit">Create Test</Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTest;

"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer
}

const AddTest = () => {
  const supabase = createClient();

  const [testTitle, setTestTitle] = useState<string>("");
  const [moduleName, setModuleName] = useState<string>("");
  const [moduleNumber, setModuleNumber] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 0 },
    ]);
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
      alert("Test added successfully!");

      // Clear the form fields
      setTestTitle("");
      setModuleName("");
      setModuleNumber(0);
      setQuestions([
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ]);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl pt-5 px-5 pb-20 mx-auto">
        <div className="flex flex-col gap-5">
          <div className="text-3xl pb-5">Student Performance</div>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                required
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
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
              <div>
                <Label htmlFor="module_name">Module Name</Label>
                <Input
                  required
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
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
                <label>
                  Correct Answer (0-3):
                  <Input
                    required
                    type="number"
                    name="correctAnswer"
                    min="0"
                    max="3"
                    value={question.correctAnswer}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </label>
              </div>
            ))}
            <Button
              type="button"
              variant={"secondary"}
              onClick={handleAddQuestion}
            >
              Add more questions
            </Button>
            <Button type="submit">Create Test</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTest;
