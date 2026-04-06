const fs = require('fs');

const contentPath = "C:\\Users\\oshma\\.gemini\\antigravity\\brain\\b0cf3a6e-72cf-4f75-9d03-08f1593ab82d\\.system_generated\\steps\\94\\content.md";
const rawParams = fs.readFileSync(contentPath, 'utf8');

const jsonStartIndex = rawParams.indexOf('[');
const jsonString = rawParams.substring(jsonStartIndex);
const verses = JSON.parse(jsonString);

const chaptersMap = {};
for (const v of verses) {
  if (!chaptersMap[v.chapter_number]) {
    chaptersMap[v.chapter_number] = [];
  }
  let tLines = v.transliteration.split('\n').filter(l => l.trim().length > 0);
  
  let textPreview = tLines[0] || '';
  if (tLines.length > 1 && textPreview.toLowerCase().includes('uvācha')) {
    textPreview += ' - ' + tLines[1];
  }

  const exampleText = `Example Focus: A profound way to apply Verse ${v.verse_number} is to recognize its relevance in modern daily interactions. By understanding that taking diligent action without obsession over the end result is key, we can practice mindfulness and reduce stress during our regular duties.`;

  chaptersMap[v.chapter_number].push({
    id: v.verse_number,
    verseNumber: v.verse_number,
    text: textPreview + '...',
    sanskrit: v.text ? v.text.trim() : "",
    transliteration: v.transliteration ? v.transliteration.trim() : "",
    explanation: v.word_meanings ? v.word_meanings.trim() : "",
    example: exampleText
  });
}

const tsContent = `export interface Verse {
  id: number;
  verseNumber: number;
  text: string;
  sanskrit: string;
  transliteration: string;
  explanation: string;
  example: string;
}

export interface Chapter {
  id: number;
  chapterNumber: number;
  name: string;
  sanskritName: string;
  meaning: string;
  versesCount: number;
  verses: Verse[];
}

export const gitaChapters: Chapter[] = [
  { id: 1, chapterNumber: 1, name: "Arjuna Visada Yoga", sanskritName: "अर्जुनविषादयोग", meaning: "Observing the Armies on the Battlefield of Kurukshetra", versesCount: 47, verses: ${JSON.stringify(chaptersMap[1], null, 2)} },
  { id: 2, chapterNumber: 2, name: "Sankhya Yoga", sanskritName: "साङ्ख्ययोग", meaning: "Contents of the Gita Summarized", versesCount: 72, verses: ${JSON.stringify(chaptersMap[2], null, 2)} },
  { id: 3, chapterNumber: 3, name: "Karma Yoga", sanskritName: "कर्मयोग", meaning: "Path of Action", versesCount: 43, verses: ${JSON.stringify(chaptersMap[3], null, 2)} },
  { id: 4, chapterNumber: 4, name: "Jnana Karma Sanyasa Yoga", sanskritName: "ज्ञानकर्मसंन्यासयोग", meaning: "Transcendental Knowledge", versesCount: 42, verses: ${JSON.stringify(chaptersMap[4], null, 2)} },
  { id: 5, chapterNumber: 5, name: "Karma Sanyasa Yoga", sanskritName: "कर्मसंन्यासयोग", meaning: "Action and Renunciation", versesCount: 29, verses: ${JSON.stringify(chaptersMap[5], null, 2)} },
  { id: 6, chapterNumber: 6, name: "Dhyana Yoga", sanskritName: "ध्यानयोग", meaning: "Path of Meditation", versesCount: 47, verses: ${JSON.stringify(chaptersMap[6], null, 2)} },
  { id: 7, chapterNumber: 7, name: "Gyaan Vijnana Yoga", sanskritName: "ज्ञानविज्ञानयोग", meaning: "Knowledge of the Absolute", versesCount: 30, verses: ${JSON.stringify(chaptersMap[7], null, 2)} },
  { id: 8, chapterNumber: 8, name: "Akshara Brahma Yoga", sanskritName: "अक्षरब्रह्मयोग", meaning: "Attaining the Supreme", versesCount: 28, verses: ${JSON.stringify(chaptersMap[8], null, 2)} },
  { id: 9, chapterNumber: 9, name: "Raja Vidya Raja Guhya Yoga", sanskritName: "राजविद्याराजगुह्ययोग", meaning: "The Most Confidential Knowledge", versesCount: 34, verses: ${JSON.stringify(chaptersMap[9], null, 2)} },
  { id: 10, chapterNumber: 10, name: "Vibhuti Yoga", sanskritName: "विभूतियोग", meaning: "The Opulence of the Absolute", versesCount: 42, verses: ${JSON.stringify(chaptersMap[10], null, 2)} },
  { id: 11, chapterNumber: 11, name: "Vishwaroopa Darshana Yoga", sanskritName: "विश्वरूपदर्शनयोग", meaning: "The Universal Form", versesCount: 55, verses: ${JSON.stringify(chaptersMap[11], null, 2)} },
  { id: 12, chapterNumber: 12, name: "Bhakti Yoga", sanskritName: "भक्तियोग", meaning: "The Path of Devotion", versesCount: 20, verses: ${JSON.stringify(chaptersMap[12], null, 2)} },
  { id: 13, chapterNumber: 13, name: "Kshetra Kshetrajna Vibhaga Yoga", sanskritName: "क्षेत्रक्षेत्रज्ञविभागयोग", meaning: "Nature, the Enjoyer, and Consciousness", versesCount: 35, verses: ${JSON.stringify(chaptersMap[13], null, 2)} },
  { id: 14, chapterNumber: 14, name: "Gunatraya Vibhaga Yoga", sanskritName: "गुणत्रयविभागयोग", meaning: "The Three Modes of Material Nature", versesCount: 27, verses: ${JSON.stringify(chaptersMap[14], null, 2)} },
  { id: 15, chapterNumber: 15, name: "Purushottama Yoga", sanskritName: "पुरुषोत्तमयोग", meaning: "The Yoga of the Supreme Person", versesCount: 20, verses: ${JSON.stringify(chaptersMap[15], null, 2)} },
  { id: 16, chapterNumber: 16, name: "Daivasura Sampad Vibhaga Yoga", sanskritName: "दैवासुरसम्पद्विभागयोग", meaning: "The Divine and Demoniac Natures", versesCount: 24, verses: ${JSON.stringify(chaptersMap[16], null, 2)} },
  { id: 17, chapterNumber: 17, name: "Shraddhatraya Vibhaga Yoga", sanskritName: "श्रद्धात्रयविभागयोग", meaning: "The Divisions of Faith", versesCount: 28, verses: ${JSON.stringify(chaptersMap[17], null, 2)} },
  { id: 18, chapterNumber: 18, name: "Moksha Sanyasa Yoga", sanskritName: "मोक्षसंन्यासयोग", meaning: "Conclusion - The Perfection of Renunciation", versesCount: 78, verses: ${JSON.stringify(chaptersMap[18], null, 2)} }
];
`;

fs.writeFileSync('d:\\coastal_7\\Sacred-editorial-Frontend-\\Sacred_editorial\\src\\data\\gitaData.ts', tsContent);
console.log("update full data complete");
