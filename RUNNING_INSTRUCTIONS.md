# Running and Stopping the Project

This guide provides instructions on how to run and stop the project in the terminal of any IDE (such as VS Code, WebStorm, Cursor, IntelliJ, etc.).

## Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your system.

## Steps to Run the Project

1. **Open the Terminal in your IDE:**
   - In **VS Code**: Go to the top menu `Terminal` -> `New Terminal` (or press `` Ctrl + ` ``).
   - In **WebStorm/IntelliJ**: Open the `Terminal` tool window at the bottom (or press `Alt + F12`).

2. **Install Dependencies (First Time Only):**
   If you haven't installed the necessary packages yet, run the following command:
   ```bash
   npm install
   ```

3. **Start the Server:**
   Execute the following command to start the Node.js server:
   ```bash
   npm start
   ```
   *(Alternatively, you can run `npm run dev` or `node server.js`)*

4. **Access the Application:**
   Once the server starts, you'll see a message indicating the port it is listening on (e.g., `Server is running on port 3000`).
   Open your web browser and navigate to `http://localhost:3000` (or whatever port is specified).

## Steps to Stop the Project

To stop the running server, you need to terminate the process in the terminal where it's running:

1. Click on the terminal window where the server is running to make sure it is active.
2. Press `Ctrl + C` on your keyboard.
3. If prompted with `Terminate batch job (Y/N)?`, type `Y` and press `Enter`. The server will stop and return you to the command prompt.
