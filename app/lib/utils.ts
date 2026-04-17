import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function readingTime(rawContent: string): number {
  const text = rawContent
    .replace(/^---[\s\S]*?---/, '')    // strip frontmatter
    .replace(/<[^>]+>/g, '')           // strip JSX/HTML tags
    .replace(/```[\s\S]*?```/g, '')    // strip code blocks
    .replace(/[#*`_[\]()>!]/g, '');    // strip markdown symbols
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
