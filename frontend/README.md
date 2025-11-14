# Security Assessor Frontend

A beautiful, comprehensive Security Assessment Platform that evaluates third-party software across 15 comprehensive dimensions.

## ✨ Features

- **15 Security Dimensions** - Complete framework coverage
- **Beautiful UI** - Modern design with smooth animations
- **Dark Mode** - Full theme support with system preference detection
- **Interactive Charts** - Data visualizations with Recharts
- **Real-time Search** - Autocomplete with suggestions
- **Trust Score Analysis** - Color-coded security ratings
- **CVE Tracking** - Vulnerability analysis with trends
- **Compliance Dashboard** - Certifications and standards
- **Responsive Design** - Works on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── assess/[id]/       # Assessment detail page
│   ├── history/           # History page
│   ├── compare/           # Comparison page
│   └── not-found.tsx      # 404 page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── shared/            # Shared components
│   ├── search/            # Search components
│   └── assessment/        # Assessment components
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── api.ts             # API client (mock data)
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🎨 Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualizations
- **Lucide Icons** - Modern icon set
- **next-themes** - Dark mode support

## 🔌 Mock Data

The app currently uses mock data for demonstration. Sample assessments included:

- **Slack** (Trust Score: 78)
- **GitHub** (Trust Score: 88)

Try searching for "Slack" or "GitHub" to see the full assessment reports!

## 🎯 Key Pages

- **Landing Page** (`/`) - Hero search, stats, recent assessments
- **Assessment Detail** (`/assess/[id]`) - Full security report
- **History** (`/history`) - Assessment history (coming soon)
- **Compare** (`/compare`) - Side-by-side comparison (coming soon)

## 🌟 Highlights

- ⚡ **Lightning Fast** - Optimized performance with Next.js 14
- 🎨 **Beautiful Animations** - Framer Motion for smooth interactions
- 📊 **Rich Visualizations** - Interactive charts and graphs
- 🌙 **Dark Mode** - System-aware theme switching
- 📱 **Fully Responsive** - Mobile, tablet, and desktop support
- ♿ **Accessible** - WCAG compliant components

## 📝 License

This project is part of Junction 2025 hackathon.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for the Junction 2025 hackathon.
