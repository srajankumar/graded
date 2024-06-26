// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
// import Logout from "@/components/Logout";

// interface StudentResult {
//   userId: string;
//   testId: number;
//   answers: number[];
// }

// interface Test {
//   id: number;
//   title: string;
//   module_name: string;
//   module_number: number;
//   questions: { question: string; options: string[] }[];
// }

// const AdminResultsPage = () => {
//   const supabase = createClient();
//   const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
//   const [tests, setTests] = useState<Test[]>([]);
//   const [students, setStudents] = useState<{ userId: string; email: string }[]>(
//     []
//   );

//   useEffect(() => {
//     const fetchResults = async () => {
//       const { data: results, error: resultsError } = await supabase
//         .from("student_answers")
//         .select("*");
//       if (resultsError) {
//         console.error("Error fetching results:", resultsError.message);
//       } else {
//         setStudentResults(results as StudentResult[]);
//       }

//       const { data: tests, error: testsError } = await supabase
//         .from("tests")
//         .select("*");
//       if (testsError) {
//         console.error("Error fetching tests:", testsError.message);
//       } else {
//         setTests(tests as Test[]);
//       }

//       const { data: students, error: studentsError } = await supabase
//         .from("auth")
//         .select("userId, userEmail");
//       if (studentsError) {
//         console.error("Error fetching students:", studentsError.message);
//       } else {
//         setStudents(students);
//       }
//     };

//     fetchResults();
//   }, [supabase]);

//   const getStudentEmail = (userId: string) => {
//     const student = students.find((student) => student.userId === userId);
//     return student ? student.email : "Unknown";
//   };

//   const calculateScore = (test: Test, answers: number[]) => {
//     // Assuming correct answers are the first option (index 0)
//     return answers.reduce((score, answer, index) => {
//       return score + (answer === 0 ? 1 : 0);
//     }, 0);
//   };

//   return (
//     <div>
//       <Logout />
//       <h1>Student Results</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Student</th>
//             <th>Test</th>
//             <th>Module</th>
//             <th>Score</th>
//           </tr>
//         </thead>
//         <tbody>
//           {studentResults.map((result) => {
//             const test = tests.find((test) => test.id === result.testId);
//             if (!test) return null;
//             const score = calculateScore(test, result.answers);
//             return (
//               <tr key={`${result.userId}-${result.testId}`}>
//                 <td>{getStudentEmail(result.userId)}</td>
//                 <td>{test.title}</td>
//                 <td>{test.module_name}</td>
//                 <td>{score}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminResultsPage;

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Logout from "@/components/Logout";

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
  questions: { question: string; options: string[] }[];
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
      // Fetch student results
      const { data: results, error: resultsError } = await supabase
        .from("student_answers")
        .select("*");
      if (resultsError) {
        console.error("Error fetching results:", resultsError.message);
      } else {
        setStudentResults(results as StudentResult[]);
      }

      // Fetch tests
      const { data: tests, error: testsError } = await supabase
        .from("tests")
        .select("*");
      if (testsError) {
        console.error("Error fetching tests:", testsError.message);
      } else {
        setTests(tests as Test[]);
      }

      // Fetch students
      const { data: students, error: studentsError } = await supabase
        .from("auth")
        .select("userId, userEmail");
      if (studentsError) {
        console.error("Error fetching students:", studentsError.message);
      } else {
        // Assuming auth table has firstName field
        const studentData = students.map(
          (student: { userId: string; userEmail: string }) => ({
            userId: student.userId,
            email: student.userEmail,
            firstName: student.userEmail.split("@")[0],
          })
        );
        setStudents(studentData as Student[]);
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
    const scores = studentResultsFiltered.map((result) => {
      const test = tests.find((test) => test.id === result.testId);
      if (!test) return { testTitle: "Unknown", score: 0 };
      const score = calculateScore(result.testId, result.answers);
      return { testTitle: test.title, score };
    });
    return scores;
  };

  const calculateScore = (testId: number, answers: number[]) => {
    const test = tests.find((test) => test.id === testId);
    if (!test) return 0;

    // Assuming correct answers are the first option (index 0)
    return answers.reduce((score, answer, index) => {
      return score + (answer === test.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  return (
    <div>
      <Logout />
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>Student First Name</th>
            <th>Student Email</th>
            <th>Tests Given</th>
            <th>Scores</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboardPage;
