# HETIC Hackathon Givaudan 2026

## About the project

Our team is developing an intelligent ordering platform as part of the HETIC Givaudan Hackathon 2026.

The goal is to simplify the product discovery and sample ordering process through an intelligent conversational assistant.

The platform aims to help customers:

- Describe their project and product needs.
- Answer questions from an intelligent assistant.
- Discover relevant product references.
- Prepare sample requests.
- Generate a summary of their needs for the sales representative.

## Main Features

The planned features include:

- **Intelligent Chatbot:** Understands customer needs and asks relevant questions.
- **Smart Questionnaire:** Collects important information about the customer's project.
- **Product Recommendations:** Suggests relevant product references based on customer requirements.
- **Sample Request:** Helps customers prepare a sample request.
- **Project Summary:** Generates a summary for the sales representative.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React.js, TypeScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI | Ollama, Open-source LLM |
| Communication | REST API, JSON |
| Version Control | Git, GitHub |

*Note: The proposed AI integration and some technical choices are still being evaluated.*

## Project Architecture

The application is organized into three main parts:

- **Frontend:** User interface and conversational experience.
- **Backend:** Business logic and REST API.
- **Services:** Database and AI integration.

## Git Workflow

We use the following branches:

- `main`: Stable version.
- `develop`: Integration branch.
- `feature/*`: New features.
- `hotfix/*`: Urgent fixes.

All changes must be submitted through Pull Requests.

Team members should review changes before merging into protected branches.

## Project Structure

```text
hackathon-app/
│
├── .github/
│   └── ISSUE_TEMPLATE/
│
├── docs/
│   └── ADR/
│       └── 001-choix-technologies.md
│
├── frontend/
│
├── backend/
│
└── README.md
```

*The project structure may evolve during development.*

## Team Organization

The project is organized into four teams:

- **Tech:** Architecture and application development.
- **Data:** Data collection, preparation and analysis.
- **Product:** User needs, features and user experience.
- **Evaluation:** Testing and evaluation of the solution.

## Documentation

Technical decisions, architecture and project documentation are stored in the `docs/` directory.

## Project Status

Currently in the design and development phase.

More information and installation instructions will be added as the project progresses.
