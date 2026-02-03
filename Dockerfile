# ==============================
# Base Image: Playwright + Node.js
# ==============================
# Pin a specific Playwright version and Ubuntu base for reproducible builds
# Jammy = Ubuntu 22.04 LTS
FROM mcr.microsoft.com/playwright:v1.58.0-jammy

# ==============================
# Set Working Directory
# ==============================
# All subsequent commands will run inside /app
WORKDIR /app

# ==============================
# Copy package files and install dependencies
# ==============================
# Only copy package.json and package-lock.json to take advantage of Docker caching
COPY package*.json ./
RUN npm ci

# ==============================
# Copy rest of the project
# ==============================
# Do NOT copy secrets (like env/localsecrets.env) into the image
COPY . .

# ==============================
# Default environment variables
# ==============================
# Can be overridden at runtime with `-e` flags or --env-file
ENV HEADLESS=true \
    UI_AUTOMATION_BROWSER=chromium \
    TEST_ENV=qa

# ==============================
# Default command
# ==============================
# Runs Cucumber tests by default, but can be overridden when running the container
# Example overrides:
# docker run <image> npx playwright test
# docker run <image> npm run cucumber smoke
CMD ["npm", "run", "cucumber"]

# ==============================
# Usage Examples (for reference)
# ==============================
# 1️⃣ Run default Cucumber tests
# docker run --rm --env-file env/localsecrets.env playwright-framework
#
# 2️⃣ Run a specific tag (e.g., login)
# docker run --rm --env-file env/localsecrets.env playwright-framework npm run cucumber login
#
# 3️⃣ Run a smoke tag (if defined)
# docker run --rm --env-file env/localsecrets.env playwright-framework npm run cucumber smoke
#
# 4️⃣ Run Playwright tests directly
# docker run --rm --env-file env/localsecrets.env playwright-framework npx playwright test
#
# 5️⃣ Override headless mode at runtime
# docker run --rm --env-file env/localsecrets.env -e HEADLESS=false playwright-framework npm run cucumber login
