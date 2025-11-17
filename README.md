# reVision - AI-Enhanced EPUB Reader

> Revolutionizing the reading experience by transforming books into interactive, AI-enhanced picture books with intelligent summaries and a retro-gaming aesthetic.

![Status](https://img.shields.io/badge/status-prototype-orange)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020?logo=expo)

---

## Overview

**reVision** is a Kindle-like EPUB reader built with React Native and Expo that enhances the reading experience through AI-powered features. Originally designed for sci-fi and fantasy novels, it transforms traditional text-based reading into an immersive visual experience with AI-generated summaries and retro 16-bit pixel art aesthetics.

### Key Features

- **Location-Based Pagination**: Swipe-free, tap-based navigation similar to Kindle's reading experience
- **AI-Powered Summaries**: Automatically generates recaps of the last 5 locations (~8,000 characters) when reopening a book
- **Retro 16-Bit Aesthetic**: Custom Jersey20 pixel art font and chapter-based banner images
- **Reading Progress Persistence**: Automatically saves and restores your exact reading position
- **Chapter-Themed Visuals**: Dynamic pixel art banners that change every 10 locations
- **Interactive Navigation**: Tap zones for seamless page turning and menu access
- **Smart Location Slider**: Jump to any point in the book instantly

---

## Project Status

This repository contains a **functional prototype** built during a hackathon. The core reading experience and AI summary features are fully implemented and working.

> **Note**: This project is currently being **rewritten in Flutter** to create a complete, production-ready mobile application with expanded features and improved performance.

---

## Screenshots

*(Coming soon - add screenshots of the reader, summary popup, and options menu)*

---

## Technical Architecture

### Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Expo 54 (React Native 0.81.5) |
| **Language** | TypeScript |
| **Routing** | expo-router v6 (file-based) |
| **EPUB Rendering** | @epubjs-react-native |
| **AI Services** | OpenAI GPT-4 (summaries), DALL-E (planned) |
| **State Management** | React Hooks + AsyncStorage |
| **Gestures** | react-native-gesture-handler |
| **Storage** | @react-native-async-storage |

### Project Structure

```
reVision/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout with ReaderProvider
│   ├── (tabs)/
│   │   └── index.tsx            # Home screen (book library)
│   └── reader/
│       └── [bookId].tsx         # Main reader screen
├── components/                   # Reusable UI components
│   ├── app-text.tsx             # Custom Jersey20 font wrapper
│   ├── control-overlay.tsx      # Invisible tap zones for navigation
│   ├── footer.tsx               # Chapter-based pixel art banner
│   ├── generic-popup.tsx        # Modal wrapper
│   ├── options-menu.tsx         # Settings and navigation menu
│   ├── summary.tsx              # AI summary display
│   ├── summary-loading.tsx      # Loading state
│   └── top-bar.tsx              # Progress indicator
├── src/
│   ├── data/
│   │   ├── books/
│   │   │   └── book1.json       # Preprocessed book data
│   │   └── booksIndex.ts        # Book registry
│   ├── models/
│   │   └── books.js             # TypeScript type definitions
│   └── services/
│       ├── aiSummaries.ts       # OpenAI GPT-4 integration
│       ├── pagination.ts        # Pagination utilities (unused)
│       └── storage.ts           # AsyncStorage wrapper
├── epub_tools/                   # Python preprocessing tools
│   ├── epub_to_locations.py    # EPUB to JSON converter
│   └── alice_locations.json    # Preprocessed book locations
├── assets/
│   ├── fonts/
│   │   └── Jersey20-Regular.ttf # Retro pixel font
│   └── images/
│       └── bg/                  # Chapter banner images
└── constants/
    └── theme.ts                 # Color and font theme
```

---

## Core Features Explained

### 1. Location-Based Reading System

Instead of traditional page numbers, reVision uses a **location system** similar to Kindle:

- Each location represents ~1,600 characters of text
- Provides consistent navigation across different screen sizes
- Alice in Wonderland example: 90 locations total
- Precise position tracking using EPUB CFI (Canonical Fragment Identifier)

**How it works:**
```typescript
// Python preprocessing converts EPUB to locations
epub_to_locations.py → alice_locations.json (90 locations)

// Each location contains:
{
  "index": 0,
  "text": "Chapter 1: Down the Rabbit Hole..."
}
```

### 2. AI-Powered Summaries

When you reopen a book, reVision automatically generates a summary of what you last read:

**Features:**
- Summarizes the last 5 locations (~8,000 characters)
- Uses OpenAI GPT-4 for intelligent, context-aware summaries
- Maximum length: 1,000 characters (3-4 sentences minimum)
- Skips summary if you're at the beginning (< location 5)

**Implementation:**
```typescript
// src/services/aiSummaries.ts
async function getSummary(path: string, location: number): Promise<string> {
  if (location < 5) return 'No Summary available...';

  // Gather text from last 5 locations
  let promptText = '';
  for (let i = location - 5; i <= location; i++) {
    promptText += locationList[i].text;
  }

  // Call OpenAI GPT-4
  const summary = await callOpenAI(promptText, 1000);
  return summary;
}
```

### 3. Navigation System

**Tap Zones:**
- **Left 20%**: Previous location
- **Right 20%**: Next location
- **Top area**: Open options menu

**Why tap instead of swipe?**
- More precise control
- No accidental page turns
- Better for one-handed reading
- Consistent with e-reader conventions

### 4. Reading Progress Persistence

Your reading position is automatically saved using AsyncStorage:

```typescript
// Saved data structure
{
  bookId: string,
  currentPage: {
    start: {
      cfi: string,      // Precise EPUB location
      location: number  // Location index (0-89)
    }
  },
  totalPages: number,
  lastRead: timestamp
}
```

### 5. 16-Bit Aesthetic

**Custom Font:** Jersey20-Regular.ttf (pixel art/retro gaming style)

**Chapter Banners:**
- Dynamic pixel art images at bottom of screen (15% height)
- Changes every 10 locations
- Pre-made assets in `/assets/images/bg/`

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI
- iOS Simulator (macOS) or Android Studio
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reVision.git
   cd reVision
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the app**
   ```bash
   # Start Expo development server
   npm start

   # Run on iOS
   npm run ios

   # Run on Android
   npm run android
   ```

---

## Usage

### Reading a Book

1. Launch the app - you'll see the home screen with available books
2. Tap on a book to open the reader
3. If you've read before, you'll see an AI-generated summary of your last reading session
4. Tap the right side of the screen to advance, left side to go back
5. Tap the top of the screen to access the options menu

### Options Menu

- **Back Button**: Return to library
- **Location Slider**: Jump to any location in the book
- **Current Location Display**: See your exact position

### Navigation Tips

- Reading position saves automatically as you navigate
- Summaries are generated only when opening a book (not on every page turn)
- Progress bar at top shows your position visually
- Chapter banners change to reflect story progression

---

## Adding New Books

### Method 1: Preprocessed EPUB (Recommended for Hackathon)

1. **Convert EPUB to locations JSON:**
   ```bash
   cd epub_tools
   python epub_to_locations.py your_book.epub
   ```

2. **Register the book:**
   ```typescript
   // src/data/booksIndex.ts
   import newBookData from './books/your_book.json';

   export const books: Book[] = [
     // ...existing books,
     {
       id: 'your_book',
       title: 'Your Book Title',
       author: 'Author Name',
       coverImage: require('@/assets/images/your_cover.png'),
       chapters: newBookData.chapters
     }
   ];
   ```

3. **Host EPUB file** (GitHub or CDN)

4. **Update reader source URL:**
   ```typescript
   // app/reader/[bookId].tsx
   <Reader
     src="https://your-url/your_book.epub"
     // ...
   />
   ```

### Method 2: Direct EPUB Loading

The reader supports loading EPUB files directly via URL:

```typescript
<Reader
  src="https://github.com/username/repo/path/to/book.epub"
  // ...
/>
```

---

## Configuration

### Adjusting Reading Experience

**Font Size:**
```typescript
// app/reader/[bookId].tsx
changeFontSize("20px"); // Adjust as needed
```

**Location Size (Preprocessing):**
```python
# epub_tools/epub_to_locations.py
CHARS_PER_LOCATION = 1600  # Adjust for more/less text per location
```

**Summary Length:**
```typescript
// src/services/aiSummaries.ts
const LOCATIONS_TO_SUMMARIZE = 5;  // How many locations to recap
const MAX_SUMMARY_CHARS = 1000;    // Maximum summary length
```

**Banner Change Frequency:**
```typescript
// components/footer.tsx
const imagesPerBanner = 10;  // Change banner every N locations
```

---

## API Integration

### OpenAI GPT-4 Summaries

The app uses OpenAI's GPT-4 model for generating summaries:

**Configuration:**
```typescript
// src/services/aiSummaries.ts
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Request parameters
{
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: Math.floor(maxChars / 3)
}
```

**System Prompt:**
```
You are a helpful assistant that summarizes book content.
Create concise summaries with a minimum of 3-4 sentences.
The summary must not exceed 1000 characters.
```

**Rate Limits:**
- Be aware of OpenAI API rate limits
- Consider implementing caching for repeated requests
- Summaries are generated only on book open, not per page

---

## Known Limitations & Future Improvements

### Current Limitations

- **Single Book Support**: Only Alice in Wonderland is fully configured
- **No Image Generation**: DALL-E integration planned but not implemented
- **No Text Highlighting**: Kindle-style highlighting not yet available
- **Static Banner Images**: Uses pre-made pixel art instead of dynamic generation
- **No Offline Mode**: Requires internet for EPUB loading and summaries
- **Basic Library UI**: Simple list instead of book cover grid

### Planned Features (Flutter Rewrite)

- **Dynamic AI Image Generation**: DALL-E scene images every ~500 words
- **Text Highlighting**: Select text and generate summaries on-demand
- **Page Number Markers**: Side markings similar to code editor line numbers
- **Multi-Book Support**: Complete library management
- **Offline Reading**: Download books for offline access
- **Customizable Themes**: Light/dark modes, font options
- **Reading Statistics**: Track reading time, pages read, etc.
- **Cross-Platform Sync**: Cloud sync for reading progress
- **Enhanced UI**: Book cover grid, search, filters, recommendations

---

## Development Notes

### Why epubjs-react-native?

The project originally planned custom pagination (see `src/services/pagination.ts`), but pivoted to using the `@epubjs-react-native` library because:

- Automatic EPUB parsing and rendering
- Built-in location system (similar to Kindle)
- CFI-based position tracking for precision
- Handles complex EPUB formatting
- Faster development during hackathon timeframe

### Why Location-Based Instead of Page-Based?

**Advantages of locations:**
- Consistent across different screen sizes and orientations
- More precise position tracking
- Standard in e-reader industry (Kindle uses this)
- Better for text reflow when changing font size

### Python Preprocessing Tools

The `epub_tools/` directory contains utilities for:
- Converting EPUB to location-based JSON
- Extracting plain text for AI processing
- Embedding custom images into EPUB files

**Why preprocess?**
- Faster AI summary generation (no need to parse EPUB at runtime)
- Reduced app bundle size
- Better control over text segmentation

---

## Contributing

This project is currently in prototype status and is being rewritten in Flutter. However, contributions, suggestions, and feedback are welcome!

### Areas for Contribution

- Bug fixes in the current React Native implementation
- Additional preprocessing tools
- UI/UX improvements
- Performance optimizations
- Documentation improvements

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Credits & Acknowledgments

### Built With

- **Expo & React Native** - Cross-platform mobile framework
- **epubjs-react-native** - EPUB rendering engine
- **OpenAI GPT-4** - AI-powered text summaries
- **Jersey20 Font** - Retro gaming aesthetic

### Team

- **Alex Bogush**
- **Ethan Rackleff**
- **William White**

### Special Thanks

- Anthropic Claude for development assistance
- OpenAI for GPT-4 API access
- The Expo and React Native communities

---

## License

This project is currently unlicensed. All rights reserved pending Flutter rewrite and official release.

---

## Roadmap

### Phase 1: Current Prototype (Complete)
- [x] EPUB rendering with epubjs-react-native
- [x] Location-based navigation
- [x] AI-powered summaries on book open
- [x] Reading progress persistence
- [x] Basic UI with retro aesthetic
- [x] Chapter-based banner images

### Phase 2: Flutter Rewrite (In Progress)
- [ ] Port core functionality to Flutter
- [ ] Implement DALL-E image generation
- [ ] Add text highlighting with AI summaries
- [ ] Build complete library management
- [ ] Implement offline mode
- [ ] Add reading statistics

### Phase 3: Production Release
- [ ] App Store & Play Store submission
- [ ] User accounts and cloud sync
- [ ] Social features (sharing highlights, reviews)
- [ ] Recommendation engine
- [ ] Support for more ebook formats
- [ ] Accessibility features

---

## FAQ

**Q: Why Flutter for the rewrite?**
A: Flutter provides better performance for complex text rendering, easier cross-platform development, and more robust widget system for custom UI components.

**Q: Will the React Native version be maintained?**
A: The current version serves as a proof-of-concept. Future development will focus on the Flutter implementation.

**Q: Can I use my own OpenAI API key?**
A: Yes! Just add your key to the `.env` file as `EXPO_PUBLIC_OPENAI_API_KEY`.

**Q: Does this work with DRM-protected books?**
A: No, currently only DRM-free EPUB files are supported.

**Q: Can I contribute to the Flutter rewrite?**
A: The Flutter repository will be made public once the initial implementation is complete. Stay tuned!

---

## Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/reVision/issues)
- **Email**: your.email@example.com
- **Twitter/X**: @yourusername

---

**Made with love for readers who want more from their books**

*"Not all those who wander are lost, but some could use a good AI-generated summary."*
