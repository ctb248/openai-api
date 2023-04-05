# OpenAI API Quickstart - Node.js example app

Just a simple fork of the NextJS demo for messing around with the OpenAI API. Adds a basic chat interface for freeform interaction with a text model. Also implements the Whisper API to record and transcribe user audio messages, as well as the Google Cloud text-to-speech API to narrate bot responses.

![Your friendly neighborhood chatbot](openai.png)

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd openai-quickstart-node
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

   On Linux systems:

   ```bash
   $ cp .env.example .env
   ```

   On Windows:

   ```powershell
   $ copy .env.example .env
   ```

6. Add your [API key](https://platform.openai.com/account/api-keys) to the newly created `.env` file

7. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)!
