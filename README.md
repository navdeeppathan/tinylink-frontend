# TinyLink Frontend

React-based frontend application for TinyLink URL shortener service.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- Backend API running (see backend README)

## Tech Stack

- **React** 18.x - UI Library
- **React Router DOM** 6.x - Client-side routing
- **Axios** 1.x - HTTP client
- **Tailwind CSS** 3.x - Styling framework
- **Lucide React** - Icons (optional)

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Dashboard.js       # Main dashboard with links table
│   │   ├── StatsPage.js       # Individual link statistics
│   │   └── AddLinkForm.js     # Form component (optional)
│   ├── services/
│   │   └── api.js             # API service layer
│   ├── App.js                 # Main app component with routing
│   ├── index.js               # Application entry point
│   └── index.css              # Global styles with Tailwind
├── package.json
├── vite.config.js
├── .env
├── .env.example
└── README.md
```

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

For production:

```env
REACT_APP_API_URL=https://your-backend-api.render.com
```

### Tailwind CSS Setup

If not already configured, install Tailwind:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

**tailwind.config.js:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**src/index.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## Installation

### Step 1: Clone and Navigate

```bash
cd tinylink/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
cp .env.example .env
# Edit .env and set REACT_APP_API_URL
```

### Step 4: Start Development Server

```bash
npm start
```

Application will open at `http://localhost:3000`

## Available Scripts

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `build` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## 🧩 Components

### Dashboard Component

**Location:** `src/components/Dashboard.js`

**Features:**

- Displays all links in a table format
- Add new link form with validation
- Search/filter functionality
- Click tracking display
- Delete functionality
- Copy short URL to clipboard

**State Management:**

```javascript
const [links, setLinks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [targetUrl, setTargetUrl] = useState("");
const [customCode, setCustomCode] = useState("");
const [submitting, setSubmitting] = useState(false);
const [success, setSuccess] = useState("");
const [searchTerm, setSearchTerm] = useState("");
```

### StatsPage Component

**Location:** `src/components/StatsPage.js`

**Features:**

- Displays detailed statistics for a single link
- Shows short URL with copy functionality
- Displays creation date and click metrics
- Responsive card layout
- Back to dashboard navigation

**Route:** `/code/:code`

### API Service

**Location:** `src/services/api.js`

**Functions:**

```javascript
api.createLink(data); // POST /api/links
api.getLinks(); // GET /api/links
api.getLink(code); // GET /api/links/:code
api.deleteLink(code); // DELETE /api/links/:code
api.healthCheck(); // GET /healthz
getShortUrl(code); // Generates short URL
```

## Styling

This project uses **Tailwind CSS** for styling with a utility-first approach.

### Color Scheme

- **Primary:** Blue (blue-600)
- **Success:** Green (green-600)
- **Error:** Red (red-600)
- **Warning:** Yellow (yellow-600)
- **Background:** Gray (gray-50, gray-100)

### Responsive Breakpoints

- **Mobile:** Default (< 640px)
- **Tablet:** `md:` (>= 768px)
- **Desktop:** `lg:` (>= 1024px)

### Common Classes

```css
/* Buttons */
.btn-primary: bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700

/* Cards */
.card: bg-white rounded-lg shadow-md p-6

/* Inputs */
.input: w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500
```

## API Integration

### Base Configuration

The API base URL is configured via environment variable:

```javascript
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
```

### Example API Call

```javascript
import { api } from "./services/api";

// Create a link
const createLink = async () => {
  try {
    const response = await api.createLink({
      target_url: "https://example.com",
      custom_code: "mycode",
    });
    console.log("Link created:", response.data);
  } catch (error) {
    if (error.response?.status === 409) {
      console.error("Code already exists");
    }
  }
};
```

### Error Handling

All API calls include error handling:

```javascript
try {
  const response = await api.getLinks();
  setLinks(response.data);
} catch (err) {
  if (err.response?.status === 404) {
    setError("Not found");
  } else if (err.response?.status === 409) {
    setError("Duplicate code");
  } else {
    setError("Server error");
  }
}
```

## Testing

### Manual Testing Checklist

- [ ] Dashboard loads and displays links
- [ ] Can create link with auto-generated code
- [ ] Can create link with custom code (6-8 chars)
- [ ] Validation shows error for short codes (< 6 chars)
- [ ] Validation shows error for long codes (> 8 chars)
- [ ] Duplicate code shows 409 error
- [ ] Invalid URL shows error
- [ ] Search filters links correctly
- [ ] Copy button copies short URL
- [ ] Stats page displays correct data
- [ ] Delete button removes link
- [ ] Redirect increments click count
- [ ] Responsive on mobile devices

### Browser Testing

Test on:

- Chrome/Edge (Chromium)
- Firefox
- Safari (if on Mac)
- Mobile browsers

## 📱 Responsive Design

### Mobile (< 640px)

- Single column layout
- Stacked form fields
- Scrollable table
- Touch-friendly buttons

### Tablet (768px - 1024px)

- Two-column forms
- Wider table view
- Larger touch targets

### Desktop (> 1024px)

- Full table layout
- Inline form
- Hover effects
- Optimized spacing

## Deployment

### Vercel (Recommended)

#### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Method 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** frontend
   - **Build Command:** npm run build
   - **Output Directory:** build
6. Add environment variable:
   - `REACT_APP_API_URL`: Your backend URL
7. Deploy

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Manual Build

```bash
# Build for production
npm run build

# Output will be in 'build' folder
# Upload to any static hosting service
```

## 🔐 Environment Configuration

### Development (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

### Production (.env.production)

```env
REACT_APP_API_URL=https://your-backend-api.render.com
```

### Vercel Environment Variables

Add in Vercel dashboard:

- **Name:** `REACT_APP_API_URL`
- **Value:** `https://your-backend-api.render.com`
- **Environment:** Production

## Troubleshooting

### Issue: API calls failing with CORS error

**Solution:** Ensure backend has CORS enabled:

```javascript
app.use(cors());
```

### Issue: Environment variables not working

**Solution:**

- Restart development server after changing .env
- Ensure variable starts with `REACT_APP_`
- Check spelling and case sensitivity

### Issue: Build fails on Vercel

**Solution:**

- Check build logs for specific error
- Verify all dependencies are in package.json
- Ensure no TypeScript errors if using TS
- Check Node version compatibility

### Issue: 404 on page refresh in production

**Solution:** Configure Vercel/Netlify for SPA routing:

**vercel.json:**

```json
{
  "routes": [{ "src": "/[^.]+", "dest": "/", "status": 200 }]
}
```

**\_redirects (Netlify):**

```
/*    /index.html   200
```

### Issue: Styles not loading in production

**Solution:**

- Ensure Tailwind is building correctly
- Check tailwind.config.js content paths
- Verify index.css imports Tailwind directives

## 📊 Performance Optimization

### Code Splitting

React Router automatically splits code by route:

```javascript
const Dashboard = React.lazy(() => import("./components/Dashboard"));
const StatsPage = React.lazy(() => import("./components/StatsPage"));
```

### Image Optimization

```javascript
// Use lazy loading for images
<img loading="lazy" src="..." alt="..." />
```

### Memoization

```javascript
import { useMemo } from "react";

const filteredLinks = useMemo(() => {
  return links.filter(
    (link) =>
      link.code.includes(searchTerm) || link.target_url.includes(searchTerm)
  );
}, [links, searchTerm]);
```

## Security Best Practices

- All API calls use HTTPS in production
- Input validation on client-side
- XSS protection (React escapes by default)
- Environment variables for sensitive data
- No sensitive data in localStorage
- CORS configured correctly

## Package.json Scripts Explained

```json
{
  "scripts": {
    "start": "react-scripts start", // Dev server with hot reload
    "build": "react-scripts build", // Production build
    "test": "react-scripts test", // Jest test runner
    "eject": "react-scripts eject" // Eject from CRA (irreversible)
  }
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

MIT License - see root README.md

## Support

- **Documentation:** See root README.md
- **Issues:** Create an issue on GitHub
- **Backend API:** See backend README.md

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)
- [Vercel Documentation](https://vercel.com/docs)

---

**Built with using React and Tailwind CSS**
