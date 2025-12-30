import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

const TeamComparison = () => {
  const [selectedTeam1, setSelectedTeam1] = useState('Kansas City Chiefs')
  const [selectedTeam2, setSelectedTeam2] = useState('Buffalo Bills')

  const teams = [
    'Kansas City Chiefs',
    'Buffalo Bills',
    'San Francisco 49ers',
    'Dallas Cowboys',
    'Philadelphia Eagles',
    'Tampa Bay Buccaneers'
  ]

  // Mock team stats - in real app, this would come from your ML model
  const teamStats = {
    'Kansas City Chiefs': {
      offense: 92,
      defense: 85,
      specialTeams: 88,
      turnoverMargin: 0.8,
      redZone: 0.72,
      thirdDown: 0.45,
      timeOfPossession: 31.2
    },
    'Buffalo Bills': {
      offense: 89,
      defense: 87,
      specialTeams: 82,
      turnoverMargin: 0.5,
      redZone: 0.68,
      thirdDown: 0.42,
      timeOfPossession: 29.8
    },
    'San Francisco 49ers': {
      offense: 88,
      defense: 91,
      specialTeams: 85,
      turnoverMargin: 0.6,
      redZone: 0.70,
      thirdDown: 0.44,
      timeOfPossession: 30.5
    },
    'Dallas Cowboys': {
      offense: 87,
      defense: 88,
      specialTeams: 80,
      turnoverMargin: 0.4,
      redZone: 0.65,
      thirdDown: 0.40,
      timeOfPossession: 28.9
    },
    'Philadelphia Eagles': {
      offense: 90,
      defense: 86,
      specialTeams: 83,
      turnoverMargin: 0.7,
      redZone: 0.71,
      thirdDown: 0.43,
      timeOfPossession: 30.1
    },
    'Tampa Bay Buccaneers': {
      offense: 85,
      defense: 89,
      specialTeams: 81,
      turnoverMargin: 0.3,
      redZone: 0.63,
      thirdDown: 0.38,
      timeOfPossession: 28.5
    }
  }

  const team1Stats = teamStats[selectedTeam1]
  const team2Stats = teamStats[selectedTeam2]

  const comparisonData = [
    { metric: 'Offense', team1: team1Stats.offense, team2: team2Stats.offense },
    { metric: 'Defense', team1: team1Stats.defense, team2: team2Stats.defense },
    { metric: 'Special Teams', team1: team1Stats.specialTeams, team2: team2Stats.specialTeams },
    { metric: 'Red Zone %', team1: team1Stats.redZone * 100, team2: team2Stats.redZone * 100 },
    { metric: '3rd Down %', team1: team1Stats.thirdDown * 100, team2: team2Stats.thirdDown * 100 }
  ]

  const radarData = [
    { category: 'Offense', team1: team1Stats.offense, team2: team2Stats.offense, fullMark: 100 },
    { category: 'Defense', team1: team1Stats.defense, team2: team2Stats.defense, fullMark: 100 },
    { category: 'Special Teams', team1: team1Stats.specialTeams, team2: team2Stats.specialTeams, fullMark: 100 },
    { category: 'Red Zone', team1: team1Stats.redZone * 100, team2: team2Stats.redZone * 100, fullMark: 100 },
    { category: '3rd Down', team1: team1Stats.thirdDown * 100, team2: team2Stats.thirdDown * 100, fullMark: 100 },
    { category: 'Turnover Margin', team1: (team1Stats.turnoverMargin + 1) * 50, team2: (team2Stats.turnoverMargin + 1) * 50, fullMark: 100 }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-2">Team Analysis & Comparison</h2>
        <p className="text-gray-300">CNN + Cosine Similarity Transformer Analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <label className="block text-sm font-medium text-gray-300 mb-2">Team 1</label>
          <select
            value={selectedTeam1}
            onChange={(e) => setSelectedTeam1(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {teams.map(team => (
              <option key={team} value={team} className="bg-slate-800">{team}</option>
            ))}
          </select>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <label className="block text-sm font-medium text-gray-300 mb-2">Team 2</label>
          <select
            value={selectedTeam2}
            onChange={(e) => setSelectedTeam2(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {teams.map(team => (
              <option key={team} value={team} className="bg-slate-800">{team}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Statistical Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="metric" stroke="#ffffff80" />
              <YAxis stroke="#ffffff80" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20' }} />
              <Legend />
              <Bar dataKey="team1" fill="#3b82f6" name={selectedTeam1.split(' ').pop()} />
              <Bar dataKey="team2" fill="#ef4444" name={selectedTeam2.split(' ').pop()} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Radar Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="category" stroke="#ffffff80" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#ffffff80" />
              <Radar
                name={selectedTeam1.split(' ').pop()}
                dataKey="team1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Radar
                name={selectedTeam2.split(' ').pop()}
                dataKey="team2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">{selectedTeam1}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Offense Rating</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">{team1Stats.offense}/100</span>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Defense Rating</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">{team1Stats.defense}/100</span>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Turnover Margin</span>
              <span className="text-white font-semibold">+{team1Stats.turnoverMargin.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Red Zone Efficiency</span>
              <span className="text-white font-semibold">{(team1Stats.redZone * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">3rd Down Conversion</span>
              <span className="text-white font-semibold">{(team1Stats.thirdDown * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Avg Time of Possession</span>
              <span className="text-white font-semibold">{team1Stats.timeOfPossession.toFixed(1)} min</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">{selectedTeam2}</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Offense Rating</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">{team2Stats.offense}/100</span>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Defense Rating</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">{team2Stats.defense}/100</span>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Turnover Margin</span>
              <span className="text-white font-semibold">+{team2Stats.turnoverMargin.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Red Zone Efficiency</span>
              <span className="text-white font-semibold">{(team2Stats.redZone * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">3rd Down Conversion</span>
              <span className="text-white font-semibold">{(team2Stats.thirdDown * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Avg Time of Possession</span>
              <span className="text-white font-semibold">{team2Stats.timeOfPossession.toFixed(1)} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamComparison


