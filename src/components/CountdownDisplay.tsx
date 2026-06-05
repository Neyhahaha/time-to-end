import { useCountdown } from '@/hooks/useCountdown';
import type { Countdown } from '@/store/countdownStore';

interface CountdownDisplayProps {
  countdown: Countdown;
}

export default function CountdownDisplay({ countdown }: CountdownDisplayProps) {
  const timeLeft = useCountdown(countdown.targetDate, countdown.createdAt);
  const { days, hours, minutes, seconds, isExpired, progress } = timeLeft;

  const radius = 140;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = progress * circumference;

  const colorMap: Record<string, string> = {
    coral: '#FF6B6B',
    mint: '#4ECDC4',
    amber: '#F59E0B',
    violet: '#8B5CF6',
    sky: '#0EA5E9',
    rose: '#F43F5E',
  };
  const accentColor = colorMap[countdown.color] || colorMap.coral;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="relative flex flex-col items-center justify-center animate-fade-in w-full">
      <div className="countdown-ring relative flex items-center justify-center w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px]">
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        >
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke={accentColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 8px ${accentColor}66)`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
          {isExpired ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl sm:text-4xl animate-pulse-glow" style={{ color: accentColor }}>
                ✦
              </span>
              <span className="font-display text-base sm:text-xl font-semibold" style={{ color: accentColor }}>
                已到达
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {days > 0 && (
                <div className="flex items-baseline gap-0.5 mb-0.5">
                  <span className="digit-font text-3xl sm:text-5xl lg:text-6xl font-bold" style={{ color: accentColor }}>
                    {days}
                  </span>
                  <span className="font-body text-[10px] sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
                    天
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 sm:gap-2">
                <TimeUnit value={days > 0 ? pad(hours) : String(hours)} label="时" accentColor={accentColor} />
                <span className="digit-font text-lg sm:text-2xl lg:text-3xl font-bold animate-pulse-glow" style={{ color: accentColor }}>
                  :
                </span>
                <TimeUnit value={pad(minutes)} label="分" accentColor={accentColor} />
                <span className="digit-font text-lg sm:text-2xl lg:text-3xl font-bold animate-pulse-glow" style={{ color: accentColor }}>
                  :
                </span>
                <TimeUnit value={pad(seconds)} label="秒" accentColor={accentColor} />
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className="font-display text-lg sm:text-xl lg:text-2xl font-semibold mt-3 sm:mt-4 text-center max-w-[240px] sm:max-w-xs truncate px-2">
        {countdown.title}
      </h2>
      <p className="font-body text-xs sm:text-sm mt-1 text-center px-2" style={{ color: 'var(--text-secondary)' }}>
        {new Date(countdown.targetDate).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })}
      </p>
    </div>
  );
}

function TimeUnit({ value, label, accentColor }: { value: string; label: string; accentColor: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="digit-font text-2xl sm:text-4xl lg:text-5xl font-bold" style={{ color: accentColor }}>
        {value}
      </span>
      <span className="font-body text-[10px] sm:text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </div>
  );
}
