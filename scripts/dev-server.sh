#!/bin/bash

echo "Starting emulators..."
yarn firebase emulators:start > /dev/null 2>&1 &

echo "Waiting for emulators to start..."
yarn wait-on http://localhost:4400

echo "Starting dev server..."
yarn run dev > /dev/null 2>&1 &

echo "Waiting for dev server to start..."
wait-on http://localhost:3000

# echo "Starting Cypress..."
# yarn run cypress open > /dev/null 2>&1 &
# wait-on http://localhost:

echo "DONE! 🎉"

echo -e "Emulator UI available at \e[1;32mhttp://localhost:4400\e[0m"
echo -e "Next.js app available at \e[1;32mhttp://localhost:3000\e[0m"
echo "Press Ctrl+C to exit."

cleanup() {
    echo "Cleaning up..."
    lsof -ti :3000 | xargs kill
    echo "Cleanup complete."
}

trap cleanup EXIT

wait
