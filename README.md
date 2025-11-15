<div align="center">

<img src="frontend/logo.png" alt="Tarkist.us Logo" width="120" height="120" />

# Tarkist.us

### *Comprehensive Security Assessment Platform*

**Transform application names into CISO-ready trust briefs in minutes**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Junction 2025](https://img.shields.io/badge/Junction-2025-orange?style=for-the-badge)](https://www.hackjunction.com/)

</div>

---

## 🎯 Overview

**Tarkist.us** is an AI-powered security assessment platform that evaluates third-party software across **15 comprehensive dimensions**. Built for security teams and CISOs who need accurate, concise, and source-grounded snapshots of a product's security posture—fast.

> *Moving security from reactive firefighting to proactive enablement.*

### The Challenge

Security teams are constantly asked to approve new tools they've never seen before. They need:
- ✅ Accurate security posture summaries
- ✅ Source-grounded claims with citations
- ✅ Fast turnaround (2-10 minutes)
- ✅ Trust scores with confidence levels
- ✅ Safer alternatives when available

**Tarkist.us delivers all of this and more.**

---

## ✨ Key Features

### 🔍 **15-Dimensional Security Analysis**
- **Vendor Information** - Company background, reputation, and history
- **Product Classification** - Clear taxonomy (File sharing, GenAI tool, SaaS CRM, etc.)
- **CVE Tracking** - Common Vulnerabilities and Exposures with CISA KEV alerts
- **Incident Timeline** - Security incidents and abuse signals
- **Compliance Dashboard** - SOC2, ISO 27001, GDPR, and industry certifications
- **Data Handling Flow** - Storage, transmission, and privacy analysis
- **AI Features Audit** - AI capabilities, data usage, and training disclosure
- **Deployment Controls** - Admin controls and platform support
- **Permissions Matrix** - Access control and security features
- **Release Lifecycle** - Update frequency and security practices
- **Trust Score** - 0-100 rating with rationale and confidence
- **Alternative Suggestions** - Safer alternatives with rationale
- **Source Citations** - Every claim verified and cited
- **Security Radar Chart** - Visual security dimension comparison
- **CVE Trend Analysis** - Historical vulnerability tracking

### 🎨 **Modern User Experience**
- 🌙 **Dark Mode** - System-aware theme switching
- 📱 **Fully Responsive** - Mobile, tablet, and desktop support
- ⚡ **Lightning Fast** - Optimized performance with Next.js 14
- 🎭 **Smooth Animations** - Framer Motion for delightful interactions
- 📊 **Rich Visualizations** - Interactive charts with Recharts
- ♿ **Accessible** - WCAG compliant components
- 🔍 **Real-time Search** - Autocomplete with intelligent suggestions

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/junction2025-sk.git
cd junction2025-sk

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🏗️ Project Structure

```
junction2025-sk/
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page with hero search
│   │   ├── layout.tsx         # Root layout with theme provider
│   │   ├── assess/[id]/       # Assessment detail page
│   │   ├── compare/           # Side-by-side comparison
│   │   ├── history/           # Assessment history
│   │   └── demo/              # Demo page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── shared/            # Shared components (nav, stats, etc.)
│   │   ├── search/            # Search components
│   │   ├── assessment/        # Assessment-specific components
│   │   └── auth/              # Authentication components
│   ├── lib/
│   │   ├── types.ts           # TypeScript interfaces
│   │   ├── api.ts             # API client
│   │   ├── utils.ts           # Utility functions
│   │   └── pdf-generator.ts   # PDF export functionality
│   └── docs/                  # Documentation
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Recharts](https://recharts.org/)** - Data visualizations
- **[Lucide Icons](https://lucide.dev/)** - Modern icon set
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark mode support

### Key Libraries
- **Radix UI** - Accessible component primitives
- **html2canvas** + **jspdf** - PDF generation
- **class-variance-authority** - Component variants

---

## 📊 Assessment Dimensions

Each assessment evaluates software across these dimensions:

| Dimension | Description |
|-----------|-------------|
| 🏢 **Vendor Info** | Company background, reputation, history |
| 📦 **Product Info** | Classification, description, usage |
| 🔒 **CVE Analysis** | Vulnerabilities with CISA KEV alerts |
| ⚠️ **Incidents** | Security incidents and abuse signals |
| ✅ **Compliance** | SOC2, ISO 27001, GDPR certifications |
| 💾 **Data Handling** | Storage, transmission, privacy |
| 🤖 **AI Features** | AI capabilities and data usage |
| 🎛️ **Admin Controls** | Deployment and management features |
| 🔐 **Permissions** | Access control matrix |
| 🔄 **Release Lifecycle** | Update frequency and practices |
| 📈 **Trust Score** | 0-100 rating with rationale |
| 🔄 **Alternatives** | Safer alternative suggestions |
| 📚 **Sources** | Citations and verification |
| 📊 **Security Radar** | Visual dimension comparison |
| 📉 **CVE Trends** | Historical vulnerability analysis |

---

## 🎯 Usage Examples

### Search and Assess

1. Enter an application name (e.g., "Slack", "GitHub")
2. Get comprehensive security analysis in 2-10 minutes
3. Review trust score, CVE trends, compliance status
4. Explore safer alternatives if available
5. Export as PDF for sharing

### Sample Assessments

- **Slack** - Trust Score: 78/100
- **GitHub** - Trust Score: 88/100

Try searching for these applications to see full assessment reports!

---

## 🔐 Security & Privacy

- **Source Verification** - All claims are cited with verification status
- **Confidence Levels** - Each assessment includes confidence ratings
- **Transparent Scoring** - Trust score rationale is fully explained
- **No Data Storage** - Assessments are generated on-demand
- **Local Caching** - Lightweight JSON cache with timestamps

---

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Environment Setup

Currently uses mock data for demonstration. To connect to a backend API, update `frontend/lib/api.ts`.

---

## 🎨 Design Philosophy

- **Clarity First** - Information architecture that makes complex data digestible
- **Visual Hierarchy** - Important metrics stand out
- **Progressive Disclosure** - Details available when needed
- **Consistent Patterns** - Reusable components and layouts
- **Accessibility** - WCAG compliant, keyboard navigable

---

## 📝 License

This project is part of **Junction 2025** hackathon by **Team Hyperboli**.

---

## 🙏 Acknowledgments

- **Withsecure** - Challenge sponsor and guidance
- **Junction 2025** - Hackathon organizers
- **Team Hyperboli** - Development team

### Resources Used

- CVE/CVSS databases
- CISA KEV catalog
- Vendor security pages
- Compliance certification databases
- Public security advisories

---

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] Real-time assessment generation
- [ ] Batch assessment processing
- [ ] Custom assessment templates
- [ ] Team collaboration features
- [ ] Assessment history and comparison
- [ ] MCP framework assessment support

---

<div align="center">

**Built with ❤️ for Junction 2025**

[Report Bug](https://github.com/your-org/junction2025-sk/issues) · [Request Feature](https://github.com/your-org/junction2025-sk/issues)

</div>
