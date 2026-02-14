# Smart Bookmark App

A realtime bookmark management application built using Next.js (App Router), Supabase, and Tailwind CSS.  
Users can securely log in with Google and manage their personal bookmarks with realtime updates.

---

## Live Demo

http://localhost:3000/

---

## GitHub Repository

https://github.com/TatiSaiRaghava/smartbookmark-app

---

## Features

- Google OAuth authentication (Supabase Auth)
- Add bookmarks (Title + URL)
- Delete bookmarks
- Private bookmarks per user
- Row Level Security (RLS) enabled
- Realtime updates across multiple tabs
- Fully responsive UI

---

## Tech Stack

- Next.js (App Router)
- Supabase (Authentication, Database, Realtime)
- PostgreSQL (via Supabase)
- Tailwind CSS
- Vercel (Deployment)

---

## Database Schema

Table: `bookmarks`

- `id` (uuid, primary key)
- `title` (text)
- `url` (text)
- `user_id` (uuid, references auth.users)
- `created_at` (timestamp)

---

## Row Level Security (RLS)

RLS is enabled on the `bookmarks` table to ensure data privacy.

Policy condition:

(auth.uid() = user_id)

This ensures:

- Users can only view their own bookmarks
- Users can only insert bookmarks under their own user_id
- Users can only delete their own bookmarks

This prevents unauthorized data access between users.

---

## Realtime Functionality

Supabase Realtime is enabled for the `bookmarks` table.

Whenever a bookmark is added or deleted:
- Changes are instantly reflected across all open browser tabs
- No manual refresh is required

This improves user experience and ensures live synchronization.

---

## Environment Variables

The following environment variables are required:

NEXT_PUBLIC_SUPABASE_URL  
NEXT_PUBLIC_SUPABASE_ANON_KEY  

These should be configured in:

- `.env.local` (for local development)
- Vercel Environment Variables (for production)

---

## Installation & Setup

1. Clone the repository

```bash
git clone https://github.com/your-username/your-repository-name.git
