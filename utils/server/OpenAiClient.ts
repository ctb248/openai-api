import { Configuration, OpenAIApi } from "openai";

if (!process.env.OPENAI_API_KEY) throw new Error("No OpenAI API Key Found");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default openai;
