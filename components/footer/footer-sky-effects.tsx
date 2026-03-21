'use client';

import { motion } from 'framer-motion';

type FooterSkyEffectsProps = {
  shouldAnimate: boolean;
};

const Sun = ({ shouldAnimate }: { shouldAnimate: boolean }) => (
  <motion.div
    initial={{ y: -40, opacity: 0, scale: 0.92 }}
    animate={
      shouldAnimate
        ? { y: [0, -4, 0], opacity: 1, scale: 1 }
        : { y: -40, opacity: 0, scale: 0.92 }
    }
    transition={
      shouldAnimate
        ? {
            delay: 1,
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
            y: {
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }
        : { duration: 0.2 }
    }
    className="absolute left-8 sm:left-12 md:left-16 -top-12.5 sm:-top-10.5 md:-top-11.5 w-24 h-24 md:w-28 md:h-28 pointer-events-none z-0"
  >
    <div className="relative w-full h-full">
      <div className="absolute inset-0 rounded-full bg-yellow-300 blur-2xl opacity-18" />
      <svg className={`w-full h-full ${shouldAnimate ? 'animate-spin-slow' : ''}`} viewBox="0 0 100 100">
        <g className="origin-center">
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="5"
              x2="50"
              y2="20"
              stroke="#facc15"
              strokeWidth="2"
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
        </g>
        <circle cx="50" cy="50" r="20" fill="#fde047" />
      </svg>
    </div>
  </motion.div>
);

const ForegroundCloud = ({ left, top, scale = 1, delay = 0 }: { left: string; top: string; scale?: number; delay?: number }) => (
  <motion.div
    initial={{ x: 120, opacity: 0 }}
    whileInView={{ x: 0, opacity: 0.9 }}
    viewport={{ once: true }}
    transition={{ duration: 1.2, delay, ease: 'easeOut' }}
    className="absolute pointer-events-none z-20"
    style={{ left, top, scale }}
  >
    <motion.div animate={{ x: [0, -8, 0], y: [0, -4, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="210" height="110" viewBox="0 0 180 80" fill="white" className="filter blur-[0.7px] opacity-95 drop-shadow-xl">
        <path d="M25 60C25 48.954 33.954 40 45 40C48.909 40 52.542 41.149 55.6 43.137C59.172 34.381 67.83 28 78 28C89.598 28 99.373 36.09 101.6 47.038C104.18 45.754 107.04 45 110 45C119.389 45 127 52.611 127 62H25Z" fillOpacity="0.88" />
      </svg>
    </motion.div>
  </motion.div>
);

const Sparkle = ({ x, y, delay }: { x: string; y: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    whileInView={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
    viewport={{ once: false }}
    transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: Math.random() * 5 }}
    className="absolute w-1 h-1 bg-white rounded-full blur-[1px] z-0"
    style={{ left: x, top: y }}
  />
);

const Cloud = ({ delay = 0, duration = 20, size = 1, opacity = 0.8, x = 0, y = 0 }) => (
  <motion.div
    initial={{ x: 240, opacity: 0 }}
    whileInView={{ x: 0, opacity }}
    viewport={{ once: true }}
    transition={{ duration: 1.5, delay, ease: 'easeOut' }}
    className="absolute pointer-events-none z-10"
    style={{ right: `${x}%`, top: `${y}%`, scale: size }}
  >
    <motion.div animate={{ x: [0, -22, 0, -10, 0], y: [0, -9, -2, -11, 0] }} transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="260" height="130" viewBox="0 0 180 80" fill="white" className="filter blur-[1px] opacity-95 drop-shadow-2xl">
        <path d="M25 60C25 48.954 33.954 40 45 40C48.909 40 52.542 41.149 55.6 43.137C59.172 34.381 67.83 28 78 28C89.598 28 99.373 36.09 101.6 47.038C104.18 45.754 107.04 45 110 45C119.389 45 127 52.611 127 62H25Z" fillOpacity="0.8" />
      </svg>
    </motion.div>
  </motion.div>
);

export function FooterSkyEffects({ shouldAnimate }: FooterSkyEffectsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
      <Sun shouldAnimate={shouldAnimate} />
      <ForegroundCloud left="2%" top="7%" scale={0.78} delay={0.2} />
      <ForegroundCloud left="9%" top="12%" scale={0.95} delay={0.45} />
      <Sparkle x="15%" y="20%" delay={0.5} />
      <Sparkle x="85%" y="15%" delay={1.2} />
      <Sparkle x="70%" y="35%" delay={0.8} />
      <Sparkle x="25%" y="50%" delay={2.1} />
      <Sparkle x="90%" y="60%" delay={1.5} />
      <Cloud x={2} y={14} size={1.1} delay={0.4} duration={30} opacity={0.62} />
      <Cloud x={-8} y={38} size={1.35} delay={0.8} duration={24} opacity={0.5} />
      <Cloud x={8} y={63} size={1} delay={1.2} duration={28} opacity={0.58} />
    </div>
  );
}
