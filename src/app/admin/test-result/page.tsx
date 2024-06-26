// AdminDashboardPage.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import StudentScoresPieChart from "@/components/StudentScoresPieChart"; // Adjust the path as necessary

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

const AdminDashboardPage = () => {
  const supabase = createClient();
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [supabase]);

  const getStudentFirstName = (userId: string) => {
    const student = students.find((student) => student.userId === userId);
    return student ? student.firstName : "Unknown";
  };

  const getStudentEmail = (userId: string) => {
    const student = students.find((student) => student.userId === userId);
    return student ? student.email : "Unknown";
  };

  const getStudentScores = (userId: string) => {
    const studentResultsFiltered = studentResults.filter(
      (result) => result.userId === userId
    );
    return studentResultsFiltered.map((result) => {
      const test = tests.find((test) => test.id === result.testId);
      if (!test) return { testTitle: "Unknown", score: 0 };
      const score = calculateScore(test, result.answers);
      return { testTitle: test.title, score };
    });
  };

  const calculateScore = (test: Test, answers: number[]) => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === test.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl pt-5 px-5 pb-20 mx-auto">
        <table>
          <thead>
            <tr>
              <th>Student First Name</th>
              <th>Student Email</th>
              <th>Tests Given</th>
              <th>Scores</th>
              <th>Score Chart</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.userId}>
                <td>{student.firstName}</td>
                <td>{student.email}</td>
                <td>
                  {getStudentScores(student.userId).map((score, index) => (
                    <div key={index}>
                      <p>{score.testTitle}</p>
                    </div>
                  ))}
                </td>
                <td>
                  {getStudentScores(student.userId).map((score, index) => (
                    <div key={index}>
                      <p>{score.score}</p>
                    </div>
                  ))}
                </td>
                <td>
                  <StudentScoresPieChart
                    scores={getStudentScores(student.userId)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
