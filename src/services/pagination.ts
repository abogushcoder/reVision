/**
 * @typedef {import('../models/books.js').Book} Book
 * @typedef {import('../models/books.js').Chapter} Chapter
 */

export interface LayoutConfig {
    screenHeight: number;
    screenWidth: number;
    fontSize: number;          // Current font size
    lineHeight: number;        // Line height multiplier (e.g., 1.5)
    marginTop: number;         // Top margin
    marginBottom: number;      // Bottom margin
    paragraphSpacing: number;
}

export interface Page {
    pageNumber: number;        // 1-indexed page number
    scrollOffset: number;      // Y-offset in the continuous layout
    chapterId: string;         // Current chapter at this offset
    chapterTitle: string;      // Chapter title for display
    startParagraphIdx: number;  // First paragraph on this page
    endParagraphIdx: number;    // Last paragraph on this page (inclusive)
}


export interface BookLayout {
    pages: Page[];
    totalHeight: number;       // Total rendered height of book
    contentHeight: number;     // Height available per page
}

export interface ParagraphWithMeta {
    text: string;
    chapterId: string;
    chapterTitle: string;
    type: 'paragraph' | 'chapter-heading';
}

export function flattenBookContent(book: any): ParagraphWithMeta[] {
    const content: ParagraphWithMeta[] = [];

    book.chapters.forEach((chapter: any) => {
        content.push({
            text: chapter.title,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            type: 'chapter-heading',
        });

        // Add all paragraphs
        chapter.paragraphs.forEach((paragraph: string) => {
            content.push({
                text: paragraph,
                chapterId: chapter.id,
                chapterTitle: chapter.title,
                type: 'paragraph',
            });
        });
    });
    return content;
}

//TODO: REFACTOR AFTER ADDING IMAGE LOGIC, DOESN'T SPLIT WITH IMAGE CONSIDERATIONS ATM
export async function generateBookLayout(
    book: any,
    config: LayoutConfig,
    measureContent: (content: ParagraphWithMeta[]) => Promise<number>
): Promise<BookLayout> {

    const content = flattenBookContent(book);

    const totalHeight = await measureContent(content);

    const contentHeight = config.screenHeight - config.marginTop - config.marginBottom;

    const pages: Page[] = [];
    let pageNumber = 1;
    let currentOffset = 0;

    while (currentOffset < totalHeight) {
        const currentChapter = findChapterAtOffset(content, currentOffset, config);

        pages.push({
            pageNumber,
            scrollOffset: currentOffset,
            chapterId: currentChapter.id,
            chapterTitle: currentChapter.title,
        });

        currentOffset += contentHeight;
        pageNumber++;
    }

    return {
        pages,
        totalHeight,
        contentHeight,
    };
}

function findChapterAtOffset(
    content: ParagraphWithMeta[],
    offset: number,
    config: LayoutConfig
): { id: string; title: string } {
    const estimatedIndex = Math.floor(
        (offset / (content.length * config.fontSize * config.lineHeight)) * content.length
    );

    const item = content[Math.min(estimatedIndex, content.length - 1)];
    return {
        id: item.chapterId,
        title: item.chapterTitle,
    };
}


/**
 * Get which page the user is currently viewing based on scroll position
 * 
 * Example: User scrolls to Y-offset 1600px
 * - Page 1 starts at 0px
 * - Page 2 starts at 800px  
 * - Page 3 starts at 1600px ← User is here
 * - Page 4 starts at 2400px
 * 
 * This returns Page 3
 */
export function getPageAtOffset(layout: BookLayout, scrollOffset: number): Page | null {
    // Start from the end and work backwards
    // Find the page whose offset is closest to (but not exceeding) scrollOffset
    for (let i = layout.pages.length - 1; i >= 0; i--) {
        if (layout.pages[i].scrollOffset <= scrollOffset) {
            return layout.pages[i];
        }
    }

    // Fallback: return first page
    return layout.pages[0] || null;
}

/**
 * Get page info by page number
 * 
 * Example: User wants to jump to page 50
 * This returns: { pageNumber: 50, scrollOffset: 39200, chapterId: "chapter-3", ... }
 * Then we can scroll to offset 39200px
 */
export function getPageByNumber(layout: BookLayout, pageNumber: number): Page | null {
    return layout.pages.find(p => p.pageNumber === pageNumber) || null;
}


