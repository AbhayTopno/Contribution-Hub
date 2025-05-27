'use client';

export default function ErrorState({ error }: { error: Error }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        className="bg-gray-50 border border-gray-300 text-gray-800 px-6 py-4 rounded"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error.message}</span>
      </div>
    </div>
  );
}
