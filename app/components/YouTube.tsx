import React from 'react';

interface YouTubeProps {
  id: string;
  title?: string;
  start?: number;
}

export default function YouTube({
  id,
  title = 'YouTube Video Player',
  start,
}: YouTubeProps) {
  const baseUrl = `https://www.youtube.com/embed/${id}`;
  const params = new URLSearchParams();
  if (start) {
    params.append('start', start.toString());
  }
  const queryString = params.toString();
  const src = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 not-prose my-8">
      <iframe
        className="absolute top-0 left-0 h-full w-full"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
