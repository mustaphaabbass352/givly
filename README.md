# 💚 Givly — Humanitarian Donation App

Real verified charities for Gaza, Ukraine, Sudan and more.
Google Sign-In via Supabase · 12 currencies · Donor history saved per user.

---

## ⚙️ STEP 1 — Set up Supabase

### 1a. Create your project
1. Go to https://supabase.com and sign in
2. Click **New Project**, give it a name e.g. `givly`
3. Wait ~2 mins for it to spin up

### 1b. Enable Google Sign-In
1. In Supabase dashboard → **Authentication** → **Providers** → toggle **Google** ON
2. Go to https://console.cloud.google.com → Create project → APIs & Services → Credentials → OAuth Client ID (Web)
3. Add Authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
4. Paste the Client ID & Secret back into Supabase
5. In Supabase → Authentication → URL Configuration, add:
   - Site URL: `https://YOUR-USERNAME.github.io`
   - Redirect URL: `https://YOUR-USERNAME.github.io/givly`

### 1c. Create the donation_logs table
Go to **SQL Editor** in Supabase and paste this:

```sql
create table donation_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  campaign_id integer not null,
  campaign_title text not null,
  org text not null,
  currency text not null,
  donated_at timestamptz default now()
);

alter table donation_logs enable row level security;

create policy "Users can insert own logs"
  on donation_logs for insert
  with check (auth.uid() = user_id);

create policy "Users can view own logs"
  on donation_logs for select
  using (auth.uid() = user_id);
```

### 1d. Get your API credentials
Go to **Project Settings** → **API** and copy:
- Project URL (e.g. `https://abcxyz.supabase.co`)
- anon public key (starts with `eyJ...`)

---

## 🔧 STEP 2 — Add credentials to the app

Open `src/App.js`, find the top and replace:
```js
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
```

Open `package.json` and replace:
```json
"homepage": "https://YOUR-USERNAME.github.io/givly"
```

---

## 🚀 STEP 3 — Deploy to GitHub Pages

```bash
npm install
git init
git add .
git commit -m "Launch Givly"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/givly.git
git push -u origin main
npm run deploy
```

Live at: **https://YOUR-USERNAME.github.io/givly** 🎉

Update anytime with just: `npm run deploy`
