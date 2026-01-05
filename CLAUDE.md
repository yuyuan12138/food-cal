# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Status

This repository is currently in planning phase. No code has been implemented yet. The `CLAUDE.md` file below contains the PRD (Product Requirements Document) for the planned Food Calorie Lookup & Calculation Website.

When code is added to this repository, this file should be updated with:
- Build, test, and development commands
- High-level architecture details
- Important patterns or conventions used in the codebase

---

# Product Requirements Document (PRD)
## Food Calorie Lookup & Calculation Website

---

## 1. Product Overview

### 1.1 Vision
A clean, elegant web application that enables users to quickly look up food calorie information and calculate daily calorie intake. The site will be deployed on GitHub Pages with a focus on simplicity, speed, and user experience.

### 1.2 Target Users
- Health-conscious individuals tracking daily caloric intake
- Fitness enthusiasts monitoring nutrition goals
- Anyone needing quick food calorie reference

### 1.3 Key Success Metrics
- Fast page load times (< 2 seconds)
- Quick food search results (< 500ms)
- Mobile-responsive design
- User retention for daily tracking

---

## 2. Core Features

### 2.1 Feature 1: Quick Food Calorie Lookup

**User Story**: As a user, I want to quickly search for any food and see its calorie content and basic nutritional information.

**Functional Requirements**:
- Search bar with autocomplete suggestions
- Display of calories per serving
- Additional nutritional data (protein, carbs, fat, fiber)
- Serving size adjustment
- Recent searches history
- Popular/common foods quick access

**UI Components**:
- Hero section with prominent search bar
- Search results card layout
- Food detail modal/panel
- Recent searches sidebar or section

### 2.2 Feature 2: Calorie Calculator

**User Story**: As a user, I want to add foods to my daily log and see my total calorie consumption.

**Functional Requirements**:
- Add foods to daily log from search results
- Display running total of calories consumed
- Show breakdown by meal (breakfast, lunch, dinner, snacks)
- Edit or remove entries
- Visual progress indicator vs. daily goal
- Daily calorie goal setting
- BMR/TDEE calculator for personalized goals

**UI Components**:
- Daily summary dashboard
- Meal sections with add/edit/delete
- Circular or linear progress bar
- Goal setting modal
- Date navigator

---

## 3. Technical Architecture

### 3.1 Deployment Challenge: GitHub Pages + Python Backend

**Important Consideration**: GitHub Pages only serves static sites (HTML/CSS/JS). A traditional Python backend cannot be hosted directly on GitHub Pages.

#### Recommended Architecture Options:

**Option A: Pure Frontend (Recommended for MVP)**
- Use JavaScript/TypeScript for all functionality
- Leverage client-side nutrition APIs directly
- Store data in localStorage
- No Python backend needed
- Fastest to deploy and simplest to maintain

**Option B: Hybrid - Python for Data Processing + Static Frontend**
- Use Python scripts to pre-process nutrition data
- Build static JSON files during development
- Deploy only static assets to GitHub Pages
- Python runs locally or via GitHub Actions during build

**Option C: Separate Backend Service**
- Frontend on GitHub Pages (React/Vue)
- Python API hosted separately (Render, Railway, Heroku free tier)
- CORS-enabled API calls
- More complex but enables database persistence

### 3.2 Data Source Recommendation

| Option | Pros | Cons |
|--------|------|------|
| **USDA FoodData Central API** | Official US data, comprehensive, free unlimited | US-focused foods only |
| **Open Food Facts API** | Global crowdsourced data, free and open | Less standardized |
| **Static JSON Database** | Fast, no API calls, works offline | Limited to pre-defined foods |
| **Combination Approach** | Best of both worlds | More complex |

**Recommended**: Start with static JSON of common foods (top 500-1000) for instant results, fallback to USDA API for comprehensive searches.

---

## 4. Frontend Technology Stack

### Recommendation: **React + Vite + TypeScript**

**Rationale**:
| Criterion | React + Vite | Vue + Vite | Next.js |
|-----------|--------------|------------|---------|
| GitHub Pages Support | Excellent | Excellent | Requires config workaround |
| Build Speed | Very Fast (Vite) | Very Fast (Vite) | Moderate |
| Ecosystem | Largest | Large | Largest |
| Learning Curve | Moderate | Easier | Higher |
| TypeScript Support | Excellent | Excellent | Excellent |

**Tech Stack Details**:
```
Frontend Framework: React 18 with TypeScript
Build Tool: Vite 5
UI Component Library: shadcn/ui (elegant, customizable)
Styling: Tailwind CSS
State Management: Zustand (lightweight) or React Context
Forms: React Hook Form
Icons: Lucide React
Deployment: GitHub Pages via GitHub Actions
```

### Alternative: **Vue 3 + Vite + TypeScript**
If you prefer a gentler learning curve and more elegant syntax:
```
Frontend Framework: Vue 3 with TypeScript
Build Tool: Vite 5
UI Component Library: Element Plus or Naive UI
Styling: Tailwind CSS
State Management: Pinia
Deployment: GitHub Pages via GitHub Actions
```

---

## 5. UI/UX Design Principles

Based on research from leading calorie tracking apps ([Nutrio UI Kit](https://www.behance.net/gallery/206050315/Nutrio-Calorie-Counter-App-UI-Kit), [Dribbble nutrition designs](https://dribbble.com/shots/25812437-Nutrition-App-Design-Diet-Tracking-Calorie-Counter-App-UI-UX)):

### 5.1 Design Philosophy
- **Clean, minimalist layouts** - Avoid visual clutter ([Stormotion UX Guide](https://stormotion.io/blog/fitness-app-ux/))
- **Balanced color palette** - Use color to signify nutrition categories
- **Bold, readable typography** - Essential for food data readability
- **Color-coded sections** - Organize by meal type or nutrient

### 5.2 Color Scheme (Suggested)
```
Primary:      #10b981 (Emerald green - health/fitness)
Secondary:    #3b82f6 (Blue - information)
Accent:       #f59e0b (Amber - warnings/high calories)
Background:   #ffffff / #f9fafb (White/light gray)
Text:         #111827 (Near black)
```

### 5.3 Key UI Screens
1. **Landing/Home Page**: Hero section with search, value proposition
2. **Search Results**: Grid or list of food cards with key info
3. **Food Detail**: Full nutritional breakdown modal
4. **Daily Dashboard**: Calorie progress, meal sections, quick add
5. **Settings**: Goals, profile, preferences

---

## 6. Data Model (for localStorage or future backend)

### Food Item
```typescript
interface Food {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
  fiber?: number;   // grams
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}
```

### Daily Log Entry
```typescript
interface LogEntry {
  id: string;
  foodId: string;
  date: string;      // ISO date string
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  servings: number;
  timestamp: number;
}
```

### User Goals
```typescript
interface UserGoals {
  dailyCalorieTarget: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  weight?: number;
  height?: number;
  age?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
}
```

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Initialize React + Vite + TypeScript project
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Configure GitHub Pages deployment
- [ ] Create base layout with navigation
- [ ] Set up project structure and routing

### Phase 2: Food Lookup (Week 2)
- [ ] Create static food database (common foods JSON)
- [ ] Build search component with filtering
- [ ] Design food card component
- [ ] Implement food detail modal
- [ ] Add recent searches feature

### Phase 3: Calorie Calculator (Week 3)
- [ ] Design daily dashboard layout
- [ ] Implement add to log functionality
- [ ] Create meal sections (breakfast, lunch, dinner, snacks)
- [ ] Build calorie progress indicator
- [ ] Add edit/delete log entries
- [ ] Implement localStorage persistence

### Phase 4: Polish & Launch (Week 4)
- [ ] Responsive design testing
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] BMR/TDEE calculator
- [ ] Final UI polish
- [ ] Deploy to GitHub Pages

### Phase 5: Future Enhancements (Post-MVP)
- [ ] USDA API integration for comprehensive data
- [ ] User authentication (Firebase Auth)
- [ ] Cloud database sync
- [ ] Export data (CSV/JSON)
- [ ] Meal templates
- [ ] Photo food recognition (AI)

---

## 8. File Structure

```
food/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── SearchBar.tsx
│   │   ├── FoodCard.tsx
│   │   ├── FoodModal.tsx
│   │   ├── DailyDashboard.tsx
│   │   ├── CalorieProgress.tsx
│   │   └── MealSection.tsx
│   ├── data/
│   │   └── foods.json       # Static food database
│   ├── hooks/
│   │   ├── useFoodSearch.ts
│   │   └── useDailyLog.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   └── Dashboard.tsx
│   ├── store/
│   │   └── dailyLogStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages deployment
├── CLAUDE.md                 # This PRD
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 9. Open Questions for Discussion

1. **Backend Architecture**: Given GitHub Pages constraints, do you prefer:
   - Pure frontend approach (simplest, fastest)?
   - Python preprocessing + static frontend?
   - Separate hosted backend service?

2. **Data Source**: Should we:
   - Start with static common foods database?
   - Integrate USDA API from the start?
   - Use Open Food Facts API instead?

3. **Frontend Framework**: Based on research, I recommend **React + Vite + TypeScript**. Do you agree, or do you prefer **Vue 3**?

4. **User Accounts**: For MVP, localStorage is sufficient. Should we plan for user authentication in Phase 5?

---

## 10. Sources

- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide)
- [Open Food Facts API](https://world.openfoodfacts.org/)
- [GitHub Actions for React/Vue Deployment](https://medium.com/@73307hank/%E7%94%A8-vue-%E6%88%96-react-%E5%BF%AB%E9%80%9F%E9%83%A8%E7%BD%B2%E5%88%B0-github-pages-%E7%B5%90%E5%90%88-github-actions-%E5%AF%A6%E7%8F%BE%E8%87%AA%E5%8B%95%E5%8C%96%E6%B5%81%E7%A8%8B-ea77720d8df5)
- [Vite GitHub Pages Deployer](https://github.com/marketplace/actions/vite-github-pages-deployer)
- [Nutrition App UI/UX Case Study](https://medium.muz.li/ui-ux-case-study-nutrition-tracking-app-5908c8df02c2)
- [Fitness App Design Best Practices](https://stormotion.io/blog/fitness-app-ux/)
- [Nutrio Calorie Counter UI Kit](https://www.behance.net/gallery/206050315/Nutrio-Calorie-Counter-App-UI-Kit)
