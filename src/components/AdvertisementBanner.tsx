
"use client";

import type { HTMLAttributes } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card'; // Using Card for consistent styling

export interface AdItem {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl: string;
  imageHint: string;
}

interface AdvertisementBannerProps extends HTMLAttributes<HTMLDivElement> {
  ads: AdItem[];
  interval?: number; // in milliseconds
}

const AdvertisementBanner = ({ ads, interval = 5000, className, ...props }: AdvertisementBannerProps) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, interval);

    return () => clearInterval(timer);
  }, [ads, interval]);

  if (!ads || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  return (
    <Card className={cn("w-full overflow-hidden shadow-md", className)} {...props}>
      <Link href={currentAd.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative aspect-[3/1] w-full sm:aspect-[4/1] md:aspect-[5/1]">
          <Image
            src={currentAd.imageUrl}
            alt={currentAd.altText}
            fill
            className="object-cover transition-opacity duration-500 ease-in-out"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={currentAdIndex === 0} // Prioritize loading the first ad
            data-ai-hint={currentAd.imageHint}
          />
           <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Ad
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default AdvertisementBanner;
