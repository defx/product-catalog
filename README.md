# Product Catalog

A cross-platform product catalog system built with Next.js, Express API, and Contentful CMS. This application provides a centralized way for customers to explore product offerings, organized by financial product categories.

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup

1. **Clone the repository**

   ```bash
   git clone git@github.com:defx/product-catalog.git
   cd product-catalog
   ```

2. **Install dependencies**

   ```bash
   # Install API dependencies
   cd api
   npm install

   # Install Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**

   The project uses [dotenvx](https://dotenvx.com/) for encrypted environment variable management. The encrypted `.env` file is already committed in the `api/` directory.

   Set the decryption key (provided in submission email):
   ```bash
   export DOTENV_PRIVATE_KEY="<key_from_email>"
   ```

   The frontend will automatically connect to the API running on `http://localhost:3001`

4. **Run the application**

   You'll need two terminal windows:

   ```bash
   # Terminal 1 - API Server
   cd api
   npm run dev
   # Runs on http://localhost:3001
   ```

   ```bash
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   # Runs on http://localhost:3000
   ```

5. **View the application**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Run tests** (optional)

   ```bash
   # Run API tests
   cd api
   npm test

   # Run Frontend tests
   cd frontend
   npm test
   ```

## Contentful CMS Access

The application uses Contentful as its headless CMS. You can log in and test content updates:

1. **Login to Contentful**: [https://app.contentful.com/](https://app.contentful.com/)

   - Credentials are provided in the submission email

2. **What you'll see**:

   - **Content model**: Category and Product content types
   - **Content entries**: Sample categories and products with images
   - **Assets**: Product images stored in Contentful's media library

3. **Test content updates**:
   - Navigate to "Content" in the Contentful dashboard
   - Edit any category or product (e.g., change a description, update an image)
   - Publish your changes
   - Refresh the frontend - changes appear immediately

The content model was created using migration scripts (found in `api/migrations/`) ensuring reproducibility and version control of the CMS schema.

## Testing

This project includes a comprehensive test suite that validates the acceptance criteria from the brief. Tests can be run without requiring manual verification of each requirement.

### Running Tests

```bash
# API tests (routes, services, integration)
cd api
npm test

# Frontend tests (components)
cd frontend
npm test

# Run with coverage
npm run test:coverage  # in either api/ or frontend/
```

### What's Tested

**API Layer** (`api/src/tests/`)
- ✅ Route tests validate API endpoints return correct data structure
- ✅ Service layer tests prove Contentful data transformation works
- ✅ Integration tests validate the complete CMS → API → Response flow
- ✅ Cross-platform API contract tests ensure mobile apps can consume data

**Frontend Layer** (`frontend/app/components/__tests__/`)
- ✅ Component tests validate categories and products render correctly
- ✅ Image and description display tests (brief requirements)
- ✅ Empty state handling

**What This Validates**:
- "Business user can update page" - Integration tests prove CMS updates flow through
- "Accessible by another platform" - API tests validate JSON responses for mobile consumption
- "Show an Image & Description" - Component and service tests verify this works
- "Display all Categories/Products" - Route and component tests validate data display

See [TESTING.md](TESTING.md) for detailed testing strategy and philosophy.

## Architecture Overview

### Tech Stack

- **Frontend**: Next.js 16 (App Router) with TypeScript, Server-Side Rendering
- **API**: Express.js with TypeScript
- **CMS**: Contentful (headless CMS)
- **Data Fetching**: Server-side rendering (SSR) in Next.js
- **Type Sharing**: Shared TypeScript types package (`@moneybox/shared-types`)

### Key Architectural Decisions

**1. Separate API Server**

- The Express API runs independently from Next.js
- Enables cross-platform access (requirement: "accessible by another platform")
- Future mobile apps or other clients can consume the same API
- API endpoints:
  - `GET /api/categories` - Returns all categories
  - `GET /api/products` - Returns all products (with optional `?categoryId=` filter)

**2. Server-Side Rendering**

- Product catalog content is rendered on the server
- Benefits: SEO-friendly, fast initial page load
- Content is relatively static (doesn't change per user)
- No client-side data fetching complexity for this use case

**3. Migration-Based CMS Setup**

- Content models defined in code (`api/migrations/`)
- Reproducible across environments
- Version controlled schema changes
- Can be run on any Contentful space to recreate the structure

**4. Service Layer Pattern**

- Contentful service (`api/src/services/contentful.ts`) decouples CMS from API
- Maps Contentful's raw data structure to clean domain models
- Makes it easier to swap CMS providers in the future

**5. Rich Text from Day One**

- Product and category descriptions use Contentful's rich text format
- Returns structured JSON (can be rendered on web, mobile, etc.)
- Frontend uses `@contentful/rich-text-react-renderer`

### Project Structure

```
/
├── api/                          # Express API server (port 3001)
│   ├── migrations/               # Contentful content model migrations
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   ├── services/            # Contentful service layer
│   │   └── server.ts
│   └── package.json
├── frontend/                     # Next.js application (port 3000)
│   ├── app/
│   │   ├── components/          # React components
│   │   ├── lib/api.ts           # API client functions
│   │   └── page.tsx             # Homepage (SSR)
│   └── package.json
└── shared/
    └── types/                    # Shared TypeScript interfaces
        └── index.ts              # Category & Product types
```

## Development Approach

This project follows **Shape Up's principle** of building one meaningful vertical slice end-to-end early, then iterating. Rather than trying to complete all requirements simultaneously, the work was prioritized in phases:

### Phase 1.1: Project Setup ✅

- Next.js frontend and Express API scaffolded
- TypeScript configured across both projects
- CORS and environment configuration
- Shared types package created

### Phase 1.2: Minimal CMS Integration ✅

- Contentful SDK integrated
- Content models created (Category, Product)
- End-to-end vertical slice working:
  - Sample category and product with image in Contentful
  - API endpoints returning data
  - Frontend rendering categories and products
  - Rich text descriptions working
  - Images from Contentful CDN displaying

**Why this approach?**

- Validates the entire technical architecture early
- Proves that content updates work before building full UI
- De-risks the cross-platform requirement (API is proven to work)
- Establishes patterns for the team to follow
- Allows early feedback on technical decisions

### Phase 2.1: Expand Content & UI (In Progress)

- ✅ Add all product categories (ISAs, Pensions, Savings, Investments)
- ✅ Add all products with images and descriptions
- Add tests for existing functionality (API routes, components)
- Build CategoryCarousel component (see [Wireframe.png](Wireframe.png))
- Build ProductAccordion component (see [Wireframe.png](Wireframe.png))
- Implement CSS styling and mobile-first responsive design

## Requirements Checklist

Based on the [brief's acceptance criteria](BRIEF.md) and [wireframe design](Wireframe.png):

| Requirement                                   | Status         | Implementation                                                                                                                              |
| --------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Business user can update page**             | ✅ Complete    | Contentful CMS with user login. No developer needed to add/edit categories or products.                                                     |
| **Accessible by another platform**            | ✅ Complete    | Separate Express API (port 3001) returns JSON. Mobile apps or other clients can consume same endpoints.                                     |
| **Display all categories**                    | ✅ Complete    | CategoryList component renders all categories from Contentful.                                                                              |
| **Display products within category**          | ✅ Complete    | ProductList component with category filtering. API supports `?categoryId=` query param.                                                     |
| **Show image & description for each product** | ✅ Complete    | Images from Contentful CDN. Rich text descriptions rendered with proper formatting.                                                         |
| **Meet UI requirements of wireframe**         | 🔄 In Progress | Phase 2.1 implementing CategoryCarousel and ProductAccordion to match wireframe. Currently showing semantic HTML structure without styling. |
| **Any required tests**                        | 🔄 In Progress | Tests being added iteratively alongside features (API routes, components, integration tests).                                               |

### Additional Evaluation Criteria

**Choice of Tech Stack & Architecture**

- React.js requirement met (Next.js)
- Express API for cross-platform requirement
- Contentful chosen for ease of use and robust asset management
- TypeScript for maintainability
- Migration-based schema for reproducibility

**Prioritization of Work**

- Focused on end-to-end integration first (Phase 1.2)
- Validated technical decisions early
- Left UI polish for Phase 2.1 (can iterate quickly once architecture is proven)

**Architectural Decisions**

- Service layer pattern decouples CMS from API contract
- Shared types prevent drift between frontend and backend
- SSR chosen for SEO and simplicity (no client-side state needed)

**Maintainability & Extensibility**

- TypeScript throughout
- Shared types package
- Migrations for schema changes
- Service layer makes CMS swappable
- API can serve multiple frontends (web, mobile, etc.)

**Clean & Modern UI**

- Phase 1.2: Semantic HTML structure without styling (proves data flow)
- Phase 2.1: In progress - implementing CSS styling and wireframe design

## Time Allocation

Given the 3-hour constraint, time was allocated as follows:

- **Phase 1.1** (~45 mins): Project setup, TypeScript config, CORS, shared types
- **Phase 1.2** (~1.5 hours): Contentful integration, migrations, API routes, rich text rendering, end-to-end testing
- **Phase 2.1** (In progress): Adding all products/categories, implementing tests, building UI components with styling

**Reasoning**: Building the complete technical architecture first ensures all requirements _can_ be met before investing time in UI polish. The working vertical slice proves:

- Business users can update content ✅
- Another platform can access data ✅
- Images and descriptions work ✅
- Category and product display works ✅

With the foundation proven and full product catalog added, work continues iteratively:

- Add tests for what's been built (API routes, components)
- Build new UI components (carousel, accordions)
- Add tests for new components
- Implement responsive styling

## What's Working Now

1. Start both servers (`api` and `frontend`)
2. Visit [http://localhost:3000](http://localhost:3000)
3. You'll see:
   - Sample category with rich text description
   - Sample product with image and rich text description
4. Log into Contentful and edit the content
5. Refresh the page - your changes appear immediately

This demonstrates the complete data flow from CMS → API → Frontend, validating all core technical requirements.

## Notes

- The application currently shows semantic HTML structure without CSS styling - focusing on proving technical architecture first
- All products and categories are loaded from Contentful (no hardcoded data)
- The wireframe-compliant UI (carousel, accordions, responsive styling) is in progress for Phase 2.1
- Tests are being added iteratively alongside new features
