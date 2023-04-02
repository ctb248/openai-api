// Imports the Google Cloud client library
import textToSpeech from "@google-cloud/text-to-speech";
import * as fs from "fs";
import util from "util";
// Creates a client
const client = new textToSpeech.TextToSpeechClient();

export default async function (req, res) {
  try {
    // The text to synthesize
    const text = "hello, world!";

    // Construct the request
    const request = {
      input: { text: text },
      // Select the language and SSML voice gender (optional)
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      // select the type of audio encoding
      audioConfig: { audioEncoding: "MP3" },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request as any);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile("output.mp3", response.audioContent, "binary");
    console.log("Audio content written to file: output.mp3");
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    console.log("catch");
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
