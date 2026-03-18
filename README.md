# StayHub - Modern Accommodation Rental Platform

A premium, full-featured accommodation rental platform built with Next.js 15, React, Framer Motion, Supabase, and Tailwind CSS. Features a sticky search bar, modern UI/UX, user and host dashboards, messaging system, and comprehensive booking management.

## Features

### 🏠 For Guests
- **Smart Search**: Sticky search bar with advanced filtering (location, dates, guests, price range, property type, amenities)
- **Browse Listings**: Beautiful grid/list view with sorting options (price, rating)
- **Listing Details**: Comprehensive property information with image gallery, amenities, host info, and pricing
- **User Dashboard**: Profile management, saved listings, trip history, messages
- **Wishlist Management**: Save favorite properties for later

### 👨‍💼 For Hosts
- **Host Dashboard**: Real-time earnings, booking statistics, and performance metrics
- **Listing Management**: Create, edit, and monitor multiple properties
- **Booking System**: Manage upcoming bookings, guest requests, and confirmations
- **Analytics**: Track earnings, occupancy rates, and booking trends
- **Superhost Recognition**: Rating and review system with response time tracking

### 💬 Messaging & Communication
- **Real-time Chat**: Instant messaging between guests and hosts
- **Conversation Management**: Organized message threads with unread indicators
- **Typing Indicators**: See when the other person is typing

### 🎨 Design & UX
- **Modern Design System**: Purple-to-indigo primary colors with coral accents
- **Smooth Animations**: Framer Motion for fluid interactions and transitions
- **Responsive Layout**: Mobile-first design that works on all devices
- **Glassmorphism Effects**: Modern frosted glass UI elements
- **Dark Mode Support**: Full dark theme implementation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui + custom components
- **Data Fetching**: SWR (for client-side caching)
- **Icons**: Lucide React

## Project Structure

```
app/
├── page.tsx                    # Homepage with hero and featured listings
├── search/
│   └── page.tsx               # Search results with advanced filtering
├── listing/
│   └── [id]/page.tsx          # Listing details page
├── auth/
│   ├── login/page.tsx         # Login page
│   └── signup/page.tsx        # Sign up page
├── dashboard/
│   └── page.tsx               # Guest dashboard
├── host/
│   └── dashboard/page.tsx     # Host dashboard
├── messages/
│   └── page.tsx               # Messaging interface
└── globals.css                # Global styles and theme

components/
├── header/
│   └── search-header.tsx      # Sticky search header
├── listings/
│   └── listing-card.tsx       # Listing card component
├── search/
│   └── filter-sidebar.tsx     # Advanced filters
└── messaging/
    └── chat-window.tsx        # Chat interface

lib/
├── supabase/
│   ├── client.ts              # Browser client
│   ├── server.ts              # Server client
│   └── middleware.ts          # Session management
└── store/
    └── search-store.ts        # Zustand search state

scripts/
├── 001_create_tables.sql      # Database schema
├── 002_create_rls_policies.sql # Row-level security
└── ...                         # Continue running scripts in numeric order
```

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account
- Git

### Installation

1. **Clone and install**
```bash
git clone <repository-url>
cd stayhub
pnpm install
```

2. **Setup environment variables**
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

3. **Setup database**
Run all SQL scripts in the `scripts/` folder in numeric order (001 → latest), including booking integrity guards:
- Execute `scripts/001_create_tables.sql`
- Execute `scripts/002_create_rls_policies.sql`
- Execute remaining scripts sequentially up to `scripts/016_booking_integrity_guards.sql`

4. **Run development server**
```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Key Features Explained

### Sticky Search Header
The search header remains fixed at the top of the page and compresses while scrolling. Features:
- Real-time location search
- Date range picker
- Guest count selector
- Responsive design on mobile

### Advanced Filtering
Filter listings by:
- Price range (min/max)
- Property type (apartment, villa, cabin, etc.)
- Amenities (WiFi, pool, kitchen, etc.)
- Guest capacity
- Location

### User Dashboard
Guests can:
- Manage profile and preferences
- View upcoming trips
- Access saved listings
- View messages and reviews

### Host Dashboard
Hosts can:
- Monitor earnings and bookings
- Manage listings
- Track analytics and metrics
- Respond to booking requests
- View guest messages

### Messaging System
- Organize conversations by contact
- See unread message count
- Real-time chat interface
- Typing indicators
- Timestamp on messages

## Database Schema

The app uses Supabase with the following main tables:
- `profiles`: User profiles
- `hosts`: Host-specific information
- `listings`: Property listings
- `listing_images`: Property images
- `bookings`: Booking records
- `reviews`: Guest reviews
- `messages`: Chat messages
- `conversations`: Messaging threads
- `wishlists`: Saved properties

All tables have proper Row-Level Security (RLS) policies for data protection.

## Future Enhancements

- Payment processing with Stripe
- Email notifications
- Advanced analytics dashboard
- Automated pricing suggestions
- Photo verification for hosts
- Map-based search
- Mobile app
- Calendar sync
- Review moderation
- Customer support system

## Styling & Customization

The color scheme uses OKLch color space:
- **Primary**: Indigo (oklch(0.55 0.25 265))
- **Accent**: Coral/Amber (oklch(0.62 0.22 35))
- **Secondary**: Light amber (oklch(0.95 0.015 45))

Modify `app/globals.css` to customize colors, spacing, and typography.

## Performance Optimization

- Server-side rendering for initial page load
- Image optimization with Next.js Image component
- Efficient database queries with proper indexing
- Client-side state management with Zustand
- Code splitting and lazy loading

## Security Considerations

- Row-Level Security (RLS) on all database tables
- Secure session management with HTTP-only cookies
- Password hashing with bcrypt
- CSRF protection
- Input validation and sanitization
- OAuth integration ready

## Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel Settings
4. Deploy with one click

For production:
- Enable RLS on all Supabase tables
- Set up automated backups
- Configure rate limiting
- Enable HTTPS
- Set up monitoring and alerting

## Support & Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using modern web technologies. Ready for production deployment!
