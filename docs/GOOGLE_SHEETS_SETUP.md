# Google Sheets Setup (Apps Script)

Google Sheets is a **reporting copy only** — Supabase remains the source of
truth. If this integration is missing or fails, the lead is still saved to
Supabase and sent to Privyr; the customer's success screen is never blocked
on this.

Sheet: https://docs.google.com/spreadsheets/d/1-4Ab2eT-ZRDx1KWEB4hgWGLEiPKJRf02gXr2kgg_Xhk/edit

## 1. Rename the file and tab

- File name: **Green Homes Wales Leads**
- Tab name: **Leads**

## 2. Add the header row

Paste these 32 headers into row 1 of the **Leads** tab, in this exact order:

```
Submission ID	Submitted At	Full Name	Telephone	Email	Postcode	Property Location	Ownership Status	Occupancy Status	Property Type	Listed Property	Recent New Build	Mains Gas Grid	Existing Heating	Funding Route	Eligibility Summary	UTM Source	UTM Medium	UTM Campaign	UTM Content	UTM Term	GCLID	GBRAID	WBRAID	FBCLID	Landing Page	Referrer	Enquiry Consent	Marketing Consent	Consent Version	Privyr Status	Google Sheets Status
```

## 3. Deploy the Apps Script

1. In the Sheet: **Extensions → Apps Script**.
2. Delete the default contents of `Code.gs` and paste in the contents of
   [`docs/google-apps-script/Code.gs`](./google-apps-script/Code.gs) from
   this repo.
3. Generate a long random secret (e.g. run `openssl rand -hex 32` in a
   terminal, or use any password generator — 32+ random characters).
4. Replace `REPLACE_WITH_A_LONG_RANDOM_SECRET` in the script with that
   value.
5. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (the shared secret is what actually
     protects it — Apps Script web apps can't do custom auth headers)
6. Click **Deploy**, authorize the script when prompted (it needs
   permission to edit this specific Sheet), then copy the **Web app URL**
   it gives you (ends in `/exec`).

## 4. Set the environment variables in Vercel

```
GOOGLE_SHEETS_WEBHOOK_URL=<the /exec URL from step 3.6>
GOOGLE_SHEETS_WEBHOOK_TOKEN=<the same secret you pasted into the script>
```

Never commit these to the repo or put them in `.env.example` with real
values.

## 5. Test it

Once both env vars are set (locally in `.env.local` for a dev test, or in
Vercel), submit the eligibility form with the marked test lead described in
`docs/DEPLOYMENT_CHECKLIST.md` and confirm a new row appears in the
**Leads** tab with `Google Sheets Status` eventually updated to `sent` in
Supabase (the Sheet row itself doesn't self-update that column — Supabase
tracks delivery status; the Sheet is just the append target).

## 6. If you'd rather use a Google Cloud service account instead (Option A)

This is the approach the client's brief calls "preferred," and is more
robust for higher volume (proper auth, no shared-secret-in-a-script), but
needs a GCP project. If you want to switch to it later: create a service
account in Google Cloud Console, enable the Sheets API, share the Sheet
with the service account's email as Editor, and swap
`lib/googleSheets.ts` to use `googleapis`'s `sheets.spreadsheets.values.append`
with a JWT client instead of the webhook `fetch` call. Ask and this can be
built out when you're ready to move to it.
