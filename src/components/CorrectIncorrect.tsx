// AdminDashboardPage.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import CorrectIncorrectPieChart from "@/components/CorrectIncorrectPieChart"; // Adjust the path as necessary

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

  const getCorrectIncorrectCounts = (userId: string) => {
    const studentResultsFiltered = studentResults.filter(
      (result) => result.userId === userId
    );
    let correct = 0;
    let incorrect = 0;

    studentResultsFiltered.forEach((result) => {
      const test = tests.find((test) => test.id === result.testId);
      if (test) {
        result.answers.forEach((answer, index) => {
          if (answer === test.questions[index].correctAnswer) {
            correct++;
          } else {
            incorrect++;
          }
        });
      }
    });

    return { correct, incorrect };
  };

  return (
    <div>
      <div className="pt-5">
        <table>
          <thead>
            <tr>
              <th>Student First Name</th>
              <th>Student Email</th>
              <th>Tests Given</th>
              <th>Correct vs Incorrect Answers</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const { correct, incorrect } = getCorrectIncorrectCounts(
                student.userId
              );
              return (
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
                  <td>
                    <CorrectIncorrectPieChart
                      correct={correct}
                      incorrect={incorrect}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
