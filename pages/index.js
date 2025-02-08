import React, { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    MMC: '',
    FMC: '',
    startAs: '',
    mainTrope: ''
  });
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      setStory(data.story);
    } catch (err) {
      setError('Failed to generate story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold mb-8">Romance Story Generator</h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Male Main Character (MMC)</label>
                    <input
                      type="text"
                      value={formData.MMC}
                      onChange={(e) => setFormData({...formData, MMC: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter character name and source"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Female Main Character (FMC)</label>
                    <input
                      type="text"
                      value={formData.FMC}
                      onChange={(e) => setFormData({...formData, FMC: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Describe the female main character"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start As</label>
                    <input
                      type="text"
                      value={formData.startAs}
                      onChange={(e) => setFormData({...formData, startAs: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Their initial relationship"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trope</label>
                    <select
                      value={formData.mainTrope}
                      onChange={(e) => setFormData({...formData, mainTrope: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select a trope</option>
                      <option value="Enemies to lovers">Enemies to lovers</option>
                      <option value="Friends to lovers">Friends to lovers</option>
                      <option value="Arranged marriage">Arranged marriage</option>
                      <option value="Marriage of convenience">Marriage of convenience</option>
                      <option value="He falls first">He falls first</option>
                      <option value="She falls first">She falls first</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                  >
                    {isLoading ? 'Generating...' : 'Generate Story'}
                  </button>
                </form>

                {error && (
                  <div className="mt-4 text-red-600">
                    {error}
                  </div>
                )}

                {story && (
                  <div className="mt-8 prose">
                    <h2 className="text-xl font-bold mb-4">Your Generated Story</h2>
                    <div className="whitespace-pre-wrap">
                      {story}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
