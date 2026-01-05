# Food Calorie Tracker

A clean, elegant web application for tracking daily calorie intake and looking up food nutrition information. Built with React, TypeScript, and Tailwind CSS, designed for deployment on GitHub Pages.

## Features

- **Quick Food Lookup**: Search through a database of 100+ common foods with instant results
- **Calorie Calculator**: Track daily intake with meal-by-meal breakdown
- **BMR/TDEE Calculator**: Calculate personalized calorie needs based on body metrics
- **Persistent Data**: All data saved locally in your browser
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Fast Performance**: Static site with no backend required

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Components**: Custom UI components (shadcn/ui-inspired)
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/food.git
cd food
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

## Project Structure

```
food/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── SearchBar.tsx    # Food search with autocomplete
│   │   ├── FoodCard.tsx     # Food display card
│   │   ├── FoodModal.tsx    # Food detail modal
│   │   ├── CalorieProgress.tsx  # Calorie tracking progress
│   │   ├── MealSection.tsx  # Meal logging section
│   │   └── CalculatorModal.tsx # BMR/TDEE calculator
│   ├── data/
│   │   └── foods.ts         # Static food database
│   ├── hooks/
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   └── Dashboard.tsx    # Daily tracking dashboard
│   ├── store/
│   │   └── dailyLogStore.ts # Zustand state store
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages deployment
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Deployment to GitHub Pages

1. **Push to GitHub**: Ensure your repository is pushed to GitHub

2. **Enable GitHub Pages**:
   - Go to your repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` folder

3. **Automatic Deployment**:
   - The `.github/workflows/deploy.yml` workflow automatically deploys on push to `main`
   - Your site will be available at `https://yourusername.github.io/food/`

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Food Database

The app includes a curated database of 100+ common foods with nutritional information:
- Calories per serving
- Protein, carbs, fat, fiber
- Multiple serving sizes
- Food categories and tags

## Browser Storage

- All user data is stored in `localStorage`
- Daily logs persist between sessions
- User preferences and goals are saved
- No backend or authentication required

## Future Enhancements

Potential features for future versions:
- USDA FoodData Central API integration
- User authentication with Firebase
- Cloud database sync
- Export data (CSV/JSON)
- Meal templates
- Photo food recognition (AI)
- Macro nutrient tracking
- Water intake tracking

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
