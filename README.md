# Mknooon Onboarding Frontend

A dynamic React-based onboarding UI for Mknooon training platforms. This application provides a seamless, multi-step onboarding experience that integrates with the Laravel backend API for brand and pricing data.

## Features

- **Dynamic Brand Integration**: Fetches brand data from the backend API based on the `src` query parameter
- **Multi-Step Onboarding Flow**: 9-step interactive journey with progress tracking
- **Country-Based Pricing**: Dynamically populated country dropdown with pricing calculation
- **Full RTL Support**: Complete Arabic language support with right-to-left layout
- **Error Handling**: Graceful error handling for invalid brands and API failures
- **Responsive Design**: Mobile-first design optimized for all screen sizes
- **Neutral Design System**: Scalable, brand-agnostic design that works across all training programs

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Wouter** - Lightweight client-side routing
- **shadcn/ui** - Reusable UI components

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm 10+
- API Backend running (Laravel backend at `http://localhost:8000/api`)

### Installation

```bash
# Clone the repository
git clone https://github.com/03sana/mknooon-onboarding-frontend.git
cd mknooon-onboarding-frontend

# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:8000/api
```

For production, update the API URL to your production backend:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Development

```bash
# Start the development server
pnpm dev

# The app will be available at http://localhost:3000
```

### Building for Production

```bash
# Build the project
pnpm build

# Preview the production build locally
pnpm preview
```

## Project Structure

```
client/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom React hooks
│   │   ├── useOnboarding.ts    # Onboarding state management
│   │   └── useQueryParam.ts    # Query parameter reading
│   ├── lib/          # Utility functions
│   │   └── api.ts    # API service layer
│   ├── pages/        # Page components
│   │   ├── Onboarding.tsx      # Main onboarding flow
│   │   ├── InvalidLink.tsx     # Error page
│   │   └── Loading.tsx         # Loading state
│   ├── App.tsx       # Root component
│   ├── main.tsx      # Entry point
│   └── index.css     # Global styles & design tokens
└── index.html        # HTML template
```

## API Integration

The frontend communicates with the Laravel backend through these endpoints:

### Get Brand Data
```
GET /api/brand?src=chocodar
```

Response:
```json
{
  "success": true,
  "data": {
    "src": "chocodar",
    "name": "Chocodar",
    "title": "رحلتك لإطلاق مشروع الشوكولاته تبدأ الآن 🍫",
    "subtitle": "3 دقائق فقط…",
    "description": "...",
    "video_url": "https://youtube.com/...",
    "color_primary": "#6B3F2A",
    "color_accent": "#F5E6D0",
    "logo": "https://..."
  }
}
```

### Get Available Countries
```
GET /api/countries?src=chocodar
```

Response:
```json
{
  "success": true,
  "data": {
    "src": "chocodar",
    "countries": ["SA", "AE", "KW", "QA", "BH", "OM", "EG", "JO", "LB"]
  }
}
```

### Get Pricing
```
GET /api/price?src=chocodar&country=SA
```

Response:
```json
{
  "success": true,
  "data": {
    "src": "chocodar",
    "country": "SA",
    "price": 497,
    "currency": "SAR",
    "currency_symbol": "ر.س"
  }
}
```

## Usage

### Starting the Onboarding Flow

Access the onboarding with a brand source parameter:

```
http://localhost:3000/?src=chocodar
http://localhost:3000/?src=sapooon
http://localhost:3000/?src=cleanoosh
```

Supported sources:
- `chocodar` - Chocolate business
- `sapooon` - Soap business
- `cleanoosh` - Cleaning products
- `shomoo3` - Candles
- `koohla` - Other crafts

### Error Handling

- **Invalid src**: Displays "الرابط غير صالح" (Invalid Link) error page
- **API errors**: Shows user-friendly error messages
- **Missing parameters**: Validates required parameters and shows appropriate errors

## Design System

The project uses a neutral, scalable design system with:

- **Color Palette**: Neutral tones (off-white, anthracite, warm taupe)
- **Typography**: Cairo font for Arabic text
- **Spacing**: Consistent spacing scale via Tailwind utilities
- **Components**: Reusable components from shadcn/ui

All design tokens are defined in `client/src/index.css` and can be customized per brand.

## Deployment

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod --dir=dist
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "preview"]
```

### cPanel/Shared Hosting

1. Build the project: `pnpm build`
2. Upload the `dist/` folder to your hosting
3. Configure your web server to serve `dist/index.html` for all routes (SPA routing)
4. Update `VITE_API_URL` environment variable to point to your production API

## Performance Optimization

- Lazy loading of components
- Code splitting via Vite
- Optimized images and assets
- Efficient API caching strategies
- Minimal bundle size (~50KB gzipped)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -am 'Add feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please contact the Mknooon team or open an issue on GitHub.

## Changelog

### v1.0.0 (Initial Release)
- Dynamic onboarding flow with 9 steps
- Full RTL support for Arabic
- Country-based pricing integration
- Error handling and loading states
- Neutral design system
