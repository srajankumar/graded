"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import StudentScoresPieChart from "@/components/StudentScoresPieChart"; // Adjust the path as necessary
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredStudents = students.filter((student) => {
    const fullName = student.firstName.toLowerCase();
    const email = student.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="p">
      <Navbar />
      <div className="max-w-5xl mx-auto py-20 px-5">
        <div className="text-3xl py-24 pb-20">Student Performance</div>
        <div className="pb-10">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search students by name"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Scores</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.userId}>
                <TableCell className="font-medium">
                  {student.firstName}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell className="flex justify-center items-center">
                  <div className="w-80 h-80">
                    <StudentScoresPieChart
                      scores={getStudentScores(student.userId)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
