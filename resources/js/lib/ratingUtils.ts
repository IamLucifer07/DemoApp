// resources/js/lib/ratingUtils.ts
import type { Sector } from '@/types'; // Assuming you have a Sector type

export type RatingRange = {
    best: number;
    better: [number, number];
    good: [number, number];
    neutral: [number, number];
    weak: [number, number];
    worst: number;
};

export const RatingRanges: Record<string, Record<string, RatingRange>> = {
    cashRatio: {
        "Commercial Banks": {
        best: 0.5,better: [0.3, 0.5],good: [0.2, 0.3],neutral: [0.1, 0.2],weak: [0.05, 0.1],worst: 0.05
        },
        "Development Banks": {
        best: 0.7,better: [0.5, 0.7],good: [0.3, 0.5],neutral: [0.2, 0.3],weak: [0.1, 0.2],worst: 0.1
        },
        "Finance": {
        best: 0.7,better: [0.5, 0.7],good: [0.3, 0.5],neutral: [0.2, 0.3],weak: [0.1, 0.2],worst: 0.1
        },
        "Hydro Power": {
        best: 0.8,better: [0.6, 0.8],good: [0.4, 0.6],neutral: [0.2, 0.4],weak: [0.1, 0.2],worst: 0.1
        },
        "Non Life Insurance": {
        best: 1.2,better: [0.9, 1.2],good: [0.6, 0.9],neutral: [0.4, 0.6],weak: [0.2, 0.4],worst: 0.2
        },
        "Life Insurance": {
        best: 0.9,better: [0.7, 0.9],good: [0.5, 0.7],neutral: [0.3, 0.5],weak: [0.1, 0.3],worst: 0.1
        },
        "Manufacturing And Processing": {
        best: 0.6,better: [0.4, 0.6],good: [0.3, 0.4],neutral: [0.2, 0.3],weak: [0.1, 0.2],worst: 0.1
        },
        "Tradings": {
        best: 0.5,better: [0.3, 0.5],good: [0.2, 0.3],neutral: [0.1, 0.2],weak: [0.05, 0.1],worst: 0.05
        },
        "Hotels And Tourism": {
        best: 0.7,better: [0.5, 0.7],good: [0.3, 0.5],neutral: [0.2, 0.3],weak: [0.1, 0.2],worst: 0.1
        },
        "Microfinance": {
        best: 0.4,better: [0.3, 0.4],good: [0.2, 0.3],neutral: [0.1, 0.2],weak: [0.05, 0.1],worst: 0.05
        },
        "Investment": {
        best: 1.5,better: [1.0, 1.5],good: [0.7, 1.0],neutral: [0.5, 0.7],weak: [0.3, 0.5],worst: 0.3
        },
        "Others": {
        best: 0.6,better: [0.4, 0.6],good: [0.3, 0.4],neutral: [0.2, 0.3],weak: [0.1, 0.2],worst: 0.1
        }
    },
    // Add other metrics...
};

export const getRating = (value: number | null, metric: string, sectorId: string): string => {
    if (value === null) return 'N/A';
    
    const sectorName = getSectorName(sectorId); // Implement this or pass sectorName directly
    const ranges = RatingRanges[metric]?.[sectorName];
    
    if (!ranges) return 'N/A';
    
    if (value >= ranges.best) return 'Best';
    if (value >= ranges.better[0]) return 'Better';
    if (value >= ranges.good[0]) return 'Good';
    if (value >= ranges.neutral[0]) return 'Neutral';
    if (value >= ranges.weak[0]) return 'Weak';
    return 'Worst';
};

// Helper function (or use your existing sector mapping)
const getSectorName = (sectorId: string): string => {
    const sectorMap: Record<string, string> = {
        "37": "Commercial Banks",
        "44": "Development Banks",
        "45": "Finance",
        "49": "Microfinance",
        "43": "Non Life Insurance",
        "50": "Life Insurance",
        "41": "Hydro Power",
        "39": "Hotels And Tourism",
        "38": "Manufacturing And Processing",
        "42": "Tradings",
        "67": "Investment",
        "40": "Others"
    };
    return sectorMap[sectorId] || 'Others';
};