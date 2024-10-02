"use client";

import { useFont } from './FontContext';
import React from 'react';

export default function FontWrapper({ children }: { children: React.ReactNode }) {
  const { font, fontSize } = useFont();

  return <div className={`${font} ${fontSize} min-h-screen`}>{children}</div>;
}
