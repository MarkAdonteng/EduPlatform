import React from 'react';
import { ClipboardList, CheckCircle, Clock } from 'lucide-react';
import { Test } from '../types';
import { Link } from 'react-router-dom';

interface TestListProps {
  courseId: string;
  tests: Test[];
}

export default function TestList({ courseId, tests }: TestListProps) {
  if (tests.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-500">No tests available for this course yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <div key={test.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{test.title}</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  <span>{test.questions.length} Questions</span>
                </div>
                {test.timeLimit && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{test.timeLimit} Minutes</span>
                  </div>
                )}
                {test.passingScore && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Passing Score: {test.passingScore}%</span>
                  </div>
                )}
              </div>
            </div>
            <Link
              to={`/course/${courseId}/test/${test.id}`}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Start Test
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}