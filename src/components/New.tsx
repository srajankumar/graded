// AdminDashboardPage.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import OverallCorrectIncorrectPieChart from "@/components/OverallCorrectIncorrectPieChart"; // Adjust the path as necessary
import OverallTestPerformance from "@/components/OverallTestPerformance"; // Adjust the path as necessary

interface StudentResult {
  userId: string;
  testId: number;
  answers: number[];
}

interface Test {
  id: number;
  title: string;
  module_name: string;
  module_number: number;
  questions: {
    correctAnswer: number;
    question: string;
    options: string[];
  }[];
}

interface Student {
  userId: string;
  firstName: string;
  email: string;
}

const New = () => {
  const supabase = createClient();
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: results, error: resultsError } = await supabase
          .from("student_answers")
          .select("*");
        if (resultsError) throw resultsError;
        setStudentResults(results as StudentResult[]);

        const { data: tests, error: testsError } = await supabase
          .from("tests")
          .select("*");
        if (testsError) throw testsError;
        setTests(tests as Test[]);

        const { data: students, error: studentsError } = await supabase
          .from("auth")
          .select("userId, userEmail");
        if (studentsError) throw studentsError;

        const studentData = students.map(
          (student: { userId: string; userEmail: string }) => ({
            userId: student.userId,
            email: student.userEmail,
            firstName: student.userEmail.split("@")[0],
          })
        );
        setStudents(studentData as Student[]);

        // Calculate overall correct and incorrect counts
        let overallCorrect = 0;
        let overallIncorrect = 0;

        results.forEach((result: StudentResult) => {
          const test = tests.find((test: any) => test.id === result.testId);
          if (test) {
            result.answers.forEach((answer, index) => {
              if (answer === test.questions[index].correctAnswer) {
                overallCorrect++;
              } else {
                overallIncorrect++;
              }
            });
          }
        });

        setCorrectCount(overallCorrect);
        setIncorrectCount(overallIncorrect);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [supabase]);

  return (
    <div>
      <div className="pt-5">
        <h1 className="text-2xl font-bold mb-5">Overall Analysis</h1>
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-3">
            Correct vs Incorrect Answers
          </h2>
          <div className="max-w-sm">
            <OverallCorrectIncorrectPieChart
              correct={correctCount}
              incorrect={incorrectCount}
            />
          </div>
        </div>
        <div className="mb-10">
          <OverallTestPerformance
            tests={tests}
            studentResults={studentResults}
          />
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>Student First Name</th>
              <th>Student Email</th>
              <th>Tests Given</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.userId}>
                <td>{student.firstName}</td>
                <td>{student.email}</td>
                <td>
                  {
                    studentResults.filter(
                      (result) => result.userId === student.userId
                    ).length
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default New;
