# Connect EMEA interns Manager

This is a web application designed for the Connect EMEA community to manage and track students' scores across various events. The app interacts with Airtable to fetch and store event data, allowing admins to easily manage events and student scores.

## Key Features

- **Event Management:** Admins can create, update, and manage events.
- **Student Scoring:** Track and update student scores for different events.
- **Airtable Integration:** Utilizes Airtable API to fetch and store event and scoring data.
- **Role-Based Access:** Admin and participant roles with different access levels.
- **Authentication:** Secure login and role-based access management using Firebase Authentication.
- **UI/UX Design:** Clean and responsive interface designed with ShadCN UI components and styled with Tailwind CSS.

## Technologies Used

- **Frontend:** React.js with ShadCN UI components and Tailwind CSS for styling.
- **Backend:** Airtable API for data management.
- **Authentication:** Firebase Authentication for secure and efficient login management.
- **UI/UX:** ShadCN UI for a consistent and user-friendly interface, combined with Tailwind CSS for responsive design.

## Usage

- **Admin Role:**
  - Add or update events.
  - Manage student scores for each event.
  - View detailed reports and analytics of event scores.

- **Participant Role:**
  - View event details.
  - Check personal and overall scores.

## Getting Started

To get started with the project, clone the repository and follow the setup instructions:

```bash
git clone https://github.com/muhammedshamil8/interns_manager.git
cd interns_manager
npm install
npm run dev
