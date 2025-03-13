'use client';

import { useState } from 'react';
import { RadarSystem } from '@/lib/RadarSystem';

const ACQUISITION_SAMPLES = [512, 1024, 2048];

export default function Home() {
  const [formData, setFormData] = useState({
    range_res: '',
    range_max: '',
    velocity_max: '',
    velocity_res: '',
    angular_res: '',
    frequency: ''
  });

  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [currentCase, setCurrentCase] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const inputs = {
        range_res: parseFloat(formData.range_res),
        range_max: parseFloat(formData.range_max),
        velocity_max: parseFloat(formData.velocity_max),
        velocity_res: parseFloat(formData.velocity_res),
        angular_res: parseFloat(formData.angular_res),
        frequency: parseFloat(formData.frequency) * 1e9
      };

      // Validate inputs
      if (Object.values(inputs).some(isNaN)) {
        throw new Error('All fields must be valid numbers');
      }

      // Calculate results for each acquisition sample
      const newResults = ACQUISITION_SAMPLES.map(samples => {
        const radar = new RadarSystem(
          samples,
          inputs.range_res,
          inputs.range_max,
          inputs.velocity_max,
          inputs.velocity_res,
          inputs.angular_res,
          inputs.frequency
        );
        return {
          samples,
          ...radar.getResults(),
          ifBandwidthTable: radar.getIfBandwidthTable()
        };
      });

      setResults(newResults);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
          Radar Parameter Calculator
        </h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Range Resolution (m)
              </label>
              <input
                type="number"
                name="range_res"
                value={formData.range_res}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-white"
                step="any"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Maximum Range (m)
              </label>
              <input
                type="number"
                name="range_max"
                value={formData.range_max}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-white"
                step="any"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Maximum Velocity (km/hr)
              </label>
              <input
                type="number"
                name="velocity_max"
                value={formData.velocity_max}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-white"
                step="any"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Velocity Resolution (km/hr)
              </label>
              <input
                type="number"
                name="velocity_res"
                value={formData.velocity_res}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-white"
                step="any"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Angular Resolution (degrees)
              </label>
              <input
                type="number"
                name="angular_res"
                value={formData.angular_res}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-white"
                step="any"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Starting Frequency (GHz)
              </label>
              <input
                type="number"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-white"
                step="any"
                required
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Generate Parameters
          </button>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">
                Case {currentCase + 1}: Acquisition Samples = {results[currentCase].samples}
              </h2>
              <div className="flex gap-4">
                {ACQUISITION_SAMPLES.map((samples, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentCase(idx)}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      currentCase === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Requested vs Obtained Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-300">Requested Parameters</h3>
                <div className="space-y-2">
                  {Object.entries(results[currentCase].requestedParams).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400">{key.replace(/_/g, ' ').toUpperCase()}</span>
                      <span className="font-mono">{Number(value).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-300">Obtained Parameters</h3>
                <div className="space-y-2">
                  {Object.entries(results[currentCase].obtainedParams).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400">{key.replace(/_/g, ' ').toUpperCase()}</span>
                      <span className="font-mono">{Number(value).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CHIRP Parameters */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">CHIRP Frequency Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(results[currentCase].chirpFrequencyParams as Record<string, number>).map(([key, value]) => (
                  <div key={key} className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">{key.replace(/_/g, ' ').toUpperCase()}</div>
                    <div className="font-mono text-lg">
                      {key === 'bandwidth' 
                        ? `${Number(value).toFixed(2)} MHz`
                        : `${Number(value).toFixed(2)} GHz`
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timing Parameters */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">CHIRP Timing Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(results[currentCase].chirpTimingParams).map(([key, value]) => (
                  <div key={key} className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-sm text-gray-400">{key.replace(/_/g, ' ').toUpperCase()}</div>
                    <div className="font-mono text-lg">{Number(value).toFixed(2)} μs</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frame Parameters */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Frame Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">FRAME TIME</div>
                  <div className="font-mono text-lg">{results[currentCase].frameParams.frame_time.toFixed(2)} ms</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">NUMBER OF CHIRPS</div>
                  <div className="font-mono text-lg">{results[currentCase].frameParams.no_of_chirps}</div>
                </div>
              </div>
            </div>

            {/* Antennas */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Minimum Number of Antennas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">TX</div>
                  <div className="font-mono text-lg">{results[currentCase].antennas.tx}</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">RX</div>
                  <div className="font-mono text-lg">{results[currentCase].antennas.rx}</div>
                </div>
              </div>
            </div>

            {/* Additional Parameters */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Additional Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">TIME OF FLIGHT</div>
                  <div className="font-mono text-lg">{results[currentCase].timeOfFlight.toFixed(2)} μs</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">MEMORY REQUIRED</div>
                  <div className="font-mono text-lg">{results[currentCase].memoryRequired.toFixed(2)} kilobits per frame</div>
                </div>
              </div>
            </div>

            {/* IF Bandwidth Table */}
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-4">
                IF Bandwidth Table for Range Max {results[currentCase].requestedParams.range_max}m
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-2 text-left">Chirp Bandwidth (MHz)</th>
                      <th className="px-4 py-2 text-left">Required IF Bandwidth (MHz)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results[currentCase].ifBandwidthTable.map((row: any, i: number) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700/50'}>
                        <td className="px-4 py-2">{row.chirp_bandwidth}</td>
                        <td className="px-4 py-2">{row.if_bandwidth.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
