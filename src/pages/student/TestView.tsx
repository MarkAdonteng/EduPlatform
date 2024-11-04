import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useCourseStore } from '../../store/courseStore';
import { Test, Question } from '../../types';

function TestView() {
  const { courseId, testId } = useParams();
  const navigate = useNavigate();
  const { tests } = useCourseStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const test = tests[courseId!]?.find(t => t.id === testId);
  const question = test?.questions[currentQuestion];

  useEffect(() => {
    if (test?.timeLimit) {
      setTimeLeft(test.timeLimit * 60); // Convert minutes to seconds
    }
  }, [test]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft === 0) {
      setShowResults(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev! - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Test not found</p>
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Back to Course
        </button>
      </div>
    );
  }

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.reduce((sum, answer, index) => {
      return sum + (answer === test.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    return (correctAnswers / test.questions.length) * 100;
  };

  if (showResults) {
    const score = calculateScore();
    const passed = test.passingScore ? score >= test.passingScore : true;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto p-4"
      >
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Test Results</h2>
          
          <div className="text-center mb-8">
            <div className={`text-4xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {score.toFixed(1)}%
            </div>
            <p className="text-gray-600 mt-2">
              {passed ? 'Congratulations! You passed the test!' : 'Keep practicing and try again!'}
            </p>
          </div>

          <div className="space-y-6">
            {test.questions.map((question, index) => (
              <div key={index} className="border-t pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{question.text}</p>
                    <div className="mt-2 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded ${
                            optIndex === question.correctAnswer
                              ? 'bg-green-100'
                              : optIndex === answers[index]
                              ? 'bg-red-100'
                              : 'bg-gray-50'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    {question.feedback && (
                      <p className="mt-2 text-sm text-gray-600">{question.feedback}</p>
                    )}
                  </div>
                  {answers[index] === question.correctAnswer ? (
                    <CheckCircle className="h-6 w-6 text-green-500 ml-4" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 ml-4" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="mt-8 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Course
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-4"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{test.title}</h2>
          {timeLeft !== null && (
            <div className="text-gray-600">
              Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {test.questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / test.questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {question && (
          <div className="space-y-4">
            <p className="text-lg font-medium">{question.text}</p>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    answers[currentQuestion] === index
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {currentQuestion === test.questions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default TestView;