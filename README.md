**Developed by: Eng. Mohamed Yasser**

# Seafarer Management System

## Project Overview

The Seafarer Management System is a web application designed to help manage seafarer (maritime worker) information. This system allows users to:

- Log in securely with a username and password
- View a list of all seafarers in the system
- Add new seafarer records with their personal and professional details
- Edit existing seafarer information
- Activate or deactivate seafarer profiles

Think of it as a digital filing cabinet specifically built for managing seafarer records, accessible through your web browser.

### Who is this project for?

This project is suitable for:
- Maritime companies managing crew information
- HR departments in shipping companies
- Anyone who needs to track and manage seafarer credentials and information

## Technologies Used

This project uses several technologies working together. Here is what each one does in simple terms:

- **Angular**: A framework (pre-built structure) for building web applications. It helps create interactive web pages that respond quickly to user actions.
- **TypeScript**: A programming language that helps write more reliable code. It is like JavaScript but with extra safety features.
- **Node.js**: A tool that runs JavaScript code on your computer (not just in a browser). We need it to run the development server.
- **npm**: Node Package Manager - a tool that automatically downloads and installs all the code libraries this project needs.
- **RxJS**: A library for handling data that changes over time, like information coming from a server.
- **HTML/CSS**: The standard languages for creating and styling web pages.

## Prerequisites

Before you can run this project, you need to install Node.js on your computer.

### What is Node.js?

Node.js is a free program that allows your computer to run JavaScript code. We need it to:
- Install the project dependencies (other code libraries this project uses)
- Run a local development server to view the application in your browser

### Installing Node.js

Follow these steps to install Node.js:

#### For Windows Users:

1. Open your web browser and go to: https://nodejs.org/
2. You will see two download buttons. Click on the button that says **"LTS"** (Long Term Support). This is the stable, recommended version.
3. Once the file downloads, double-click it to start the installation.
4. Follow the installation wizard:
   - Click "Next"
   - Accept the license agreement
   - Keep clicking "Next" (the default settings are fine)
   - Click "Install"
   - Wait for the installation to complete
   - Click "Finish"

#### For Mac Users:

1. Go to: https://nodejs.org/
2. Download the **LTS** version for Mac
3. Open the downloaded file and follow the installation instructions
4. Enter your password when prompted

### Verifying Node.js Installation

After installing Node.js, you need to verify it was installed correctly.

#### How to Open Terminal/Command Prompt:

**On Windows:**
1. Click the Start button (Windows icon in bottom left corner)
2. Type "cmd" or "Command Prompt"
3. Press Enter
4. A black window will appear - this is your terminal

**On Mac:**
1. Press Command + Space to open Spotlight
2. Type "Terminal"
3. Press Enter

#### Check Node.js Version:

In the terminal window, type this command and press Enter:

```
node --version
```

You should see something like: `v16.20.0` or `v18.17.0` or similar.

Next, check npm (it comes with Node.js automatically):

```
npm --version
```

You should see something like: `8.19.4` or similar.

If both commands show version numbers, you are ready to proceed. If you see an error like "node is not recognized," restart your computer and try again.

## How to Run the Project

Now that you have Node.js installed, follow these steps to run the Seafarer Management System.

### Step 1: Open Terminal and Navigate to Project Folder

#### Opening Terminal:

Follow the same steps as in the "Verifying Node.js Installation" section above.

#### Navigate to the Project Folder:

In the terminal, you need to tell the computer where your project is located.

**On Windows:**

If your project is in `B:\ERB\Seafarer Management System\seafarer-management`, type:

```
cd "B:\ERB\Seafarer Management System\seafarer-management"
```

Then press Enter.

**On Mac/Linux:**

If your project is in `/Users/yourname/Documents/seafarer-management`, type:

```
cd /Users/yourname/Documents/seafarer-management
```

Then press Enter.

**Tip:** You can also:
1. Open the project folder in File Explorer (Windows) or Finder (Mac)
2. Hold Shift and right-click inside the folder (not on any file)
3. Select "Open PowerShell window here" or "Open Terminal here"

### Step 2: Install Dependencies

When you first download this project, it does not include all the necessary code libraries (because they would make the download huge). You need to install them.

In the terminal (while you are in the project folder), type:

```
npm install
```

Then press Enter.

**What does this do?**
- npm looks at the `package.json` file in the project
- It downloads all the required code libraries from the internet
- It stores them in a folder called `node_modules`
- This might take 2-5 minutes depending on your internet speed

You will see a lot of text scrolling in the terminal. This is normal. Wait until you see a message like "added XXX packages" and the terminal is ready for new commands again.

### Step 3: Configure the Backend API (Optional for Local Development)

This project connects to a backend server to store and retrieve seafarer data. For now, the project is pre-configured to work with a remote server, so you can skip this step if you just want to test the application.

If you need to change the backend server address, see the "Environment Variables" section below.

### Step 4: Start the Development Server

Now you are ready to run the application.

In the terminal, type:

```
npm start
```

Then press Enter.

**What does this do?**
- npm runs a local development server on your computer
- It compiles (translates) the TypeScript code into JavaScript
- It opens the application so you can view it in a web browser

You will see text scrolling in the terminal. Wait until you see something like:

```
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

This means the application is ready!

### Step 5: Open the Application in Your Browser

1. Open your web browser (Chrome, Firefox, Edge, Safari, etc.)
2. In the address bar, type:

```
http://localhost:4200
```

3. Press Enter

You should now see the Seafarer Management System login page.

**What is localhost:4200?**
- `localhost` means "this computer" - the application is running on your own machine
- `4200` is the port number - think of it as a specific door into your computer for this application

### Step 6: Log In to the Application

Use the credentials provided by your system administrator to log in. If you are testing, you may have been given test credentials.

## Environment Variables

### What is a .env file?

An environment file (`.env`) is a special file that stores configuration settings for your application. Think of it as a settings file where you can change important values without editing the actual code.

### Why use environment variables?

- To store sensitive information (like passwords or server addresses)
- To easily switch between different servers (development, testing, production)
- To keep configuration separate from code

### How to Configure the Backend URL

This project includes a file called `.env.example` which shows you what settings are available.

#### If you need to change the backend server:

1. Open the project folder in File Explorer (Windows) or Finder (Mac)
2. Find the file called `.env.example`
3. Right-click on it and select "Open with" > "Notepad" (Windows) or "TextEdit" (Mac)
4. You will see:

```
# Backend API Configuration for Vercel Deployment
# Copy this file to .env.production and update with your actual backend URL

# Production Backend URL
# Example: http://your-server.com or http://185.x.x.x:port
BACKEND_API_URL=http://localhost:50342

# Important Notes:
# 1. Make sure your backend has CORS enabled for your Vercel domain
# 2. Update environment.prod.ts with this URL before deploying
# 3. Your backend should accept requests from: https://seafarer-management-l1ye.vercel.app
```

5. The important line is: `BACKEND_API_URL=http://localhost:50342`
6. If your backend server is at a different address, you would create a copy of this file and change that URL

**Note:** For local development, the project uses the configuration in `proxy.conf.json` instead, which is already set up to connect to the remote backend server.

## Project Structure

Here is an overview of the important folders and files in this project:

```
seafarer-management/
├── src/                          # Source code folder (all your application code lives here)
│   ├── app/                      # Main application folder
│   │   ├── auth/                 # Login and authentication logic
│   │   ├── seafarers/            # Seafarer management features
│   │   │   ├── seafarer-list/    # Page showing list of all seafarers
│   │   │   ├── seafarer-form/    # Page for adding/editing seafarer information
│   │   │   └── seafarer.service.ts # Code that communicates with the backend server
│   │   ├── shared/               # Reusable components used across the app
│   │   └── app.module.ts         # Main configuration file for the application
│   ├── environments/             # Configuration for different environments (development/production)
│   ├── assets/                   # Images, icons, and other static files
│   ├── index.html                # The main HTML page
│   └── styles.css                # Global styling rules
│
├── node_modules/                 # Installed dependencies (created by npm install)
├── dist/                         # Compiled production-ready code (created when you build)
│
├── angular.json                  # Angular project configuration
├── package.json                  # Lists all dependencies and scripts
├── tsconfig.json                 # TypeScript compiler settings
├── proxy.conf.json               # Configuration for connecting to backend server
└── README.md                     # This file - project documentation

```

**Key Files Explained:**

- **package.json**: Lists all the code libraries this project needs and defines commands like `npm start`
- **angular.json**: Configuration file that tells Angular how to build and run the project
- **proxy.conf.json**: Tells the development server how to forward API requests to the backend server
- **src/app/app.module.ts**: The main entry point that sets up the entire application
- **src/index.html**: The HTML page that loads your application
- **src/environments/**: Contains different configuration files for development and production

## Common Errors and Fixes

### Error: "node is not recognized" or "npm is not recognized"

**Problem:** Your computer cannot find Node.js

**Fix:**
1. Restart your computer (this often fixes the issue after installing Node.js)
2. If it still does not work, reinstall Node.js
3. Make sure you are using Command Prompt (not PowerShell with restricted permissions)

### Error: "Port 4200 is already in use"

**Problem:** Another application is using port 4200, or you already have this application running in another terminal window

**Fix:**

**Option 1:** Close any other terminal windows running this project

**Option 2:** Stop the other application using port 4200

**Option 3:** Run on a different port:
```
npm start -- --port 4300
```

Then open `http://localhost:4300` in your browser

### Error: npm install fails or shows errors

**Problem:** Network issues, permission problems, or corrupted cache

**Fix:**

**Step 1:** Clear npm cache:
```
npm cache clean --force
```

**Step 2:** Delete node_modules folder and package-lock.json:
- In File Explorer, go to the project folder
- Delete the `node_modules` folder (if it exists)
- Delete the `package-lock.json` file (if it exists)

**Step 3:** Try installing again:
```
npm install
```

**Step 4:** If you still have issues on Windows, try running Command Prompt as Administrator:
- Right-click on Command Prompt
- Select "Run as Administrator"
- Navigate to the project folder again
- Run `npm install`

### Error: "Cannot find module" or compilation errors

**Problem:** Dependencies are not properly installed

**Fix:**

1. Make sure you ran `npm install` and it completed successfully
2. Try deleting `node_modules` and running `npm install` again
3. Make sure you are in the correct folder (the one containing `package.json`)

### Error: Login does not work or shows connection errors

**Problem:** The backend server might be down or unreachable

**Fix:**

1. Check your internet connection
2. Contact your system administrator to verify the backend server is running
3. Check the `proxy.conf.json` file to make sure it has the correct backend server address

### Warning: Security vulnerabilities found

**Problem:** npm might show messages about security vulnerabilities in dependencies

**Note:** This is common in older projects. For this specific Angular 12 project, these warnings are expected and do not prevent the application from running. If you want to fix them, you would need to upgrade to a newer version of Angular, which is a more complex task.

## How to Stop the Project

When you are done working with the application and want to stop the server:

### In the Terminal:

1. Go to the terminal window where you ran `npm start`
2. Press `Ctrl + C` (hold the Ctrl key and press C)
3. On Windows, you might see a message asking "Terminate batch job (Y/N)?"
4. Type `Y` and press Enter

The server will stop and you will see the normal terminal prompt again.

### Closing the Terminal:

After stopping the server, you can safely close the terminal window by clicking the X button or typing `exit` and pressing Enter.

### Closing the Browser:

You can close the browser tab showing the application. It will not run in the background.

## Building for Production (Optional)

If you want to create a production-ready version of the application (for example, to deploy it to a web server), follow these steps:

### Build Command:

In the terminal, type:

```
npm run build
```

**What does this do?**
- Compiles all the code
- Optimizes it for better performance
- Creates smaller file sizes
- Removes development-only code
- Puts the final files in the `dist` folder

The build process takes 1-3 minutes. When it completes, you will find the production files in:

```
seafarer-management/dist/seafarer-management/
```

You can then upload these files to a web hosting service.

## How to Change the Port

By default, the application runs on port 4200. If you need to use a different port:

### Temporary Change (one time):

When starting the server, add the port parameter:

```
npm start -- --port 4500
```

Replace `4500` with any port number you want (between 1024 and 65535).

Then open `http://localhost:4500` in your browser.

### Permanent Change:

1. Open `package.json` file in a text editor
2. Find the line that says:
```json
"start": "cross-env NODE_OPTIONS=--openssl-legacy-provider ng serve --proxy-config proxy.conf.json",
```
3. Change it to:
```json
"start": "cross-env NODE_OPTIONS=--openssl-legacy-provider ng serve --proxy-config proxy.conf.json --port 4500",
```
4. Save the file
5. Now `npm start` will always use port 4500

## Getting Help

If you encounter issues not covered in this README:

1. Check the terminal output for specific error messages
2. Search for the error message online
3. Contact your system administrator or the development team
4. Make sure all the prerequisites are properly installed
5. Try stopping the server and running `npm start` again

## Summary of Common Commands

Here is a quick reference of the commands you will use:

```bash
# Navigate to project folder (Windows example)
cd "B:\ERB\Seafarer Management System\seafarer-management"

# Install all dependencies (do this once, or after pulling updates)
npm install

# Start the development server
npm start

# Build for production
npm run build

# Stop the server
Ctrl + C (then type Y if prompted)
```

---

**Remember:** 
- Always run commands from inside the project folder
- Wait for `npm install` to complete before running `npm start`
- The application runs at `http://localhost:4200` by default
- Press `Ctrl + C` to stop the server

**Happy coding!!!!!!!!!!!!!!!!!!!!!!!!!**
