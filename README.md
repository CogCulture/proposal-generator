# 📋 CogCulture Proposal Generator

A premium, state-of-the-art web application for generating, managing, and exporting professional proposals with real-time preview, version history, and high-fidelity PDF exports. Built with dynamic HTML, vanilla CSS, and powered by Supabase for authentication and persistent cloud storage.

---

## 🌟 Key Features

- 💼 **Interactive Dashboard**: A sleek, unified control panel to track drafts, resume editing, clone, or securely delete proposals.
- 🎨 **Real-Time Live Preview**: Instantly watch proposal slides format and adjust as you type brand details and select services.
- ⚙️ **Dynamic Service Customization**: Collapsible list of core services (Annexure A, B1, B2, C) with editable tasks, quantities, and frequencies.
- 🔒 **Secure Authentication**: Fully integrated Supabase Auth flow with custom login/signup modals and an intelligent email verification helper.
- ⏳ **Auto-Save & Version Checkpoints**: Seamlessly syncs drafts to the cloud in the background, offering explicit manual saves and version history rollback.
- 📄 **High-Fidelity PDF Export**: Single-click export utilizing `html2canvas` and `jsPDF` to compile styled, pixel-perfect multi-page slides.

---

## 📂 Project Structure

The project has been structured cleanly for instant static hosting, separating concern layers across CSS, JavaScript, and asset folders:

```text
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD pipeline for GitHub Pages
├── assets/
│   ├── css/
│   │   ├── dashboard.css         # Modern styling for the home dashboard
│   │   ├── editor-auth.css       # Unified styles for auth inputs and modals
│   │   └── style.css             # Main styling for the editor and slides
│   ├── img/
│   │   ├── Annexure_A.jpg        # Design templates/slide backgrounds
│   │   ├── Annexure_B1.jpg
│   │   ├── Annexure_B2.jpg
│   │   ├── Annexure_C.jpg
│   │   ├── logo.png              # CogCulture brand logo
│   │   └── ... (additional UI graphics)
│   └── js/
│       ├── auth.js               # Handle login, signup, and active session states
│       ├── dashboard.js          # Core logic for proposals listing and dashboard actions
│       ├── editor-boot.js        # Bootstraps the editor with proper state and hooks
│       ├── main.js               # Primary editor, list splitting, and PDF compiler
│       ├── proposals.js          # Database save/read operations for proposal drafts
│       ├── services.js           # Services list definitions and dynamic configuration
│       └── supabase-config.js    # Supabase Client connection configurations
├── .gitignore                    # Local OS metadata, editor configurations, and logs
├── index.html                    # Application Dashboard entry page
├── editor.html                   # Proposal Editor and builder interface
└── README.md                     # Documentation
```

---

## 🚀 Local Development

To run the proposal generator locally:

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/CogCulture/proposal-generator.git
   ```
2. Open the repository folder.
3. Open `index.html` in your favorite web browser (or use a local development extension like Live Server in VS Code).
4. *Optional*: Update credentials in `assets/js/supabase-config.js` to link to your custom Supabase instance.

---

## 🌐 Deploying to GitHub Pages

This repository has been fully structured and prepared for direct deployment to **GitHub Pages**. All links and redirects have been written as **context-aware relative paths**, ensuring everything works flawlessly when served under a subdirectory (e.g. `https://CogCulture.github.io/proposal-generator/`).

### Step 1: Initialize Git and Push to GitHub

If you haven't pushed the latest structure to GitHub yet, run the following terminal commands inside your local project directory:

```bash
# Initialize Git repository
git init

# Add all files to staging
git add .

# Create the initial commit
git commit -m "chore: structure project for GitHub Pages deployment"

# Set the default branch to main
git branch -M main

# Link your local repo to the remote repository
git remote add origin https://github.com/CogCulture/proposal-generator.git

# Push changes to GitHub (use -f only if overriding an empty initial repository)
git push -u origin main
```

### Step 2: Enable GitHub Pages

Once your code is pushed to the `main` branch on GitHub:

1. Navigate to your repository on GitHub: `https://github.com/CogCulture/proposal-generator`
2. Click on the ⚙️ **Settings** tab.
3. In the left-hand menu, scroll down to the **Code and automation** section and click on **Pages**.
4. Under the **Build and deployment** section:
   - For **Source**, select **GitHub Actions** (highly recommended! Our custom workflow in `.github/workflows/deploy.yml` will automatically build and publish).
   - *Note*: If you choose **Deploy from a branch**, select the `main` branch and `/ (root)` folder, then click **Save**.
5. Once selected, GitHub will automatically queue the build job. You can monitor the progress under the **Actions** tab of your repository.
6. When the workflow completes successfully, your live site URL will be displayed (e.g., `https://CogCulture.github.io/proposal-generator/`).

---

## 🛠️ Customizing Database & Auth

The application is fully pre-configured to communicate with the CogCulture Supabase backend. If you want to deploy your own instance of the database:

1. Create a project at [Supabase.com](https://supabase.com).
2. Create a `proposals` table inside your Supabase Database with the required columns (e.g., `id`, `user_id`, `brand_name`, `ambassador_name`, `retainer_cost`, `payment_mode`, `selected_services`, `created_at`, `updated_at`, etc.).
3. Update `SUPABASE_URL` and `SUPABASE_ANON` in `assets/js/supabase-config.js` with your project API credentials.
4. Enable **Email Auth** in Supabase under `Authentication -> Providers`.

---

*Made with ❤️ by the CogCulture Design and Tech Team.*
