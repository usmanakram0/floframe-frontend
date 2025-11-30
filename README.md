# FloFrame

A modern web application for extracting high-quality PNG frames from video files.

## Overview

FloFrame allows users to upload video files (MP4/MOV) and extract the last frame as a full-quality PNG image. The application features a sleek dark/light mode interface with client-side video processing for instant results.

## Features

- **Video Upload**: Drag & drop or browse to upload MP4/MOV files (up to 500MB)
- **Frame Extraction**: Automatically extracts the last frame from uploaded videos
- **High-Quality Export**: Download extracted frames as full-quality PNG images
- **Video Information**: Display video duration and resolution
- **Theme Toggle**: Switch between dark and light mode
- **Persistent State**: Uploaded videos and extracted frames persist across page navigation
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Settings Panel**: Customize frame rate and quality preferences

## Technology Stack

### Frontend

- **React 18.3** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router DOM 6.30** - Client-side routing
- **Tailwind CSS** - Utility-first styling

### UI Components

- **Radix UI** - Accessible component primitives
  - Select
  - Switch
  - Toast
  - Tooltip
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### State Management

- **React Context API** - Global state management
  - Settings Context (theme, FPS, quality)
  - Upload Context (video file, metadata, extracted frame)

### Video Processing

- **Canvas API** - Client-side frame extraction
- **File API** - Video file handling and validation

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx          # Main navigation component
│   └── ui/                     # UI component library
│       ├── button.tsx
│       ├── select.tsx
│       ├── switch.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── tooltip.tsx
│       └── sonner.tsx
├── contexts/
│   ├── SettingsContext.tsx     # Global settings state
│   └── UploadContext.tsx       # Global upload state
├── hooks/
│   ├── use-mobile.tsx          # Mobile detection hook
│   └── use-toast.ts            # Toast notification hook
├── pages/
│   ├── Upload.tsx              # Main upload page
│   ├── Settings.tsx            # Settings configuration
│   ├── About.tsx               # About page
│   └── NotFound.tsx            # 404 page
├── lib/
│   └── utils.ts                # Utility functions
├── App.tsx                     # Root component
├── index.css                   # Global styles & design tokens
└── main.tsx                    # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd floframe
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Usage

1. **Upload a Video**: Navigate to the home page and either drag & drop a video file or click "Browse files" to select one
2. **View Information**: Once uploaded, view the video duration and resolution
3. **Extract Frame**: Click "Extract Last Frame" to process the video
4. **Download**: Click the "Download PNG" button to save the extracted frame
5. **Customize Settings**: Visit the Settings page to adjust frame rate, quality, and theme preferences

## Video Requirements

- **Supported Formats**: MP4, MOV
- **Maximum File Size**: 500MB
- **Processing**: Client-side (no server upload required)

## Design System

The application uses a comprehensive design system with semantic color tokens:

### Dark Mode (Default)

- Background: `hsl(0, 0%, 7%)`
- Primary (Accent): `hsl(6, 93%, 56%)` - Red accent color
- Foreground: `hsl(0, 0%, 98%)`

### Light Mode

- Background: `hsl(0, 0%, 100%)`
- Primary: `hsl(6, 93%, 56%)`
- Foreground: `hsl(0, 0%, 7%)`

All colors are defined as HSL values in `src/index.css` and used throughout the application via Tailwind's semantic tokens.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is proprietary and confidential.
