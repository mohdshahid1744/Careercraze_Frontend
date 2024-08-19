import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export function fallbackRender() {

    return (
        <div role="alert" className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <h1 className="text-2xl font-bold mb-4"> Sorry... Something went wrong</h1>
            <p className="text-gray-700 mb-4">We are experiencing technical difficulties. Please try again later.</p>
        </div>
    );
}