# Smart Study Advisor

A course recommendation system built with multiple programming paradigms. Offers two recommendation pipelines: a **non-AI** path powered by a Prolog inference engine, and an **AI** path using Google Gemini.

### Paradigm Usage

| Paradigm | Where | Why |
|---|---|---|
| **Logic (Prolog)** | `api/prolog/rules.pl` | defines course facts, prerequisite chains, and recommendation rules. |
| **OOP** | `api/models.py` | Django models (`Major`, `Course`) encapsulate data with relationships. |
| **Functional** | `api/ai_is_calling.py` | Data transformation pipeline using `map`/`lambda` for normalizing topics, pure functions (`build_prompt`, `parse`) that take input and return output with no side effects.  |
| **Imperative** | `api/prolog_engine.py`, `api/views.py` | Sequential execution flow assert facts, run queries in order, collect results, clean up. |

## Prolog Knowledge Base

`api/prolog/rules.pl` contains:
- **Course facts**: `course(Name, Difficulty, Topic, Major)` ~300 courses across 20+ majors
- **Prerequisite facts**: `prerequisite(Course, PrerequisiteCourse)`
- **Dynamic predicates**: `completed/1`, `student_preference/1`, `prefers_difficulty/1`, `student_major/1` asserted per-request by the Python engine
- **Helper rules**:
  - `major_matches/1` if no major is asserted, matches any major
  - `effectively_completed/1` if you completed `math2`, `math1` is inferred as completed since it's a prerequisite

### Recommendation Fallback Chain

The engine tries progressively relaxed queries:

1. **Strict**: matches topic + difficulty + major
2. **Drop topic**: keeps difficulty + major
3. **Drop difficulty**: keeps topic + major
4. **Drop both**: major only

Each level has two clauses: one for courses with prerequisites (checks all are met), one for courses with no prerequisites.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/majors/` | List all majors |
| `GET` | `/api/courses/?major=<name>` | List course names for a major |
| `POST` | `/api/recommend/prolog/` | Prolog recommendation|
| `POST` | `/api/recommend/ai/` | AI recommendation (Gemini) |

### POST `/api/recommend/prolog/`

```json
{
    "liked_topics": ["mathematics", "algorithms"],
    "completed_courses": ["math1", "math2"],
    "preferred_difficulty": "hard",
    "major": "computer_and_systems"
}
```
### POST `/api/recommend/ai/`

Same request body. Uses Gemini to generate recommendations based on a structured prompt that includes the prerequisite graph from the Django database.

## Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Requires SWI-Prolog installed on the system (`sudo apt install swi-prolog`).

Create `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```

```bash
python manage.py migrate
python manage.py runserver
```

### Mobile App

```bash
npm install
npx expo start
```

## Tech Stack

- **Backend**: Django + Django REST Framework
- **Prolog Engine**: SWI-Prolog via PySwip
- **AI**: Google Gemini API (`gemini-2.5-flash`)
- **Mobile**: Expo / React Native (TypeScript)
- **Database**: SQLite
