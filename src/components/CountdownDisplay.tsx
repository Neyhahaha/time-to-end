import { useCountdown } from '@/hooks/useCountdown';
import type { Countdown } from '@/store/countdownStore';

interface CountdownDisplayProps {
  countdown: Countdown;
}

export default function CountdownDisplay({ countdown }: CountdownDisplayProps) {
  const timeLeft = useCountdown(countdown.targetDate, countdown.createdAt);
  const { days, hours, minutes, seconds, isExpired, progress } = timeLeft;

  const radius = typeof window !== 'undefined' && window.innerWidth < 480 ? 100 : window.innerWidth < 768 ? 120 : 140;
  const strokeWidth = typeof window !== 'undefined' && window.innerWidth < 480 ? 4 : 6;
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 480 && window.innerWidth < 768;

  const containerSize = isMobile ? 220 : isTablet ? 280 : 320;
  const dayFontSize = isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-6xl';
  const unitFontSize = isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl';
  const colonFontSize = isMobile ? 'text-xl' : isTablet ? 'text-2xl' : 'text-3xl';
  const titleFontSize = isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl';
  const dateFontSize = isMobile ? 'text-xs' : 'text-sm';

  return (
    <div className="relative flex flex-col items-center justify-center animate-fade-in w-full">
      <div
        className="relative flex items-center justify-center"
        style={{ width: containerSize, height: containerSize }}
      >
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
              <span className={`${isMobile ? 'text-3xl' : 'text-4xl'} animate-pulse-glow`} style={{ color: accentColor }}>
                ✦
              </span>
              <span className={`font-display ${isMobile ? 'text-base' : 'text-xl'} font-semibold`} style={{ color: accentColor }}>
                已到达
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {days > 0 && (
                <div className="flex items-baseline gap-0.5 mb-0.5">
                  <span className={`digit-font ${dayFontSize} font-bold`} style={{ color: accentColor }}>
                    {days}
                  </span>
                  <span className={`font-body ${isMobile ? 'text-xs' : 'text-sm'}`} style={{ color: 'var(--text-secondary)' }}>
                    天
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 sm:gap-2">
                <TimeUnit value={days > 0 ? pad(hours) : String(hours)} label="时" accentColor={accentColor} fontSize={unitFontSize} labelSize={isMobile ? 'text-[10px]' : 'text-xs'} />
                <span className={`digit-font ${colonFontSize} font-bold animate-pulse-glow`} style={{ color: accentColor }}>
                  :
                </span>
                <TimeUnit value={pad(minutes)} label="分" accentColor={accentColor} fontSize={unitFontSize} labelSize={isMobile ? 'text-[10px]' : 'text-xs'} />
                <span className={`digit-font ${colonFontSize} font-bold animate-pulse-glow`} style={{ color: accentColor }}>
                  :
                </span>
                <TimeUnit value={pad(seconds)} label="秒" accentColor={accentColor} fontSize={unitFontSize} labelSize={isMobile ? 'text-[10px]' : 'text-xs'} />
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className={`font-display ${titleFontSize} font-semibold mt-3 sm:mt-4 text-center max-w-[240px] sm:max-w-xs truncate px-2`}>
        {countdown.title}
      </h2>
      <p className={`font-body ${dateFontSize} mt-1 text-center px-2`} style={{ color: 'var(--text-secondary)' }}>
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

function TimeUnit({ value, label, accentColor, fontSize = 'text-5xl', labelSize = 'text-xs' }: { value: string; label: string; accentColor: string; fontSize?: string; labelSize?: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`digit-font ${fontSize} font-bold`} style={{ color: accentColor }}>
        {value}
      </span>
      <span className={`font-body ${labelSize} mt-0.5`} style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </div>
  );
}
