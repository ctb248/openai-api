import formidable from "formidable";
import fs from "fs";
import * as child from "child_process";
import openai from "../../utils/server/OpenAiClient";
import { NextApiRequest, NextApiResponse } from "next";

interface FormidableFile {
  filepath: string;
  newFilename: string;
}

const convertAudio = async (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const inputFile = fs.createReadStream(filename);
    const outputPath = filename.replace(".ogg", ".mp3");
    const outputStream = fs.createWriteStream(outputPath);
    const conversion = child.spawn("ffmpeg", [
      "-i",
      "pipe:0",
      "-f",
      "mp3",
      "pipe:1",
    ]);

    conversion.on("close", () => {
      fs.unlinkSync(filename);
      resolve(filename.replace(".ogg", ".mp3"));
    });
    conversion.on("error", () => {
      reject();
    });
    inputFile.pipe(conversion.stdin);
    conversion.stdout.pipe(outputStream);
  });
};

const saveFile = async (file: FormidableFile) => {
  const data = fs.readFileSync(file.filepath);
  const newPath = `./public/${file.newFilename}.ogg`;
  fs.writeFileSync(newPath, data);
  fs.unlinkSync(file.filepath);
  return newPath;
};

const transcribe = async (filepath: string) => {
  try {
    const stream = fs.createReadStream(filepath);
    const result = await openai.createTranscription(stream as any, "whisper-1");
    return result;
  } catch (e) {
    console.log(e.response.data.error);
    // console.log(e.request);
    console.error(e.message);
  }
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (_err, _fields, files) {
      const savedFilePath = await saveFile(files.file);
      const convertedFilePath = await convertAudio(savedFilePath);
      const {
        data: { text },
      } = await transcribe(convertedFilePath);
      console.log(text);
      fs.unlinkSync(convertedFilePath);
      return res.status(201).send({ text });
    });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json({ ok: "sucks to suck" });
    } else {
      console.error(`Error with request: ${error.message}`);
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
