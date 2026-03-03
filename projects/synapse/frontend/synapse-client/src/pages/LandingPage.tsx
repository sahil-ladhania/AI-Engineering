import { useState } from 'react'
import Logo from '../components/Logo'
import LoginModal from '../components/modals/LoginModal'
import SignupModal from '../components/modals/SignupModal'

type Modal = 'none' | 'login' | 'signup'

export default function LandingPage() {
  // State Variables
  const [modal, setModal] = useState<Modal>('none');

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#090d0f] text-[#e2ede9]">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <filter id="ambientBlur" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="40" />
            </filter>
            <linearGradient
              id="movingGradient"
              x1="0"
              y1="0"
              x2="800"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%"   stopColor="#10b981" stopOpacity="1" />
              <stop offset="50%"  stopColor="#10b981" stopOpacity="0" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="-800 0; 800 0; -800 0"
                keyTimes="0; 0.5; 1"
                dur="8s"
                repeatCount="indefinite"
              />
            </linearGradient>
          </defs>

          {/* Path 1 — top-right → bottom-left */}
          <path
            d="M640 60 Q400 60 400 300 Q400 540 160 540"
            stroke="url(#movingGradient)"
            strokeWidth="80"
            strokeLinecap="round"
            fill="none"
            opacity="0.06"
            filter="url(#ambientBlur)"
          />
          {/* Path 2 — top-left → bottom-right */}
          <path
            d="M160 180 Q400 180 400 360 Q400 540 640 540"
            stroke="url(#movingGradient)"
            strokeWidth="80"
            strokeLinecap="round"
            fill="none"
            opacity="0.06"
            filter="url(#ambientBlur)"
          />
        </svg>
      </div>

      {/* ── Nav ───────────────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
        <Logo size="md" />
        <button
          onClick={() => setModal('login')}
          className="text-[#475569] hover:text-[#e2ede9] text-sm transition-colors px-3 py-1.5 rounded-lg border border-transparent hover:border-[#1a2228]"
        >
          Open App
        </button>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-8 gap-6 md:gap-8 py-10">
        {/* Headline */}
        <div className="flex flex-col gap-3 max-w-xs sm:max-w-lg md:max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            <span className="text-[#e2ede9]">Think clearly. </span>
            <span style={{ color: '#10b981' }}>Ship faster.</span>
          </h1>
          <p className="text-[#475569] text-base sm:text-lg leading-relaxed font-light mx-auto" style={{ maxWidth: '480px' }}>
            A no-fluff AI workspace with real-time streaming,
            token tracking, and swappable system prompts.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <button
            onClick={() => setModal('signup')}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_#10b98144] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #10b981, #6ee7b7)' }}
          >
            Open Workspace →
          </button>
          <button
            onClick={() => setModal('login')}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl text-sm font-medium text-[#e2ede9] border border-[#1a2228] hover:border-[#10b981] transition-all active:scale-[0.98]"
            style={{ background: '#0f1519' }}
          >
            See how it works
          </button>
        </div>

        {/* Feature chips */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">

          {/* Real-time streaming */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#1a2228] text-[#475569] text-xs sm:text-sm" style={{ background: '#0f1519' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>Real-time streaming</span>
          </div>

          {/* Token + cost tracking */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#1a2228] text-[#475569] text-xs sm:text-sm" style={{ background: '#0f1519' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Token + cost tracking</span>
          </div>

          {/* System prompt switching */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#1a2228] text-[#475569] text-xs sm:text-sm" style={{ background: '#0f1519' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            <span>System prompt switching</span>
          </div>

        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="relative z-10 flex items-center justify-center gap-3 py-5 sm:py-6">
        <Logo size="sm" showText={false} />
        <span className="text-[#1a2228]">|</span>
        <p className="text-[#475569] text-xs">© 2026 Synapse. Built for thinkers.</p>
      </footer>

      {/* Modals */}
      <LoginModal
        open={modal === 'login'}
        onClose={() => setModal('none')}
        onSwitchToSignup={() => setModal('signup')}
      />
      <SignupModal
        open={modal === 'signup'}
        onClose={() => setModal('none')}
        onSwitchToLogin={() => setModal('login')}
      />
    </div>
  )
}
