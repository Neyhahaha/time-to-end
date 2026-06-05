import { useState, useEffect, useRef } from 'react';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isExpired: boolean;
  progress: number;
}

export function useCountdown(targetDate: string): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    return calc(target, now);
  });

  const initialRemainingRef = useRef(timeLeft.totalMs);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const now = Date.now();
    const initial = calc(target, now);
    initialRemainingRef.current = initial.totalMs > 0 ? initial.totalMs : 1;
    setTimeLeft(initial);
  }, [targetDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      setTimeLeft(calc(target, now, initialRemainingRef.current));
    }, 500);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function calc(target: number, now: number, initialMs?: number): TimeLeft {
  const remaining = target - now;

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isExpired: true, progress: 1 };
  }

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  let progress: number;
  if (initialMs && initialMs > 0) {
    progress = Math.min(1, Math.max(0, 1 - remaining / initialMs));
  } else {
    progress = Math.min(1, Math.max(0, 1 - remaining / (1000 * 60 * 60 * 24)));
  }

  return { days, hours, minutes, seconds, totalMs: remaining, isExpired: false, progress };
}

export function useNotifiedCountdowns() {
  const [notified, setNotified] = useState<Set<string>>(new Set());

  const markNotified = (id: string) => setNotified((prev) => new Set(prev).add(id));
  const isNotified = (id: string) => notified.has(id);

  return { isNotified, markNotified };
}
