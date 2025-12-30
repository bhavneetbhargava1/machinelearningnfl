import { useState } from 'react'
import { Clock } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const Dashboard = () => {
  const [predictions] = useState([
    {
      id: 1,
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'Buffalo Bills',
      homeWinProb: 0.65,
      awayWinProb: 0.35,
      predictedScore: { home: 28, away: 24 },
      confidence: 0.82,
      time: '2024-01-15 8:00 PM',
      status: 'upcoming',
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
      status: 'upcoming',
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
      status: 'completed',
    },
  ])

  const winProbData = predictions.map((pred) => ({
    name: `${pred.awayTeam.split(' ').pop()} @ ${pred.homeTeam.split(' ').pop()}`,
    homeProb: (pred.homeWinProb * 100).toFixed(1),
    awayProb: (pred.awayWinProb * 100).toFixed(1),
  }))

  const pieData = predictions[0]
    ? [
        { name: predictions[0].homeTeam.split(' ').pop(), value: predictions[0].homeWinProb * 100 },
        { name: predictions[0].awayTeam.split(' ').pop(), value: predictions[0].awayWinProb * 100 },
      ]
    : []

  const COLORS = ['#3b82f6', '#ef4444']

  const [rotation, setRotation] = useState({ x: -12, y: 18 })

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = event.clientX
    const mouseY = event.clientY

    const normalizedX = (mouseX - centerX) / (rect.width / 2)
    const normalizedY = (mouseY - centerY) / (rect.height / 2)

    const maxTiltX = 18
    const maxTiltY = 28

    const rotateY = normalizedX * maxTiltY
    const rotateX = -normalizedY * maxTiltX - 8

    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: -12, y: 18 })
  }

  return (
    <div className="relative flex flex-col lg:flex-row items-stretch gap-8 h-[calc(100vh-6rem)]">
      {/* Left column: key metrics & charts */}
      <div className="hidden lg:flex flex-col justify-between w-[32%] space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
          <h2 className="text-sm font-semibold tracking-widest text-blue-300 uppercase mb-1">
            Machine Learning Edge
          </h2>
          <p className="text-xl font-semibold text-white">
            Real-time NFL win probabilities, driven by play-by-play context.
          </p>
        </div>

        <div className="bg-black/25 backdrop-blur-md rounded-2xl p-5 border border-white/10">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Portfolio View</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={winProbData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="homeProb"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
                name="Home Win %"
              />
              <Line
                type="monotone"
                dataKey="awayProb"
                stroke="#f97373"
                strokeWidth={2}
                dot={false}
                name="Away Win %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-black/25 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex-1 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Current Anchor Game</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Center: 3D-style football hub */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="relative w-full max-w-[560px] h-full flex flex-col items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Stage glow */}
          <div className="absolute inset-x-10 bottom-16 h-44 bg-gradient-radial from-blue-500/40 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-sky-500/40 to-transparent" />

          {/* Football container */}
          <button
            type="button"
            className="relative z-10 w-[520px] max-w-[92vw] aspect-[2/1] flex items-center justify-center focus:outline-none group"
            style={{ perspective: '1400px' }}
          >
            <div
              className="relative w-full h-full transition-transform duration-200 ease-out will-change-transform"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              }}
            >
              {/* Subtle back-shadow to sell depth */}
              <div
                className="absolute inset-0"
                style={{
                  transform: 'translateZ(-18px)',
                  filter: 'blur(10px)',
                  opacity: 0.55,
                  background:
                    'radial-gradient(closest-side at 50% 55%, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)',
                }}
              />

              {/* Realistic football drawn as SVG (symmetric + centered) */}
              <div
                className="absolute inset-0"
                style={{
                  transform: 'translateZ(18px)',
                  filter: 'drop-shadow(0 22px 38px rgba(0,0,0,0.70))',
                }}
              >
                <svg
                  viewBox="0 0 520 260"
                  className="w-full h-full"
                  aria-label="3D football"
                >
                  <defs>
                    {/* Leather shading */}
                    <radialGradient id="leatherGlow" cx="32%" cy="28%" r="70%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
                      <stop offset="38%" stopColor="rgba(255,255,255,0.05)" />
                      <stop offset="72%" stopColor="rgba(0,0,0,0.35)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.65)" />
                    </radialGradient>

                    <linearGradient id="leatherBase" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b4a1e" />
                      <stop offset="45%" stopColor="#6d3514" />
                      <stop offset="100%" stopColor="#3a1a07" />
                    </linearGradient>

                    {/* Pebble texture */}
                    <filter id="pebble" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="2"
                        seed="7"
                        result="noise"
                      />
                      <feColorMatrix
                        in="noise"
                        type="matrix"
                        values="
                          1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 0.22 0"
                        result="alphaNoise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="2.2"
                        xChannelSelector="R"
                        yChannelSelector="G"
                      />
                      <feComposite in2="alphaNoise" operator="over" />
                    </filter>

                    {/* Specular highlight */}
                    <radialGradient id="spec" cx="28%" cy="18%" r="55%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                      <stop offset="35%" stopColor="rgba(255,255,255,0.10)" />
                      <stop offset="70%" stopColor="rgba(255,255,255,0.02)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>

                    {/* Seam / stitching color */}
                    <linearGradient id="seam" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0.55)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>

                    {/* Shadow vignette */}
                    <radialGradient id="vignette" cx="55%" cy="58%" r="75%">
                      <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                      <stop offset="68%" stopColor="rgba(0,0,0,0.18)" />
                      <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
                    </radialGradient>
                  </defs>

                  {/* Football silhouette (symmetric, pointed ends) */}
                  <path
                    d="M 24 130
                       C 64 44 168 16 260 16
                       C 352 16 456 44 496 130
                       C 456 216 352 244 260 244
                       C 168 244 64 216 24 130 Z"
                    fill="url(#leatherBase)"
                  />

                  {/* Base shading + texture (clipped by same silhouette) */}
                  <g filter="url(#pebble)">
                    <path
                      d="M 24 130
                         C 64 44 168 16 260 16
                         C 352 16 456 44 496 130
                         C 456 216 352 244 260 244
                         C 168 244 64 216 24 130 Z"
                      fill="url(#leatherGlow)"
                    />
                  </g>

                  {/* Vignette for depth */}
                  <path
                    d="M 24 130
                       C 64 44 168 16 260 16
                       C 352 16 456 44 496 130
                       C 456 216 352 244 260 244
                       C 168 244 64 216 24 130 Z"
                    fill="url(#vignette)"
                    opacity="0.9"
                  />

                  {/* White stripes (perfectly symmetric around center=260) */}
                  <g opacity="0.96">
                    <rect
                      x="92"
                      y="54"
                      width="34"
                      height="152"
                      rx="18"
                      fill="rgba(255,255,255,0.95)"
                    />
                    <rect
                      x="394"
                      y="54"
                      width="34"
                      height="152"
                      rx="18"
                      fill="rgba(255,255,255,0.95)"
                    />
                    {/* Stripe inner shadow */}
                    <rect
                      x="92"
                      y="54"
                      width="34"
                      height="152"
                      rx="18"
                      fill="rgba(0,0,0,0.06)"
                      transform="translate(2 3)"
                      opacity="0.35"
                    />
                    <rect
                      x="394"
                      y="54"
                      width="34"
                      height="152"
                      rx="18"
                      fill="rgba(0,0,0,0.06)"
                      transform="translate(2 3)"
                      opacity="0.35"
                    />
                  </g>

                  {/* Center seam line + stitches */}
                  <g>
                    <path
                      d="M 96 130 C 170 128 220 128 260 130 C 300 132 350 132 424 130"
                      stroke="rgba(0,0,0,0.55)"
                      strokeWidth="2"
                      opacity="0.55"
                    />
                    <path
                      d="M 105 130 C 175 128 222 128 260 130 C 298 132 345 132 415 130"
                      stroke="url(#seam)"
                      strokeWidth="2"
                      strokeDasharray="6 10"
                      strokeLinecap="round"
                      opacity="0.65"
                    />
                  </g>

                  {/* Lace panel (centered) */}
                  <g>
                    <ellipse
                      cx="260"
                      cy="108"
                      rx="98"
                      ry="34"
                      fill="rgba(245,246,248,0.96)"
                      opacity="0.95"
                    />
                    <ellipse
                      cx="260"
                      cy="108"
                      rx="98"
                      ry="34"
                      fill="rgba(0,0,0,0.10)"
                      transform="translate(3 4)"
                      opacity="0.25"
                    />

                    {/* Lace strip */}
                    <rect
                      x="238"
                      y="88"
                      width="44"
                      height="40"
                      rx="20"
                      fill="rgba(255,255,255,0.98)"
                    />

                    {/* Cross stitches (symmetric + centered) */}
                    {Array.from({ length: 7 }).map((_, i) => {
                      const y = 94 + i * 5
                      return (
                        <g key={i} opacity="0.85">
                          <rect
                            x="216"
                            y={y}
                            width="88"
                            height="3"
                            rx="2"
                            fill="rgba(203,213,225,0.92)"
                          />
                          <rect
                            x="216"
                            y={y}
                            width="88"
                            height="3"
                            rx="2"
                            fill="rgba(0,0,0,0.12)"
                            transform="translate(1 1)"
                            opacity="0.35"
                          />
                        </g>
                      )
                    })}
                  </g>

                  {/* Specular highlight for “real” look */}
                  <path
                    d="M 34 130
                       C 76 58 170 26 260 26
                       C 316 26 368 38 410 60
                       C 326 52 250 60 190 86
                       C 128 112 84 152 66 190
                       C 48 172 36 152 34 130 Z"
                    fill="url(#spec)"
                    opacity="0.95"
                  />

                  {/* Edge rim highlight */}
                  <path
                    d="M 24 130
                       C 64 44 168 16 260 16
                       C 352 16 456 44 496 130"
                    fill="none"
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth="2"
                    opacity="0.65"
                  />
                </svg>
              </div>
            </div>
          </button>

          {/* Context ring / labels around ball */}
          <div className="relative z-0 mt-6 grid grid-cols-3 gap-4 w-full max-w-[520px]">
            <div className="bg-black/35 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-sky-300/80">Model</p>
              <p className="text-sm text-slate-200">
                CNN + similarity transformer builds team style embeddings.
              </p>
            </div>
            <div className="bg-black/35 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-emerald-300/80">Engine</p>
              <p className="text-sm text-slate-200">
                Markov chain decision tree simulates 4 quarters of state.
              </p>
            </div>
            <div className="bg-black/35 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-amber-300/80">Edge</p>
              <p className="text-sm text-slate-200">
                Surfaces mispriced lines vs. market-implied probabilities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column: upcoming games list */}
      <div className="w-full lg:w-[32%] flex flex-col space-y-4 max-h-full overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300/70">Live Board</p>
            <h2 className="text-lg font-semibold text-white">Upcoming game projections</h2>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300/80">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Play-by-play context</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {predictions
            .filter((p) => p.status === 'upcoming')
            .map((prediction) => (
              <div
                key={prediction.id}
                className="bg-black/30 border border-white/10 rounded-2xl px-4 py-3 hover:border-sky-400/60 hover:bg-black/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    {prediction.time}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[11px] font-medium text-sky-200 border border-sky-500/40">
                    {Math.round(prediction.confidence * 100)}% model confidence
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">Away</p>
                    <p className="text-sm font-semibold text-white">{prediction.awayTeam}</p>
                    <p className="text-base font-semibold text-rose-300">
                      {prediction.predictedScore.away}
                    </p>
                  </div>
                  <div className="px-3 text-center">
                    <p className="text-[11px] text-slate-400">Spread</p>
                    <p className="text-sm font-semibold text-slate-100">–</p>
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">Home</p>
                    <p className="text-sm font-semibold text-white">{prediction.homeTeam}</p>
                    <p className="text-base font-semibold text-sky-300">
                      {prediction.predictedScore.home}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 transition-all"
                        style={{ width: `${prediction.awayWinProb * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Away win: {(prediction.awayWinProb * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-sky-500 transition-all"
                        style={{ width: `${prediction.homeWinProb * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400 text-right">
                      Home win: {(prediction.homeWinProb * 100).toFixed(1)}%
                    </p>
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
