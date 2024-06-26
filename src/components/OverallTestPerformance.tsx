// OverallTestPerformance.tsx
import React from "react";

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
    <div>
      <h2 className="text-xl font-bold mb-3">Test Performance Overview</h2>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th>Test Title</th>
            <th>Average Score</th>
          </tr>
        </thead>
        <tbody>
          {averageScores.map((test) => (
            <tr
              key={test.testId}
              className={
                test.testId === lowestScoreTest.testId ? "bg-red-100" : ""
              }
            >
              <td>{test.testTitle}</td>
              <td>{test.averageScore.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5">
        <h3 className="text-lg font-bold">Lowest Scoring Test</h3>
        <p>
          {lowestScoreTest?.testTitle} with an average score of{" "}
          {lowestScoreTest?.averageScore.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OverallTestPerformance;
