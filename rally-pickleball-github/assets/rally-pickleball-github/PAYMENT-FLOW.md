# Booking and payment flow — demo vs. production

## Demo journey

1. **Date & Time:** choose an active court/table, date, duration and available start hour. Browser-local conflict checks only.
2. **Customer Details:** name, email, phone, optional player count. Do not use real data for demonstrations.
3. **Payment QR:** an intentionally **non-scannable, non-payable sample QR placeholder** and the sample booking amount. Never transfer money.
4. **Upload Proof:** demo image picker (JPG/PNG/WebP up to 600 KB). This is *not* automatic payment confirmation.
5. **Booking Summary:** locally generated reference; booking status `Pending`, payment review `Proof submitted — unverified`.

Admin Demo > Bookings allows staff to view the uploaded sample proof and change payment-review/booking statuses locally.

## Production acceptance gates

- Client-owned verified payment merchant account and approved payment methods.
- Secure server-side PayMongo checkout session or merchant QR generated for that transaction.
- No merchant secret keys sent to the browser or committed to GitHub.
- Server-side reservation holds expire; idempotent booking and settlement logic prevents duplicates.
- Booking is confirmed only upon verified provider webhook or independent manual bank reconciliation.
- Proof upload alone cannot mark an order as paid.
- Store uploaded receipts in private storage with access controls, retention policies and antivirus/content validation.
- Server-enforced admin login, roles, audit trail, cancellation/refund process and end-to-end acceptance tests.

## Demo limits

No real money is charged. No actual QR is issued. No payment is verified. No booking is shared across devices. No 20-minute hold is enforced. All sample records are browser-local and may be cleared by the browser.
