"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

function format(value: number, prefix: string, suffix: string): string {
  return `${prefix}${Math.round(value).toLocaleString("en-GB")}${suffix}`;
}

/**
 * Renders the correct final value as real server-rendered text immediately
 * -- no JS, delayed hydration, failed animation library, reduced-motion, and
 * crawlers all see the right number with zero layout shift. The count-up
 * from 0 is a progressive-enhancement overlay applied only after the
 * component mounts, is in view, and the visitor hasn't asked for reduced
 * motion.
 */
export function AnimatedCounter({ value, prefix = "", suffix = "", className, duration = 1.4 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView && !prefersReducedMotion) motionValue.set(value);
  }, [inView, motionValue, value, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    return spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = format(latest, prefix, suffix);
    });
  }, [spring, prefix, suffix, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {format(value, prefix, suffix)}
    </span>
  );
}
