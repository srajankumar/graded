"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
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

const StudentDashboard = () => {
  const supabase = createClient();
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const { user } = useUser();
  const hardcodedUserId = user?.id; // Replace with actual hardcoded user ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: results, error: resultsError } = await supabase
          .from("student_answers")
          .select("*")
          .eq("userId", hardcodedUserId);
        if (resultsError) throw resultsError;
        setStudentResults(results as StudentResult[]);

        const { data: tests, error: testsError } = await supabase
          .from("tests")
          .select("*");
        if (testsError) throw testsError;
        setTests(tests as Test[]);

        const { data: students, error: studentsError } = await supabase
          .from("auth")
          .select("userId, userEmail")
          .eq("userId", hardcodedUserId);
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
      <div className="grid md:grid-cols-2 md:gap-0 gap-20">
        <div>
          {students.map((student) => (
            <div key={student.userId} className="flex flex-col gap-5">
              {studentResults.map((result) => {
                const test = tests.find((test) => test.id === result.testId);
                if (!test) return null;

                let correctAnswers = 0;
                let incorrectAnswers = 0;

                result.answers.forEach((answer, index) => {
                  if (answer === test.questions[index].correctAnswer) {
                    correctAnswers++;
                  } else {
                    incorrectAnswers++;
                  }
                });

                return (
                  <div
                    key={result.testId}
                    className="bg-secondary md:hover:scale-[102%] transition-all duration-200 p-4 border rounded-lg shadow-sm"
                  >
                    <h4 className="text-md font-medium">{test.title}</h4>
                    <p>
                      Module: {test.module_name} - {test.module_number}
                    </p>
                    <p>Correct Answers: {correctAnswers}</p>
                    <p>Incorrect Answers: {incorrectAnswers}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex md:justify-end justify-center items-center">
          <div className="max-w-sm md:pr-10">
            <OverallCorrectIncorrectPieChart
              correct={correctCount}
              incorrect={incorrectCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
