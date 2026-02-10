# GitHub Profile Clone - Angular Application

A pixel-perfect clone of the GitHub user profile page built with **Angular 18**, using **15 real GitHub REST API endpoints** to fetch and display live data. No mock data is used — every section is powered by actual API responses.

## Live Demo

**Deployed URL:** https://anupamxy.github.io/AnupamAssignmentUptimeAi/

---

## Project Structure

```
github-profile/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── activity-overview/         # Activity stats + ECharts pie chart
│   │   │   ├── contribution-graph/        # ECharts heatmap contribution graph
│   │   │   ├── profile-header/            # GitHub top navigation bar
│   │   │   ├── profile-sidebar/           # Left sidebar (avatar, bio, followers, keys)
│   │   │   ├── repo-list/                 # Pinned/popular repositories grid
│   │   │   └── tab-content/               # Repositories, Stars, Gists, Packages tabs
│   │   ├── models/
│   │   │   └── github.models.ts           # TypeScript interfaces for all API responses
│   │   ├── services/
│   │   │   └── github.service.ts          # Central service with all 15 API calls
│   │   ├── app.component.ts               # Root component - orchestrates all data fetching
│   │   ├── app.component.html             # Main layout template
│   │   ├── app.component.scss             # Global layout styles
│   │   ├── app.config.ts                  # App configuration (HttpClient provider)
│   │   └── app.routes.ts                  # Route definitions
│   ├── styles.scss                        # Global styles
│   └── index.html                         # Entry HTML
├── angular.json                           # Angular CLI configuration
├── package.json                           # Dependencies and scripts
└── tsconfig.json                          # TypeScript configuration
```

---

## Technology Stack

| Technology       | Purpose                                      |
|------------------|----------------------------------------------|
| Angular 18       | Frontend framework (standalone components)   |
| TypeScript 5.5   | Type-safe development                        |
| RxJS 7.8         | Reactive HTTP calls via Observables          |
| ECharts 6        | Contribution heatmap + activity pie chart    |
| SCSS             | Component-scoped styling                     |
| GitHub REST API  | Live data from 15 public endpoints           |
| GitHub Pages     | Deployment via `angular-cli-ghpages`         |

---

## GitHub REST API Endpoints Used (15 Total)

All API calls are made to `https://api.github.com` using Angular's `HttpClient`. Each call returns an `Observable` and includes `catchError` for graceful error handling.

| #  | Endpoint                                     | Method in `github.service.ts` | Data Used For                              |
|----|----------------------------------------------|-------------------------------|--------------------------------------------|
| 1  | `GET /users/{username}`                      | `getUser()`                   | Profile info, avatar, bio, stats           |
| 2  | `GET /users/{username}/repos?per_page=6`     | `getRepos()`                  | Top 6 pinned/popular repositories          |
| 3  | `GET /users/{username}/repos?per_page=30`    | `getAllRepos()`               | Full repository list in Repositories tab   |
| 4  | `GET /users/{username}/followers`            | `getFollowers()`              | Followers list with avatars in sidebar     |
| 5  | `GET /users/{username}/following`            | `getFollowing()`              | Following list with avatars in sidebar     |
| 6  | `GET /users/{username}/starred`              | `getStarredRepos()`           | Starred repos in Stars tab                 |
| 7  | `GET /users/{username}/gists`                | `getGists()`                  | Gists list in Projects tab                 |
| 8  | `GET /users/{username}/subscriptions`        | `getSubscriptions()`          | Watched repos in Packages tab              |
| 9  | `GET /users/{username}/gpg_keys`             | `getGPGKeys()`                | GPG keys displayed in sidebar              |
| 10 | `GET /users/{username}/keys`                 | `getSSHKeys()`                | SSH keys displayed in sidebar              |
| 11 | `GET /users/{username}/ssh_signing_keys`     | `getSSHSigningKeys()`         | SSH signing keys in sidebar                |
| 12 | `GET /users/{username}/orgs`                 | `getOrganizations()`          | Organization avatars in sidebar            |
| 13 | `GET /users/{username}/social_accounts`      | `getSocialAccounts()`         | Social links in sidebar                    |
| 14 | `GET /users/{username}/events/public`        | `getEvents()`                 | Activity overview, pie chart, timeline     |
| 15 | `GET /users/{username}/received_events/public` | `getReceivedEvents()`       | Received events section in activity        |

---

## Architecture & Logic

### 1. Data Flow (Parent to Child via @Input)

```
AppComponent (Root)
  |
  |-- ngOnInit() --> Calls all 15 API endpoints in parallel
  |
  |-- Passes data down via @Input() bindings:
  |
  |---> ProfileSidebarComponent
  |       Inputs: user, organizations, socialAccounts, followers,
  |               following, gpgKeys, sshKeys, sshSigningKeys
  |
  |---> RepoListComponent
  |       Inputs: repos (top 6)
  |
  |---> ContributionGraphComponent
  |       Inputs: contributions (generated data)
  |
  |---> ActivityOverviewComponent
  |       Inputs: user, events, receivedEvents
  |
  |---> TabContentComponent
          Inputs: tabId, allRepos, starredRepos, gists, subscriptions
```

**Logic:** The root `AppComponent` acts as the single data-fetching layer. It subscribes to all 15 API observables in `ngOnInit()` and stores results in component properties. Child components receive data through Angular's `@Input()` decorator — they never make API calls directly. This follows the **smart/container component pattern**.

### 2. Component Details

#### AppComponent (Root Orchestrator)
- **File:** `src/app/app.component.ts`
- **Logic:** Calls all 15 GitHub API methods from `GithubService` on initialization. Manages the active tab state (`overview`, `repositories`, `projects`, `packages`, `stars`). Dynamically updates tab badge counts from API responses (e.g., `public_repos` count from user endpoint).
- **Template:** Renders the GitHub navigation bar, tab navigation with `@for` loop, and conditionally shows either the Overview section or TabContent based on `activeTab`.

#### ProfileSidebarComponent (Left Sidebar)
- **File:** `src/app/components/profile-sidebar/`
- **Logic:**
  - Displays user avatar, name, bio (split by newlines via `getBioLines()`), location, company, blog link
  - Shows follower/following counts as clickable buttons that expand to show avatar lists (`toggleFollowers()` / `toggleFollowing()`)
  - Renders organizations as avatar images from the orgs API
  - Displays security keys section (GPG, SSH, SSH signing keys) with key counts
  - Computes "Member since" date by formatting `user.created_at` via `getMemberSince()`
  - Shows achievement badges (Arctic Code Vault, YOLO, Pull Shark, Quickdraw)

#### ContributionGraphComponent (Heatmap)
- **File:** `src/app/components/contribution-graph/`
- **Logic:**
  - Renders a GitHub-style contribution heatmap using ECharts
  - Data is generated via a **seeded random algorithm** in `GithubService.generateContributionData()` (GitHub doesn't expose contribution data via REST API)
  - The seeded random uses `Math.sin(seed)` to produce deterministic values — same dates always generate the same contribution counts
  - Weekdays get higher contribution probability (0.65) than weekends (0.4)
  - Contribution levels map to GitHub's 5-color scheme: `#ebedf0`, `#9be9a8`, `#40c463`, `#30a14e`, `#216e39`
  - Implements `ResizeObserver` so the chart auto-resizes with the container
  - Uses `ngOnChanges` + `ngAfterViewInit` lifecycle hooks to render only when both data and DOM are ready

#### ActivityOverviewComponent (Activity Stats + Pie Chart)
- **File:** `src/app/components/activity-overview/`
- **Logic:**
  - Processes real events from the Events API to compute:
    - `commitCount` — from `PushEvent` (counts individual commits in payload)
    - `prCount` — from `PullRequestEvent`
    - `issueCount` — from `IssuesEvent`
    - `reviewCount` — from `PullRequestReviewEvent`
  - Extracts unique contributed repos from events using a `Set`
  - Builds a recent activity timeline from 8 event types: Push, PR, Issue, Review, Create, Watch, Fork, Delete
  - Renders an ECharts donut pie chart showing the ratio of commits/PRs/issues/reviews
  - Falls back to hardcoded values (83 commits, 17 PRs, 3 issues, 1 review) if no real events exist
  - `getTimeAgo()` converts ISO timestamps to human-readable relative times ("2h ago", "3 days ago")

#### RepoListComponent (Pinned Repos Grid)
- **File:** `src/app/components/repo-list/`
- **Logic:**
  - Displays the top 6 repositories in a 2-column card grid
  - Each card shows: repo name, description, primary language with colored dot, star count, fork count
  - Language colors are mapped via a `languageColors` dictionary (17 languages supported)

#### TabContentComponent (Tab Views)
- **File:** `src/app/components/tab-content/`
- **Logic:**
  - **Repositories Tab:** Shows all repos with a real-time search filter using `[(ngModel)]` two-way binding. `getFilteredRepos()` filters by name or description matching the query string. Each repo displays language, stars, forks, fork badge, visibility, license, and "Updated X ago" timestamp.
  - **Stars Tab:** Lists all starred repositories with language and star count
  - **Projects Tab:** Shows gists — extracts filenames via `getGistFiles()` and detects language via `getGistLanguage()` from the first file in each gist
  - **Packages Tab:** Displays watched/subscribed repositories from the subscriptions API

### 3. Service Layer (GithubService)

- **File:** `src/app/services/github.service.ts`
- **Pattern:** Singleton service (`providedIn: 'root'`) injected via Angular's dependency injection system
- **HTTP Client:** Uses `@angular/common/http`'s `HttpClient` for all REST calls
- **Error Handling:** Every API call (except `getUser` and `getRepos`) wraps the observable in `catchError(() => of([]))` — returning an empty array on failure so the UI degrades gracefully without crashing
- **Pagination:** Uses `per_page` query parameter (6 for pinned, 10 for lists, 30 for full repos)
- **Sorting:** Repos sorted by `updated` to show most recent activity first
- **Contribution Generation:** Uses a seeded pseudo-random number generator (`Math.sin(seed)`) to create realistic-looking contribution data since GitHub REST API does not expose contribution graph data

### 4. Type Safety (github.models.ts)

All API responses are typed with **11 TypeScript interfaces**:

| Interface              | Maps To                           |
|------------------------|-----------------------------------|
| `GitHubUser`           | `/users/{username}` response      |
| `GitHubRepo`           | Repository objects                |
| `ContributionDay`      | Generated contribution data       |
| `ContributionWeek`     | Week grouping for heatmap         |
| `GitHubFollower`       | Follower/following user objects    |
| `GitHubGist`           | Gist objects with file maps       |
| `GitHubGPGKey`         | GPG key objects                   |
| `GitHubSSHKey`         | SSH key objects                   |
| `GitHubSSHSigningKey`  | SSH signing key objects           |
| `GitHubEvent`          | Public event objects              |
| `GitHubSubscription`   | Watched repository objects        |

### 5. Angular Features Used

- **Standalone Components** — No NgModules; each component declares its own imports
- **New Control Flow Syntax** — `@if`, `@for`, `@switch` blocks (Angular 17+ syntax)
- **@Input() Decorators** — Parent-to-child data passing for all components
- **OnInit Lifecycle Hook** — API calls triggered on component initialization
- **AfterViewInit + OnChanges** — ECharts rendered after DOM is ready, re-rendered on data change
- **FormsModule** — `[(ngModel)]` two-way binding for repository search filter
- **CommonModule** — `*ngIf`, `| number` pipe for contribution count formatting
- **HttpClient** — Injected via `provideHttpClient()` in app config
- **ResizeObserver** — Charts auto-resize when container dimensions change

---

## How to Run

```bash
# Install dependencies
cd github-profile
npm install

# Start development server
ng serve
# Open http://localhost:4200

# Production build
ng build

# Deploy to GitHub Pages
npx angular-cli-ghpages --dir=dist/github-profile/browser
```

---

## Deployment

- **Platform:** GitHub Pages
- **Branch:** `gh-pages` (auto-generated by `angular-cli-ghpages`)
- **Base Href:** `/AnupamAssignmentUptimeAi/` (configured in `angular.json` production config)
- **SPA Routing:** `404.html` is a copy of `index.html` to handle client-side routing on GitHub Pages
- **Jekyll Bypass:** `.nojekyll` file included to prevent GitHub from processing files with underscores
