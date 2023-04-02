import textToSpeech from "@google-cloud/text-to-speech";
import util from "util";
import fs from "fs";
import openai from "../../utils/server/OpenAiClient";

const MODEL_CONFIG = {
  model: "text-davinci-003",
  prompt: input,
  temperature: 0.6,
  max_tokens: 100,
};

const client = new textToSpeech.TextToSpeechClient();

const responseToSpeech = async (text) => {
  // Construct the request
  const request = {
    input: { text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  const outputPath = "./public/output.mp3";
  await writeFile(outputPath, response.audioContent, "binary");
  console.log("Audio content written to file: output.mp3");
  return outputPath;
};

export default async function (req, res) {
  console.log(req.headers["x-password"]);
  // Bleeding edge authentication. Get agile, losers.
  if (req.headers["x-password"] !== "iAmThePassworg") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const input = req.body.input || "";
  if (input.trim().length === 0) {
    return res.status(400).json({
      error: {
        message: "Please enter valid input",
      },
    });
  }

  try {
    const completion = await openai.createCompletion(MODEL_CONFIG);
    console.log(completion.data);

    const aiResponse = completion.data.choices[0].text;
    const aiResponseAudioPath = await responseToSpeech(aiResponse);
    const b64audio = fs.readFileSync(aiResponseAudioPath).toString("base64");
    fs.unlink(aiResponseAudioPath);

    res.status(200).json({ text: aiResponse, audio: b64audio });
    // return res.status(200).json({ result: "Hello" });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
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
