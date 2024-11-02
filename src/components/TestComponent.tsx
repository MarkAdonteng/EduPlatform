import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../types';

interface TestComponentProps {
  courseId: string;
}

function TestComponent({ }: TestComponentProps) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [showResults, setShowResults] = React.useState(false);

  const questions: Question[] = [
    {
      id: '1',
      text: 'What is the derivative of x²?',
      options: ['x', '2x', '2x²', 'x½'],
      correctAnswer: 1
    },
    {
      id: '2',
      text: 'What is the integral of 2x?',
      options: ['x²', 'x² + C', '2x² + C', 'x'],
      correctAnswer: 2
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Test Results</h3>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">
              {score} / {questions.length}
            </p>
            <p className="mt-2 text-gray-600">
              You got {score} questions correct out of {questions.length}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border-t pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{question.text}</p>
                    <p className="text-sm text-gray-500">
                      Your answer: {question.options[answers[index]]}
                    </p>
                  </div>
                  {answers[index] === question.correctAnswer ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Question {currentQuestion + 1}</h3>
        <span className="text-gray-500">
          {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-lg mb-4">{question.text}</p>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full text-left p-4 rounded-lg border ${
                answers[currentQuestion] === index
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestComponent;