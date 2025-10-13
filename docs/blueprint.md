# **App Name**: Stryk Mining Platform

## Core Features:

- Real-time Mining Simulation: Simulate airdrop mining with live balance accrual and real-time updates.
- Referral Program: Implement a referral system where users earn bonuses by inviting others. It requires Solana wallet login for referral validity.
- Ranking Tiers and Leaderboard: Display user rankings based on their balance and allow filtering by tier/time range.
- Task System: Load tasks from `tasks.json` and manage task completion with server-side or external verification methods.
- Withdrawal Management: Implement a withdrawal system with admin-controlled toggles.
- Fraud Detection: Monitor unusual account activities and prevent cheating using account heuristics. Use a tool to watch patterns in mining and flag suspicious activity to the administrator.
- Admin Dashboard: Provide an interface for managing tasks, withdrawals, and monitoring accounts. Suspend two accounts from the same IP for 5 days, ban cheaters for life
- Configurable Tabs: Loads the tabs on the navigation bar from JSON, and the JSON contains the code for the tab contents. Allows adding tabs without redeploying.

## Style Guidelines:

- Primary color: Deep slate blue (#29435A), evoking a cold, futuristic atmosphere.
- Background color: Deep charcoal (#121212), creating a dark and immersive theme.
- Accent color: Icy blue (#A0D4FF), used for highlights and interactive elements, providing contrast and visual interest.
- Headline font: 'Space Grotesk' (sans-serif) for a modern, tech-inspired feel.
- Body font: 'Inter' (sans-serif) providing readability and a neutral aesthetic.
- Use minimalist icons with a thin stroke, consistent with the futuristic theme.
- Mobile-first layout with clear navigation (Home, Mining/Tasks, Rankings, Withdrawals, Profile).
- Subtle micro-animations for balance updates and progress bar changes.