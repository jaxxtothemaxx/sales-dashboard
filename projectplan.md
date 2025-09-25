# **Project Plan: Product Metrics Dashboard**

## **Project Goal**

This project is designed to demonstrate core product management and technical skills by building a simple, front-end dashboard that visualizes key product metrics. The goal is to create a self-contained web application that showcases **SQL competency**, **data literacy**, and **product thinking**.

## **Technologies & Architecture**

The dashboard will be a single-page application (SPA) built with a modern, lightweight technology stack. The entire application will run in the browser without a separate backend server.

* **Frontend Framework:** React  
* **Styling:** Tailwind CSS for rapid and responsive UI development  
* **Database:** `sql.js` (an in-browser SQLite database)  
* **Data Visualization:** `Recharts`

**Architecture Overview:** The application will consist of a single React component that handles everything:

1. **Database Initialization:** The `sql.js` library will be loaded.  
2. **Data Population:** SQL queries will be used to create tables and insert mock data directly into the in-browser database.  
3. **Data Retrieval:** Key product metrics will be extracted from the database using SQL queries.  
4. **Visualization:** The retrieved data will be passed to `Recharts` components to create charts and tables for visualization.

   ## **Project Schedule & Phases**

   ### **Phase 1: Planning (Complete)**

* **Key Task:** Define project scope, goals, and technology stack.  
* **Action:** Create this project plan document.

  ### **Phase 2: Design & Development (1-2 Weeks)**

* **Key Task:** Develop the core dashboard functionality.  
* **Actions:**  
  * Set up a Vite-React project with Tailwind CSS.  
  * Install `sql.js` and `Recharts` as production dependencies.  
  * Create a single React component (`App.jsx`) to house all logic.  
  * Use `useEffect` to initialize the `sql.js` database and populate it with mock data.  
  * Write SQL queries to retrieve data for key metrics:  
    * User signups over time.  
    * User distribution by country.  
    * Product feature usage.  
    * Recent user activity (table view).  
  * Use `Recharts` to display the data in a responsive and clear manner.

  ### **Phase 3: Polish & Documentation (1 Week)**

* **Key Task:** Refine the dashboard and prepare it for presentation.  
* **Actions:**  
  * Add comments to the `App.jsx` file, explaining each SQL query and the purpose of each chart.  
  * Write a `README.md` file for the project repository.  
  * Explain the project's purpose, technology stack, and how to run it.  
  * Include a section on the "What it Demonstrates" from the original prompt to highlight the product management skills.

  ## **Project Deliverables**

* A single, self-contained `App.jsx` file that renders the dashboard.  
* A `README.md` file that clearly explains the project.  
* A live demo of the dashboard (hosted on a service like Netlify or Vercel).

