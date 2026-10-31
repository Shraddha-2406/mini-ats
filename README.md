# Mini ATS — Intelligent Resume Screening System
**Phase 1 Frontend Prototype • Third-Year Engineering DBMS Mini Project**

Mini ATS is an intelligent recruitment SaaS platform prototype designed to automate resume screening, calculate skill matching scores, rank applicants deterministically, and simplify recruitment decisions.

---

## 🚀 Key Features & 9 Screens Implemented

1. **Screen 1 — Home / Landing Page (`/`)**:
   - Modern hero section with value proposition: *"Smarter Resume Screening. Better Hiring Decisions."*
   - Interactive dashboard preview mockup displaying live candidate ranking and match score ring.
   - Comprehensive feature highlights and 5-step recruitment workflow guide.
   - Quick one-click demo account switcher.

2. **Screen 2 — Login & Registration (`/auth`)**:
   - Split-screen design with recruitment branding and feature highlights.
   - Candidate / Recruiter role switcher and tabbed auth.
   - One-click demo login buttons for instant evaluation (Rahul Sharma, Priya Patil, Admin Recruiter).
   - Form validation, password visibility toggles, and session persistence in `localStorage`.

3. **Screen 3 — Candidate Dashboard (`/candidate`)**:
   - Welcome banner (*"Welcome back, Rahul!"*).
   - 4 Summary KPI cards: Profile Completion, Available Jobs, Applied Jobs, Shortlisted Applications.
   - Circular profile completion indicator with milestone checklist.
   - Real-time recommended positions ranked by skill compatibility.
   - Recent application activity log with recruitment status badges.
   - Resume attachment status card with Simulated PDF preview.

4. **Screen 4 — Resume Upload & Skills (`/resume-skills`)**:
   - **Section A**: Personal and academic credentials (education, degree, graduation year, experience).
   - **Section B**: Modern drag-and-drop PDF resume upload zone with simulated progress bar, file size validation, and document preview modal.
   - **Section C**: Searchable technical skill bank with categorized tags (Languages, Frontend, Backend, Databases, AI & Data, Tools) and custom skill input.
   - **Section D**: Dynamic profile completion percentage calculation.

5. **Screen 5 — Job Listings & Application (`/jobs`)**:
   - Keyword search across job titles, company names, and technical skills.
   - Multi-filter controls: Job Type (Full-Time, Remote, Hybrid, Internship) and Experience level.
   - Real-time skill match percentage pill on every job card (`80% Match`, `100% Match`).
   - Detailed job requisition modal with required skills breakdown and duplicate application prevention.

6. **Screen 6 — Recruiter Dashboard (`/recruiter`)**:
   - 4 Recharts data visualizations:
     1. *Applications by Job* (Bar Chart)
     2. *Candidate Match Score Distribution* (Donut Chart: High 80-100%, Moderate 50-79%, Low 0-49%)
     3. *Application Status Breakdown* (Pie Chart)
     4. *Application Activity Trend* (Area Chart)
   - 4 Summary KPI cards (Active Jobs, Total Applications, Shortlisted, Pending Reviews).
   - Recent applicants table with quick inline status updates.

7. **Screen 7 — Post & Manage Jobs (`/post-job`)**:
   - Complete job requisition form with title, company, description, location, type, and experience.
   - **Interactive Matching Threshold Slider (0% to 100%, default 80%)**: Configures automatic shortlisting criteria.
   - Skill bank selector and custom skill addition.
   - Job preview modal and "Manage Existing Jobs" tab with active/closed status toggles.

8. **Screen 8 — Candidate Screening & Ranking (`/screening`)**:
   - Dropdown selector to inspect applicant pools for any active job.
   - Automatic ranking table sorted by Match Score in descending order (`#1`, `#2`, `#3` with medal icons).
   - Color-coded score indicators (Emerald for 80-100%, Amber for 50-79%, Red for 0-49%).
   - Automatic Shortlisting when candidate score meets or exceeds the job's threshold.
   - Manual status overrides with instant feedback.
   - Deep candidate screening modal displaying calculation formula and contact info.

9. **Screen 9 — Match Results & Missing Skills (`/match-analysis`)**:
   - Large circular compatibility percentage gauge with dynamic color.
   - Side-by-side Skill Comparison Matrix: Matched Skills (green check chips) vs Missing Skills (rose chips).
   - Rule-based learning recommendations detailing exact skills needed to surpass the shortlist threshold.
   - Job switcher dropdown enabling candidates to test their profile against any requisition.

---

## 🧮 Core Skill Matching Algorithm

Located in [`src/services/matchingService.js`](src/services/matchingService.js):

$$\text{Match Score} = \left(\frac{\text{Number of Matched Required Skills}}{\text{Total Required Skills}}\right) \times 100$$

### Example:
- **Job Requires**: `[Python, SQL, Django, Git, REST API]` (5 skills, Threshold: 80%)
- **Candidate Has**: `[Python, SQL, Git, Django]` (4 skills)
- **Calculation**: $\frac{4}{5} \times 100 = 80\%$
- **Result**: $80\% \ge 80\%$ $\rightarrow$ **Shortlisted**
- **Missing Skills**: `[REST API]`

---

## 🗄️ Relational Database Schema Alignment (Phase 2 Readiness)

The frontend data service [`src/services/dataService.js`](src/services/dataService.js) strictly mirrors the 6 relational tables of our MySQL DBMS architecture:

1. `Users` (`id`, `name`, `email`, `role`, `phone`, `education`, `degree`, `resumeMeta`)
2. `Skills` (`id`, `name`, `category`)
3. `User_Skills` (`userId`, `skillName`)
4. `Jobs` (`id`, `recruiterId`, `title`, `company`, `threshold`, `type`, `location`)
5. `Job_Skills` (`jobId`, `skillName`)
6. `Applications` (`id`, `jobId`, `candidateId`, `matchScore`, `status`, `appliedDate`)

In Phase 2, the functions in `dataService.js` can be substituted with Python Flask REST endpoints (`fetch('/api/jobs')`) without altering any React UI components.

---

## 👥 Demo Accounts

| Role | Name | Email | Password | Preloaded Skills |
| :--- | :--- | :--- | :--- | :--- |
| **Candidate** | Rahul Sharma | `rahul.sharma@example.com` | `password123` | Python, SQL, Git, Django (80% match on Python Dev) |
| **Candidate** | Priya Patil | `priya.patil@example.com` | `password123` | Python, SQL, Machine Learning, Data Analysis (75% match on ML Intern) |
| **Candidate** | Amit Deshmukh | `amit.deshmukh@example.com` | `password123` | Java, MySQL, HTML, CSS, Git (75% match on Java Dev) |
| **Candidate** | Sneha Kulkarni| `sneha.kulkarni@example.com` | `password123` | React, JavaScript, HTML, CSS, Git (100% match on Frontend Dev) |
| **Recruiter** | Admin Recruiter | `recruiter@technova.com` | `password123` | Talent Lead at TechNova Solutions |

*Tip: Use the "Switch User" dropdown in the top navigation bar to switch between any candidate and recruiter instantly during your demonstration.*

---

## 🛠️ How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```
Open **[http://127.0.0.1:5173/](http://127.0.0.1:5173/)** in your browser.

### 3. Run Matching Engine Verification Tests
```bash
npm run test:engine
```

### 4. Build for Production
```bash
npm run build
```
