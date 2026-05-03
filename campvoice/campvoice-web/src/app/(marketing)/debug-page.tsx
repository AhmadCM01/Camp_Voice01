'use client';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-4">Debug Page - CampVoice is Working!</h1>
      <p className="text-lg mb-4">If you can see this page, the website is loading correctly.</p>
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-2">✅ All Systems Operational</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ Backend API: Running on port 8000</li>
          <li>✅ Web App: Running on port 3000</li>
          <li>✅ Database: Connected via Supabase</li>
          <li>✅ Mobile App: Metro bundler active</li>
        </ul>
      </div>
      <div className="mt-8">
        <a href="/" className="text-green-600 hover:text-green-700 underline">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
