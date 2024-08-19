import React from 'react';
import { Link } from 'react-router-dom';

function PageNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mt-4">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-gray-500 mt-2">It might have been moved or deleted.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
