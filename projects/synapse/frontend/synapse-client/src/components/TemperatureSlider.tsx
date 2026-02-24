import type { TemperatureSliderProps } from '../types/sidebar'

export default function TemperatureSlider({ value, onChange }: TemperatureSliderProps) {
  const pct = value * 100

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[#475569] text-[11px] uppercase tracking-wider font-medium">
          Temperature
        </label>
        <span className="text-[#e2ede9] text-xs font-medium tabular-nums">{value.toFixed(1)}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="violet-slider w-full"
          style={{
            background: `linear-gradient(to right, #6ee7b7 0%, #10b981 ${pct}%, #1a2228 ${pct}%, #1a2228 100%)`,
          }}
        />
      </div>
    </div>
  )
}
