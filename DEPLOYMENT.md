# Seafarer Management System - Deployment Guide

## 🚀 Vercel Deployment

### Backend Configuration
The application connects to the backend API at: `http://176.9.184.190`

### ⚠️ IMPORTANT: Backend CORS Configuration Required

The backend server MUST allow CORS requests from Vercel. Add these headers to the backend:

```
Access-Control-Allow-Origin: https://seafarer-management-l1ye.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### API Endpoints Used
- `GET /token` - Authentication (OAuth2)
- `GET /api/MarineServices/GetAllSeafarers` - List seafarers
- `POST /api/MarineServices/SaveSeafarer` - Create/Update seafarer
- `POST /api/MarineServices/ActivateAndInActivateSeafarer` - Toggle status
- `GET /api/POS/FillEmployee` - Get employees dropdown
- `GET /api/LegalAffairs/FillVendor` - Get vendors dropdown

### Login Credentials
Use the same credentials as Postman:
- Username: `1`
- Password: `123456`

### Known Issues
1. **CORS**: If you get CORS errors, contact the backend administrator
2. **Mixed Content**: Backend uses HTTP (not HTTPS) - browsers may block it
3. **Network**: Backend must be accessible from Vercel servers

### Local Development
```bash
npm install
npm start
```

### Production Build
```bash
npm run build
```

### Deploy to Vercel
```bash
git push origin master
```
Vercel will automatically deploy on push.

---

## 📝 Notes
- Backend URL is configured in `src/environments/environment.prod.ts`
- Local development uses proxy configuration in `proxy.conf.json`
- Production deployment connects directly to `http://176.9.184.190`
