# The Spot 2.0 — Vercel Deployment Guide

## What you're deploying

A production React app with:
- Full community platform (feed, map, deals, events, profiles)
- Supabase backend (database, auth, storage, analytics)
- Google Maps with business pins
- Smart local search concierge (AI concierge upgrade-ready for later)
- Deal redemption system with check-ins
- Partner analytics portal
- Admin dashboard
- All forms (buyer, seller, referral, partner onboarding)

## Project structure

```
the-spot-deploy/
├── index.html          ← Entry HTML with meta tags, fonts, PWA-ready
├── package.json        ← Dependencies (React + Vite)
├── vite.config.js      ← Build config
└── src/
    ├── main.jsx        ← React entry point
    └── App.jsx         ← The entire app (production-ready)
```

---

## OPTION A: Deploy via Vercel CLI (fastest — 2 minutes)

### Step 1: Install Vercel CLI (if you haven't)
```bash
npm install -g vercel
```

### Step 2: Navigate to the project folder
```bash
cd the-spot-deploy
```

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Test locally first
```bash
npm run dev
```
Open http://localhost:5173 — you should see the full app with your Supabase data.

### Step 5: Deploy to Vercel
```bash
vercel
```
It will ask you some questions:
- Set up and deploy? → **Y**
- Which scope? → Your account
- Link to existing project? → **N**
- Project name? → **the-spot-fresno**
- Directory? → **./
- Want to override settings? → **N**

### Step 6: Connect your domain
```bash
vercel domains add thespotfresno.com
```
Or do it in the Vercel dashboard: Project → Settings → Domains → Add `thespotfresno.com`

Then update your domain's DNS:
- Add an **A record** pointing to `76.76.21.21`
- Or add a **CNAME record** pointing to `cname.vercel-dns.com`

---

## OPTION B: Deploy via GitHub (recommended for ongoing updates)

### Step 1: Create a GitHub repo
Go to github.com → New Repository → name it `the-spot` → Create

### Step 2: Push the code
```bash
cd the-spot-deploy
git init
git add .
git commit -m "The Spot 2.0 — initial deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/the-spot.git
git push -u origin main
```

### Step 3: Connect to Vercel
1. Go to vercel.com/new
2. Import your GitHub repo
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

### Step 4: Connect your domain
In Vercel dashboard: Project → Settings → Domains → Add `thespotfresno.com`

### Step 5: Future updates
Every time you push to `main`, Vercel auto-deploys:
```bash
git add .
git commit -m "Updated business listings"
git push
```

---

## After deployment checklist

### 1. Verify Supabase connection
Open thespotfresno.com — you should see your real businesses, events, and reviews loading from Supabase. If you see demo data instead, check:
- Is RLS (Row Level Security) disabled on your tables? Go to Supabase → Authentication → Policies → make sure `anon` role has SELECT access on all tables
- Are your businesses marked `approved = true`?

### 2. Verify Google Maps
Go to the Map tab — you should see a real Google Map with pins for every business that has latitude/longitude. If the map doesn't load:
- Check your Google Cloud Console → APIs & Services → Credentials → make sure your API key has `thespotfresno.com/*` in the HTTP referrer restrictions
- Make sure Maps JavaScript API and Geocoding API are both enabled

### 3. Geocode your businesses
Go to thespotfresno.com?admin=1 → Log in → 📍 Map tab → Geocode all businesses with addresses

### 4. Test the full flow
- Create a user account
- Browse businesses, save favorites
- Check in at a business
- Redeem a deal (boarding pass screen)
- Leave a review
- Run the neighborhood quiz
- Fill out the buyer form
- Test the seller form

### 5. Update Google Maps API key restrictions
In Google Cloud Console, add your production domain:
- `thespotfresno.com/*`
- `www.thespotfresno.com/*`
Remove `localhost:*` once you're done testing.

### 6. Update your Instagram link-in-bio
Point it to: **thespotfresno.com**

---

## Admin access

- **On your domain:** Go to `thespotfresno.com?admin=1`
- **Secret access:** Tap "The Spot" logo in the header 5 times quickly
- **Password:** 123Cpatt123 (change this in App.jsx before going live — search for ADMIN_PW)

⚠️ **IMPORTANT: Change your admin password before launching publicly.** Search for `const ADMIN_PW = "123Cpatt123"` in App.jsx and replace it with something secure.

---

## Adding AI concierge later

When you're ready to add the full Claude-powered concierge:
1. Create an API route in Vercel: `api/concierge.js`
2. Add your Anthropic API key as a Vercel environment variable
3. The 15-line proxy function routes browser requests through your server
4. Update the `sendAi` function in App.jsx to call `/api/concierge` instead of the local search

I can build this for you whenever you're ready — just ask.

---

## Costs at launch

| Service | Free tier | Cost |
|---|---|---|
| Vercel hosting | 100GB bandwidth/mo | $0 |
| Supabase | 50K rows, 500MB, 50K auth users | $0 |
| Google Maps | $200/mo credit (28K loads) | $0 |
| Custom domain | You already own it | $0 |
| **Total** | | **$0/month** |
