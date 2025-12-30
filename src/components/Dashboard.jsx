import { useState, useEffect } from 'react'
import { TrendingUp, Clock, Trophy, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Dashboard = () => {
  const [predictions, setPredictions] = useState([
    {
      id: 1,
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'Buffalo Bills',
      homeWinProb: 0.65,
      awayWinProb: 0.35,
      predictedScore: { home: 28, away: 24 },
      confidence: 0.82,
      time: '2024-01-15 8:00 PM',
      status: 'upcoming'
    },
    {
      id: 2,
      homeTeam: 'San Francisco 49ers',
      awayTeam: 'Dallas Cowboys',
      homeWinProb: 0.58,
      awayWinProb: 0.42,
      predictedScore: { home: 31, away: 27 },
      confidence: 0.75,
      time: '2024-01-15 4:30 PM',
      status: 'upcoming'
    },
    {
      id: 3,
      homeTeam: 'Philadelphia Eagles',
      awayTeam: 'Tampa Bay Buccaneers',
      homeWinProb: 0.72,
      awayWinProb: 0.28,
      predictedScore: { home: 34, away: 21 },
      confidence: 0.88,
      time: '2024-01-14 1:00 PM',
      status: 'completed'
    }
  ])

  const winProbData = predictions.map(pred => ({
    name: `${pred.awayTeam.split(' ').pop()} @ ${pred.homeTeam.split(' ').pop()}`,
    homeProb: (pred.homeWinProb * 100).toFixed(1),
    awayProb: (pred.awayWinProb * 100).toFixed(1)
  }))

  const pieData = predictions[0] ? [
    { name: predictions[0].homeTeam.split(' ').pop(), value: predictions[0].homeWinProb * 100 },
    { name: predictions[0].awayTeam.split(' ').pop(), value: predictions[0].awayWinProb * 100 }
  ] : []

  const COLORS = ['#3b82f6', '#ef4444']

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-2">Real-Time Win Predictions</h2>
        <p className="text-gray-300">Powered by CNN + Cosine Similarity Transformer & Markov Chain Decision Tree</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Predictions</p>
              <p className="text-3xl font-bold text-white">{predictions.length}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Confidence</p>
              <p className="text-3xl font-bold text-white">
                {(predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length * 100).toFixed(1)}%
              </p>
            </div>
            <Trophy className="h-12 w-12 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Upcoming Games</p>
              <p className="text-3xl font-bold text-white">
                {predictions.filter(p => p.status === 'upcoming').length}
              </p>
            </div>
            <Clock className="h-12 w-12 text-green-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Win Probability Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Win Probabilities by Game</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={winProbData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff80" />
              <YAxis stroke="#ffffff80" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20' }} />
              <Legend />
              <Line type="monotone" dataKey="homeProb" stroke="#3b82f6" strokeWidth={2} name="Home Win %" />
              <Line type="monotone" dataKey="awayProb" stroke="#ef4444" strokeWidth={2} name="Away Win %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">Upcoming Game Predictions</h3>
        <div className="space-y-4">
          {predictions.filter(p => p.status === 'upcoming').map(prediction => (
            <div
              key={prediction.id}
              className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-400">{prediction.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                    <span className="text-blue-300 text-sm font-medium">
                      {(prediction.confidence * 100).toFixed(0)}% Confidence
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{prediction.awayTeam}</p>
                  <p className="text-2xl font-bold text-red-400">{prediction.predictedScore.away}</p>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 transition-all"
                        style={{ width: `${prediction.awayWinProb * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{(prediction.awayWinProb * 100).toFixed(1)}% Win Prob</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-sm">VS</p>
                </div>

                <div className="text-left">
                  <p className="text-lg font-semibold text-white">{prediction.homeTeam}</p>
                  <p className="text-2xl font-bold text-blue-400">{prediction.predictedScore.home}</p>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${prediction.homeWinProb * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{(prediction.homeWinProb * 100).toFixed(1)}% Win Prob</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

