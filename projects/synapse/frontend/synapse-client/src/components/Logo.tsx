interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const svgSizes = {
  sm: 28,
  md: 36,
  lg: 48,
}

const textSizes = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const px = svgSizes[size]

  return (
    <div className="flex items-center gap-2">
      <svg
        width={px}
        height={px}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30 12 Q22 12 22 20 Q22 28 14 28"
          stroke="#10b981"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M14 16 Q22 16 22 22 Q22 28 30 28"
          stroke="#6ee7b7"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx="30" cy="12" r="3" fill="#10b981" />
        <circle cx="14" cy="28" r="3" fill="#10b981" />
        <circle cx="14" cy="16" r="2" fill="#6ee7b7" opacity="0.8" />
        <circle cx="30" cy="28" r="2" fill="#6ee7b7" opacity="0.8" />
      </svg>
      {showText && (
        <span className={`${textSizes[size]} tracking-[0.15em] font-light text-[#e2ede9]`}>
          synapse
        </span>
      )}
    </div>
  )
}
