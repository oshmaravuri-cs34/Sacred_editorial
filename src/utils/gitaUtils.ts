import { gitaChapters, Chapter, Verse } from '../data/gitaData';

/**
 * Calculates the Sloka of the Day based on the current date.
 * The sequence follows the chapter-wise order of the Gita.
 * @returns An object containing the chapter and verse for today.
 */
export const getSlokaOfTheDay = (): { chapter: Chapter; verse: Verse } => {
  // Flatten all verses into a single ordered list with their parent chapter
  const allVerses: { chapter: Chapter; verse: Verse }[] = [];
  
  gitaChapters.forEach(chapter => {
    chapter.verses.forEach(verse => {
      allVerses.push({ chapter, verse });
    });
  });

  const TOTAL_VERSES = allVerses.length;
  if (TOTAL_VERSES === 0) {
    // Fallback in case data is empty
    return { chapter: gitaChapters[0], verse: gitaChapters[0].verses[0] };
  }

  // Reference date: Jan 1, 2024 (ensures everyone is in sync)
  const startDate = new Date('2024-01-01T00:00:00Z');
  const today = new Date();
  
  // Calculate full days passed since start date
  const diffTime = Math.max(0, today.getTime() - startDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Cycle through verses sequentially
  const index = diffDays % TOTAL_VERSES;
  
  return allVerses[index];
};
