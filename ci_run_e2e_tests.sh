#!/bin/bash
set -e
# This script is used in the GitHub Actions workflow to run the Playwright end-to-end tests.
# It starts the application in the background, waits for it to be ready, and then runs
# the Playwright tests.

# Start the backend server using test database
npm run start:test &

# Wait for the backend to be ready
until curl -s http://localhost:3004/api/blogs > /dev/null; do
  echo "Waiting for backend to be ready..."
  sleep 1
done 
echo "Backend is ready. Starting frontend..."

# Build the frontend and run in the background
cd blogApp
npm run build:test
npm run preview:test &

# Wait for the frontend to be ready
until curl -s http://localhost:4173 > /dev/null; do
  echo "Waiting for frontend to be ready..."
  sleep 1
done
echo "Frontend is ready. Running Playwright tests..."

npm run test:e2e
TEST_EXIT_CODE=$?

# Kill the backend and frontend processes
pkill node || true

exit $TEST_EXIT_CODE

#EOF