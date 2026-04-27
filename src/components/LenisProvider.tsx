"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import React from "react";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>{children as any}</ReactLenis>;
}