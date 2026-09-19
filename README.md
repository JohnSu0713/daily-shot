# Daily Shot

**Learn photography, one image at a time.**

Daily Shot is a lightweight PWA that builds photographic intuition through a simple daily loop: **Look → Think → Learn → Shoot**.

## Product

Each day, Daily Shot presents a public-domain photograph, asks a few observation questions before revealing context, teaches one focused visual concept, and ends with a short shooting practice.

### Initial experience

- Daily public-domain photography
- Observation-first learning flow
- Focused photography lesson
- Daily shooting practice
- Local progress tracking
- Installable PWA
- Responsive mobile-first interface
- Basic offline app shell

## Architecture

```text
app/                 Next.js application shell and routes
lib/content.ts       Learning content model
lib/artic.ts         Artwork provider integration
public/              PWA manifest, icon, service worker
.github/workflows/   CI/CD and GitHub Pages deployment
```

The initial content and artwork layers are intentionally separated from the UI so additional curricula, museum providers, persistence, and personalization can be introduced without restructuring the core experience.

## Artwork source

The initial provider uses the Art Institute of Chicago public API and requests public-domain photographs with available image assets. Images are delivered through the museum's IIIF service.

## Local development

Requirements: Node.js 20+

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Validate a production build with:

```bash
npm run typecheck
npm run build
```

## CI/CD

Pull requests to `main` run type checking and a production build. Pushes to `main` run the same validation and then deploy the static export to GitHub Pages using GitHub Actions.

GitHub Pages must use **GitHub Actions** as its deployment source in repository settings.

Production URL:

`https://johnsu0713.github.io/daily-shot/`

## PWA

The app includes a web app manifest, standalone display mode, app icon, and service worker. On supported mobile browsers it can be added to the home screen.

## Roadmap

- Curated curriculum mapped to specific photographs
- Persistent learning history
- Personal photo journal
- Image upload and practice reflection
- Multiple museum/open-access providers
- Better offline content strategy
- Accessibility and performance audits
- Automated tests

## Status

Early MVP. The architecture favors small modules and replaceable data providers while the core learning loop is being validated.