# 🚨 Mixed Content Issue - HTTPS → HTTP Blocked

## Problem
```
Mixed Content: The page at 'https://seafarer-management-l1ye.vercel.app/login' 
was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 
'http://176.9.184.190/token'. This request has been blocked.
```

Modern browsers block HTTP requests from HTTPS pages for security.

---

## Solution Options

### Option 1: Enable HTTPS on Backend (Best ✅)
Contact backend administrator to install SSL certificate on `176.9.184.190`

**Steps:**
1. Get SSL certificate (Let's Encrypt is free)
2. Configure web server (IIS/Apache/Nginx)
3. Backend URL becomes: `https://176.9.184.190`

### Option 2: Use Cloudflare Worker as CORS Proxy (Quick ⚡)

**Steps:**

1. **Go to Cloudflare Workers**
   - Visit: https://workers.cloudflare.com/
   - Sign up (free tier: 100,000 requests/day)

2. **Create New Worker**
   - Click "Create Worker"
   - Replace default code with `cloudflare-worker.js`
   - Deploy

3. **Get Worker URL**
   - Example: `https://seafarer-proxy.username.workers.dev`

4. **Update Frontend**
   - Edit `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://seafarer-proxy.username.workers.dev' // Your Worker URL
   };
   ```

5. **Rebuild & Deploy**
   ```bash
   npm run build
   git add .
   git commit -m "Use Cloudflare Worker proxy"
   git push origin master
   ```

### Option 3: Use Public CORS Proxy (Not Recommended ⚠️)

Update `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://cors-anywhere.herokuapp.com/http://176.9.184.190'
};
```

**Warning:** Public proxies are:
- Unreliable (may go down)
- Slow
- Security risk
- Rate limited

---

## Recommended Solution

**Use Cloudflare Worker (Option 2)**

**Advantages:**
- ✅ Free (100K requests/day)
- ✅ Fast (edge network)
- ✅ HTTPS enabled
- ✅ You control it
- ✅ 5 minutes setup

**Steps Summary:**
1. Create Cloudflare account
2. Deploy `cloudflare-worker.js`
3. Update `environment.prod.ts` with worker URL
4. Rebuild & deploy

---

## Alternative: Test Locally

For testing, you can bypass this by:

1. **Disable browser security (Chrome)**:
   ```
   chrome.exe --disable-web-security --user-data-dir="C:/temp/chrome-dev"
   ```

2. **Or test on localhost**:
   ```bash
   npm start
   # Visit: http://localhost:4200 (HTTP not HTTPS)
   ```

**Note:** This is only for testing! Production must use HTTPS properly.

---

## Need Help?

Contact me with:
1. Your Cloudflare Worker URL (if you choose Option 2)
2. Or confirmation that backend now supports HTTPS (Option 1)
