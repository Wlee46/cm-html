# Campaign Monitor Dashboard - Netlify Edition

A modern, interactive dashboard for comparing Campaign Monitor email campaigns with visual analytics and detailed metrics.

## Features

- 📊 **Visual Comparison** - Compare multiple campaigns side-by-side with interactive charts
- 📈 **Performance Metrics** - Track opens, clicks, bounces, and more
- 🔍 **Advanced Filtering** - Filter by date range and search campaigns
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔗 **Shareable Links** - Share specific campaign comparisons via URL
- 📥 **PDF Export** - Download comparison reports as PDF
- 🎯 **Click Analysis** - See which links performed best in each campaign

## Deployment to Netlify

### Option 1: Deploy via Netlify UI (Recommended)

1. **Fork or clone this repository**

2. **Go to [Netlify](https://app.netlify.com/)**

3. **Click "Add new site" → "Import an existing project"**

4. **Connect your Git repository**

5. **Configure build settings:**
   - Build command: (leave empty)
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

6. **Add environment variable:**
   - Go to Site settings → Environment variables
   - Add: `CAMPAIGN_MONITOR_API_KEY` = your Campaign Monitor API key

7. **Deploy!**

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize new site
netlify init

# Set environment variable
netlify env:set CAMPAIGN_MONITOR_API_KEY "your-api-key-here"

# Deploy
netlify deploy --prod
```

### Option 3: One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR-USERNAME/YOUR-REPO)

## Getting Your Campaign Monitor API Key

1. Log in to your Campaign Monitor account
2. Go to Account Settings → API Keys
3. Create a new API key or use an existing one
4. Copy the API key

## Environment Variables

Create a `.env` file in Netlify (or set via Netlify UI):

```
CAMPAIGN_MONITOR_API_KEY=your_api_key_here
```

## Local Development

If you want to test locally:

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
CAMPAIGN_MONITOR_API_KEY=your_api_key_here
```

3. Run Netlify Dev:
```bash
netlify dev
```

4. Open http://localhost:8888

## API Endpoints

The dashboard uses these serverless functions:

- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/:id/summary` - Get campaign summary
- `GET /api/campaigns/:id/clicks` - Get click data
- `GET /api/campaigns/:id/bounces` - Get bounce data
- `GET /api/lists/performance` - Get list performance
- `GET /api/health` - Health check

## Project Structure

```
.
├── netlify/
│   └── functions/          # Serverless functions
│       ├── campaigns.js
│       ├── campaigns-summary.js
│       ├── campaigns-clicks.js
│       ├── campaigns-bounces.js
│       ├── lists-performance.js
│       └── health.js
├── public/
│   ├── index.html          # Dashboard UI
│   └── _redirects          # Netlify routing
├── netlify.toml            # Netlify configuration
├── package.json
└── README.md
```

## Troubleshooting

### Functions not working
- Ensure `CAMPAIGN_MONITOR_API_KEY` is set in Netlify environment variables
- Check the Functions tab in Netlify dashboard for errors
- Verify API key has proper permissions in Campaign Monitor

### CORS errors
- Functions are configured to handle CORS automatically
- Check browser console for specific error messages

### API rate limiting
- Campaign Monitor has rate limits on their API
- The dashboard caches some data client-side to minimize requests

## Support

For issues related to:
- **Campaign Monitor API**: Check [Campaign Monitor API Documentation](https://www.campaignmonitor.com/api/)
- **Netlify**: Check [Netlify Documentation](https://docs.netlify.com/)
- **This dashboard**: Open an issue in this repository

## License

MIT
