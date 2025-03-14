'use client';

import { useState } from 'react';
import { RadarSystem } from '@/lib/RadarSystem';
import ImageVisualizer from './components/ImageVisualizer';

const ACQUISITION_SAMPLES = [512, 1024, 2048];

// Add these interfaces at the top of the file after the imports
interface BandwidthTableRow {
  chirp_bandwidth: number;
  if_bandwidth: number;
}

interface RadarResult {
  samples: number;
  requestedParams: {
    range_max: number;
    range_res: number;
    velocity_max: number;
    velocity_res: number;
    angular_res: number;
  };
  obtainedParams: {
    range_max: number;
    range_res: number;
    velocity_max: number;
    velocity_res: number;
    angular_res: number;
  };
  chirpFrequencyParams: {
    start_freq: number;
    center_freq: number;
    end_freq: number;
    bandwidth: number;
  };
  chirpTimingParams: {
    dc_power_on_delay_time: number;
    dwell_time: number;
    settle_time: number;
    acquisition_time: number;
    reset_time: number;
    jumpback_time: number;
    idle_time: number;
    chirp_time: number;
  };
  frameParams: {
    frame_time: number;
    no_of_chirps: number;
  };
  antennas: {
    tx: number;
    rx: number;
  };
  timeOfFlight: number;
  memoryRequired: number;
  ifBandwidthTable: BandwidthTableRow[];
}

export default function Home() {
  const [formData, setFormData] = useState({
    range_res: '',
    range_max: '',
    velocity_max: '',
    velocity_res: '',
    angular_res: '',
    frequency: ''
  });

  const [results, setResults] = useState<RadarResult[]>([]);
  const [error, setError] = useState('');
  const [showImage, setShowImage] = useState(false);

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
    setShowImage(true);

    try {
      const inputs = {
        range_res: parseFloat(formData.range_res),
        range_max: parseFloat(formData.range_max),
        velocity_max: parseFloat(formData.velocity_max),
        velocity_res: parseFloat(formData.velocity_res),
        angular_res: parseFloat(formData.angular_res),
        frequency: parseFloat(formData.frequency)
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

  const handleNewCalculation = () => {
    setFormData({
      range_res: '',
      range_max: '',
      velocity_max: '',
      velocity_res: '',
      angular_res: '',
      frequency: ''
    });
    setResults([]);
    setError('');
    setShowImage(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-blue-400">
          Radar Parameter Calculator
        </h1>
        <div className="bg-gray-700/50 p-3 rounded-md mb-8 max-w-2xl mx-auto">
          <p className="text-center text-lg font-semibold text-yellow-400">
            All parameters are based on taking IF_Max = 40 MHz
          </p>
        </div>

        {/* New Calculation Button */}
        {results.length > 0 ? (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleNewCalculation}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              New Calculation
            </button>
          </div>
        ) : (
          /* Input Form */
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
                  Frequency (Hz)
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

            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Generate
              </button>
            </div>
          </form>
        )}

        {/* Image Visualization */}
        {showImage && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">CHIRP Design Visualization</h3>
            <ImageVisualizer
              imagePath="/chirp-design.png"
              alt="CHIRP Design"
            />
          </div>
        )}

        {/* IF_Max Information - Single line for all cases */}
        {results.length > 0 && (
          <div className="mb-8">
            <p className="text-center text-lg font-semibold text-yellow-400 bg-gray-700/50 p-3 rounded-md">
              All parameters are based on taking IF_Max = 40 MHz
            </p>
          </div>
        )}

        {/* Results */}
        {results.map((result, idx) => (
          <div key={idx} className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">
              Case {idx + 1}: Acquisition Samples = {result.samples}
            </h2>

            {/* Requested vs Obtained Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-300">Requested Parameters</h3>
                <div className="space-y-2">
                  {Object.entries(result.requestedParams).map(([key, value]) => (
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
                  {Object.entries(result.obtainedParams).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400">{key.replace(/_/g, ' ').toUpperCase()}</span>
                      <span className="font-mono">{Number(value).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CHIRP Frequency Parameters */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">CHIRP Frequency Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(result.chirpFrequencyParams).map(([key, value]) => (
                  <div key={key} className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">{key.replace(/_/g, ' ').toUpperCase()}</div>
                    <div className="font-mono text-lg">
                      {Number(value).toFixed(2)} {key.includes('bandwidth') ? 'MHz' : 'GHz'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CHIRP Timing Parameters */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">CHIRP Timing Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(result.chirpTimingParams).map(([key, value]) => (
                  <div key={key} className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">{key.replace(/_/g, ' ').toUpperCase()}</div>
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
                  <div className="text-gray-400 text-sm mb-1">FRAME TIME</div>
                  <div className="font-mono text-lg">{Number(result.frameParams.frame_time).toFixed(2)} ms</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">NUMBER OF CHIRPS PER FRAME</div>
                  <div className="font-mono text-lg">{result.frameParams.no_of_chirps}</div>
                </div>
              </div>
            </div>

            {/* Antenna Configuration */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Minimum Number of Antennas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">TX ANTENNAS</div>
                  <div className="font-mono text-lg">{result.antennas.tx}</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm mb-1">RX ANTENNAS</div>
                  <div className="font-mono text-lg">{result.antennas.rx}</div>
                </div>
              </div>
            </div>

            {/* Time of Flight */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Time of Flight</h3>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">TIME OF FLIGHT TO TARGET</div>
                <div className="font-mono text-lg">{Number(result.timeOfFlight).toFixed(2)} μs</div>
              </div>
            </div>

            {/* IF Bandwidth Table */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">IF Bandwidth Table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="p-4">Chirp Bandwidth (MHz)</th>
                      <th className="p-4">Required IF Bandwidth (MHz)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.ifBandwidthTable.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-700/50' : ''}>
                        <td className="p-4">{row.chirp_bandwidth}</td>
                        <td className="p-4">{Number(row.if_bandwidth).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Memory Required */}
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Memory Requirements</h3>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">MEMORY REQUIRED</div>
                <div className="font-mono text-lg">{Number(result.memoryRequired).toFixed(2)} kilobits per frame</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
