import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Test {
  id: number;
  title: string;
  questions: {
    correctAnswer: number;
  }[];
}

interface StudentResult {
  testId: number;
  answers: number[];
}

interface OverallTestPerformanceProps {
  tests: Test[];
  studentResults: StudentResult[];
}

const OverallTestPerformance: React.FC<OverallTestPerformanceProps> = ({
  tests,
  studentResults,
}) => {
  const calculateAverageScores = () => {
    return tests.map((test) => {
      const resultsForTest = studentResults.filter(
        (result) => result.testId === test.id
      );
      const totalQuestions = test.questions.length;
      const totalScores = resultsForTest.reduce((total, result) => {
        const score = result.answers.reduce((score, answer, index) => {
          return (
            score + (answer === test.questions[index].correctAnswer ? 1 : 0)
          );
        }, 0);
        return total + score;
      }, 0);
      const averageScore =
        resultsForTest.length > 0 ? totalScores / resultsForTest.length : 0;
      return {
        testId: test.id,
        testTitle: test.title,
        averageScore,
      };
    });
  };

  const averageScores = calculateAverageScores();
  const lowestScoreTest = averageScores.reduce((lowest, current) => {
    return current.averageScore < lowest.averageScore ? current : lowest;
  }, averageScores[0]);

  return (
    <div className="border px-5 py-3 pb-7 rounded-xl">
      <ScrollArea className="h-[16rem] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Average</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {averageScores.map((test) => (
              <TableRow key={test.testId}>
                <TableCell className="font-medium">{test.testTitle}</TableCell>
                <TableCell>{test.averageScore.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="text-sm pt-5 tracking-wide text-destructive">
        {lowestScoreTest?.testTitle} has the lowest average score of{" "}
        {lowestScoreTest?.averageScore.toFixed(2)}
      </div>
    </div>
  );
};

export default OverallTestPerformance;
