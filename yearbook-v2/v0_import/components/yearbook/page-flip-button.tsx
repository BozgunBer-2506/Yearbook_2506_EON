"use client"

interface PageFlipButtonProps {
  onFlipNext: () => void
  onFlipPrev: () => void
}

export function PageFlipButton({ onFlipNext, onFlipPrev }: PageFlipButtonProps) {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col items-center gap-2">
      {/* Navigation buttons */}
      <div className="flex gap-2">
        <button
          onClick={onFlipPrev}
          className="group relative p-2 rounded-full"
          aria-label="Previous page"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity" />
          
          <div className="relative w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400/60 transition-colors">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>

        <button
          onClick={onFlipNext}
          className="group relative p-2 rounded-full"
          aria-label="Next page"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-50 blur transition-opacity" />
          
          <div className="relative w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center group-hover:border-purple-400/60 transition-colors">
            {/* Fingerprint icon */}
            <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v4M7.5 12c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.5 12a6.5 6.5 0 1113 0" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.5 12a2.5 2.5 0 015 0v2" />
            </svg>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border border-purple-400/30 animate-ping opacity-20" />
          </div>
        </button>
      </div>

      {/* Label */}
      <p className="text-xs text-slate-500 tracking-wider uppercase">
        Touch to flip page
      </p>
    </div>
  )
}
