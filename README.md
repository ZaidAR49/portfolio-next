# Portfolio Website

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![Made with ❤️](https://img.shields.io/badge/Made_with-❤️-ff69b4.svg?style=for-the-badge)

This portfolio website showcases my projects and skills, built with Next.js and TypeScript. It features a responsive design, smooth animations, and a user-friendly interface. The site includes sections for project details, skills, and contact information, providing a comprehensive overview of my work.

Demo: [UPDATE THIS LINK](https://zar.onrender.com/)

## ✨ Features

- **Responsive Design**: Optimized for all devices and screen sizes.
- **Dark/Light Theme**: Toggle between themes with smooth transitions.
- **Smooth Animations**: Powered by Framer Motion for an engaging user experience.
- **Modern UI**: Custom-styled UI utilizing the power of Tailwind CSS.
- **TypeScript**: Full type safety and a better development experience.
- **Contact Form**: Backend route integration with secure email functionality.
- **Error Handling**: Graceful error interception using Next.js `error.tsx` boundaries and custom `not-found.tsx` views for a robust user experience.
- **Caching Strategy**: Advanced data caching utilizing Next.js built-in cache mechanisms to minimize API calls and enhance response times.
- **Optimized Performance**: Leverages Next.js Server-Side Rendering (SSR) and file-based routing for blazing fast page loads and SEO.

### Backend & Data Management
- **Supabase Integration**: Uses Supabase as the primary database for storing user, project, skill, and experience data.
- **Cloudinary Integration**: Manages image uploads and optimization for profile pictures and project assets.
- **Admin Dashboard**: A secure, comprehensive dashboard to manage all portfolio content without touching code.
    - **Multiple Portfolios**: Create and switch between different portfolio profiles to tailor your CV for specific job applications.
    - **CRUD Operations**: Create, Read, Update, and Delete Portfolios, Skills, Projects, and Experiences.
    - **Stats & Analysis**: View real-time statistics about your portfolio data.
- **Data Import/Export**: 
    - **Export**: Download your entire portfolio data as a JSON file directly from the dashboard.
    - **Import**: Upload a JSON file to populate the dashboard with data instantly.
- **Security Layer**: Custom middleware (`security-code`) protects API endpoints to prevent unauthorized access.

## 🧰 Tech Stack

| Technology | Role |
|-----------|----------------------------------|
| **Next.js** | React framework for production & routing |
| **TypeScript**| Static typing for application logic |
| **Tailwind CSS**| Utility-first CSS styling framework |
| **Framer Motion**| Declarative animation library |
| **Supabase** | Primary relational database |
| **Cloudinary**| Asset and image hosting platform |

## 📋 Requirements

To run this project, you will need:

1.  **Node.js** (v18 or higher)
2.  **npm** or **yarn**
3.  **Supabase Account**: For database services.
4.  **Cloudinary Account**: For image hosting.

## 🛠️ Environment Variables

Create a `.env` file in the root directory with the exact following variables:

```env
# Server Configuration
PORT=3000

# Database (Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Image Hosting (Cloudinary)
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
NEXT_PUBLIC_FOLDER_NAME=folder_name

# Email Service (Contact Form)
EMAIL=your-email@gmail.com
PASSWORD=your-app-password

# Security
JWT_SECRET=your_secret_security_code_for_jwt
```

## 🚀 Getting Started

### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repository-url>
    cd portfolio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the development server**
    ```bash
    npm run dev
    ```
2. Open your browser and navigate to `http://localhost:3000`

## 📦 Static Deployment (Antigravity Branch)

This project supports a special static deployment workflow using the **"antigravity"** branch.

1.  **Generate Data**: Go to your Admin Dashboard in the local application.
2.  **Export JSON**: Use the "Export User Data" feature to download your `portfolio_data.json` containing all your info, projects, and skills.
3.  **Deploy**:
    > **replace "data.json" with your data.json in the "antigravity" branch.**
    
    (Simply placing your generated JSON file in the appropriate location on the `antigravity` branch allows strictly static deployment of your personalized portfolio).

## 🔐 Accessing the Dashboard

The Admin Dashboard is hidden by default. To access it:

1.  Scroll down to the **Contact** section (Footer).
2.  In the "Message" field, type the secret access code:
    > **zaidopendash**
3.  A secure modal will appear. It will automatically send a secondary security code to your email.
4.  Enter the code you received in your email to authenticate and enter the dashboard.

## 📁 Project Structure

```
portfolio/
├── src/                    # Main source code directory
│   ├── actions/            # Server actions for data mutation
│   ├── app/                # Next.js App Router (pages, layouts, error boundaries)
│   ├── assets/             # Static assets (images, icons)
│   ├── components/         # Reusable UI components
│   ├── config/             # Application configurations
│   ├── contexts/           # React Context providers for state management
│   ├── lib/                # Utility functions, helpers, and shared logic
│   ├── proxy.ts            # Custom proxy (not middleware) for request handling
│   ├── templates/          # Pre-defined templates for UI/UX
│   └── types/              # TypeScript type definitions and interfaces
├── public/                 # Static public assets
├── .env                    # Environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── postcss.config.mjs      # PostCSS configuration
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

## 👨💻 Author

**Zaid Radaideh**

- LinkedIn: [linkedin.com/in/zaid-radaideh](https://linkedin.com/in/zaid-radaideh)

## 🤝 Contributing

Contributions are welcome! Please fork the repository and open a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

For questions or collaboration opportunities, feel free to reach out:
- Email: zaidradaideh.dev@gmail.com

⭐ If you found this project helpful, please give it a star!