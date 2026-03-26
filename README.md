# MutationImpact — Protein Mutation Impact Explorer

A full-stack web application for exploring predicted effects of human missense variants. Built as a coding assignment for the Beltrao Lab at ETH Zurich.

---

## Quick Start — Docker

The fastest way to run the application is with Docker Compose. From the repo root:

```bash
docker-compose up --build
```

Then open:

- **Frontend:** http://localhost:3000
- **API:** http://localhost:8080/swagger
- **Health check:** http://localhost:8080/health

The database is created and seeded automatically on first startup — no manual steps required.

---

## Local Development

### Prerequisites

- .NET 10 SDK
- Node.js 22+
- npm

### Backend

```bash
cd backend/ProteinMutation
dotnet restore
cd src/ProteinMutation.Api
dotnet run
```

API runs on `https://localhost:5000` by default.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

Create a `.env.local` file in the `frontend/` folder:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Project Structure

```
mutation-impact/
├── backend/
│   └── ProteinMutation/
│       ├── src/
│       │   ├── ProteinMutation.Api          # Controllers, middleware, mapping
│       │   ├── ProteinMutation.Application  # Services, DTOs, abstractions
│       │   ├── ProteinMutation.Domain       # Entities, value objects, enums
│       │   └── ProteinMutation.Infrastructure # EF Core, SQLite, TSV seeder
│       ├── tests/
│       │   └── ProteinMutation.UnitTests    # xUnit unit tests
│       └── data/
│           ├── missense_human_subset.tsv    # 32,053 variant predictions
│           └── structural_models/           # AlphaFold PDB files (3 proteins)
│
├── frontend/
│   ├── app/                                 # Next.js App Router pages
│   ├── components/                          # React components
│   ├── hooks/                               # Custom React hooks
│   ├── lib/                                 # API client, utilities
│   ├── dto/                                 # Zod validation schemas
│   └── types/                               # TypeScript interfaces
│
└── docker-compose.yml
```

---

## Tech Stack

### Backend

| Layer        | Technology                           |
| ------------ | ------------------------------------ |
| Framework    | ASP.NET Core 10                      |
| Architecture | Onion Architecture                   |
| ORM          | Entity Framework Core 9              |
| Database     | SQLite                               |
| Mapping      | AutoMapper                           |
| Testing      | xUnit, FluentAssertions, NSubstitute |

### Frontend

| Layer         | Technology                  |
| ------------- | --------------------------- |
| Framework     | Next.js 16 + TypeScript     |
| Styling       | Tailwind CSS v4 + shadcn/ui |
| Data fetching | TanStack Query              |
| Table         | TanStack Table              |
| Forms         | React Hook Form + Zod       |
| 3D Viewer     | Mol\*                       |
| Charts        | Recharts                    |
| Testing       | Vitest + Testing Library    |

---

## API Endpoints

| Method | Endpoint                            | Description                              |
| ------ | ----------------------------------- | ---------------------------------------- |
| `POST` | `/api/variants/batch`               | Submit one or more variants for analysis |
| `GET`  | `/api/variants/{variantId}`         | Single variant lookup                    |
| `GET`  | `/api/variants/protein/{proteinId}` | All variants for a protein               |
| `GET`  | `/api/variants/search?query=`       | Search by partial variant or protein ID  |
| `GET`  | `/api/proteins`                     | List all available protein IDs           |
| `GET`  | `/api/structures/{proteinId}`       | AlphaFold PDB file for Mol\* viewer      |
| `GET`  | `/health`                           | Health check                             |

### Batch submission format

```json
{
  "variants": ["Q7Z4H8 A126C", "Q7Z4H8/A126D", "P12235 G100A"]
}
```

Both space-separated (`Q7Z4H8 A126C`) and slash-separated (`Q7Z4H8/A126C`) formats are accepted.

---

## Dataset

The dataset contains 32,053 predicted missense variants across 3 proteins:

| Protein | Variants |
| ------- | -------- |
| Q8IUR5  | 16,758   |
| Q7Z4H8  | 9,633    |
| P12235  | 5,662    |

Each variant includes AlphaMissense pathogenicity scores, ESM1b likelihood ratios, predicted stability changes (ΔΔG), interface and pocket annotations, and a mechanistic label.

---

## Features

- **Batch variant submission** — paste one or more variants and retrieve matched predictions
- **Interactive results table** — sortable, filterable, paginated
- **3D structure viewer** — Mol\* viewer with residue highlighting at the mutation position
- **Variant comparison** — select two variants for side-by-side score comparison
- **Distribution charts** — AlphaMissense classification breakdown, mechanistic label distribution, pathogenicity score histogram
- **UniProt integration** — protein name, gene, organism and function fetched live from UniProt REST API
- **CSV export** — download all matched variants with full prediction fields
- **Search history** — last 5 searches saved locally for quick access
- **Shareable URLs** — results and comparisons are bookmarkable and shareable

---

## Running Tests

### Backend

```bash
cd backend/ProteinMutation
dotnet test
```

### Frontend

```bash
cd frontend
npm run test:run
```

---

## Architecture Notes

The backend follows **Onion Architecture** with four layers — Domain, Application, Infrastructure and API. The domain layer has zero external dependencies. Repository interfaces are defined in the Domain layer and implemented in Infrastructure. Services in the Application layer orchestrate domain logic and return DTOs. The API layer handles HTTP concerns, request/response mapping and exception handling via a global exception handler using `IExceptionHandler` and `ProblemDetails`.

The frontend uses the **Next.js App Router** with a clear separation between server and client components. Data fetching uses TanStack Query. The Mol\* viewer is loaded dynamically with SSR disabled. Search history is persisted in `localStorage` using a custom hook.

---

## References

- [AlphaMissense paper](https://www.science.org/doi/10.1126/science.adg7492)
- [Beltrao Lab preprint](https://www.biorxiv.org/content/10.1101/2024.05.29.596373v1)
- [EBI ProtVar](https://www.ebi.ac.uk/ProtVar/)
- [UniProt REST API](https://rest.uniprot.org)
- [Mol\* documentation](https://molstar.org)
