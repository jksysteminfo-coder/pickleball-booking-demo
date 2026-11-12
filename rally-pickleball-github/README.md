# RALLY Pickleball — Client Presentation Website

Interactive, responsive sample website for a **₱40,000 single-location pickleball court booking package**.

## What you can demo

- Public homepage, court and table cards, rates, latest announcements, contact details
- Booking calendar with time-slot and duration selection
- Basic booking-conflict prevention **within one browser's local demo data**
- Booking request with demo reference number and a pending status
- Admin demo dashboard with booking list, add/edit/reschedule/confirm/cancel bookings
- Admin add/edit/archive courts and bookable tables, including standard and peak rates
- Admin create/edit/publish/unpublish promotions, club news and events
- Admin change company name, logo, hero copy, banner, brand color, phone, email and hours
- Sample report tiles and reset-demo control
- Responsive mobile and desktop layout

## Run locally

This is a dependency-free static project. Open `index.html` in a browser, or serve it from any simple static file server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment (client-owned Netlify and GitHub)

1. **Create a new GitHub repository**, e.g. `pickleball-booking-demo`, in the client's organization/account (or your own while negotiating).
2. Upload or push all files in this folder to the repository root.
3. In Netlify, choose **Add new project → Import an existing project → GitHub**, authorize the repository and select it.
4. This project needs no build command. Publish directory is `.` (set in `netlify.toml`).
5. Netlify will provide a `*.netlify.app` preview URL. Add the client's domain after approval.

### Git commands (in this project folder)

```bash
git init
git add .
git commit -m "Add RALLY Pickleball client demo"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pickleball-booking-demo.git
git push -u origin main
```

Create the remote GitHub repository before running `git push`. Never commit secret keys or personal merchant credentials.

## Demo vs. production (important)

**This is NOT a deployable real-money booking system.** It does not have:

- Admin/customer authentication or user permissions
- A shared server database or concurrency-safe double-booking protection across users/devices
- PayMongo payments, payment reconciliation, refunds or verified webhooks
- Actual email/SMS notification delivery
- Server-side validation, backup policy, transaction audit logs or production security hardening

All bookings, posts, settings and courts are saved only in the viewer's browser via `localStorage`. Different devices will show separate data. The admin switch is intentionally not secured. Do not collect real customer data or accept real transactions using this demo.

For production, build server-side booking APIs with atomic slot reservations, a shared PostgreSQL database, secure admin authentication and RBAC, verified webhook processing, rate limiting, backup/recovery and a tested cancellation/refund policy. Payment gateway approval is handled by the client's merchant account.

## Sample business branding

The placeholder brand **RALLY Pickleball Club** and all sample contact data, court prices and announcements can be replaced in **Admin Demo → Business Settings**. No company information was assumed to be the client's actual details.

## Developer notes

- Stack: plain HTML, CSS, JavaScript, localStorage; no npm install required.
- Entry point: `index.html`.
- Styling: `assets/styles.css`.
- Logic: `assets/app.js`.
- Demo assets: `assets/court-art.svg`, `assets/favicon.svg`.
- Hosting configuration: `netlify.toml`.
- No external analytics or payment calls. Google Fonts load when Internet is available; system font fallback works offline.

## Smoke tests

Run `node tests/smoke.js` to check initial rendering and browser-demo workflows without external dependencies. This is a logic smoke test, not a full cross-browser or production security test.
