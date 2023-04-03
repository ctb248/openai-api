import formidable, { File as FormidableFile } from "formidable";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import openai from "../../utils/server/OpenAiClient";
import { NextApiRequest, NextApiResponse } from "next";

const convertToMp3 = async (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const outputPath = filename.replace(".ogg", ".mp3");

    // Set the ffmpeg binary path
    ffmpeg.setFfmpegPath(ffmpegPath);

    ffmpeg()
      .input(filename)
      .outputFormat("mp3")
      .on("end", () => {
        fs.unlinkSync(filename);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("An error occurred:", err.message);
        reject();
      })
      .pipe(fs.createWriteStream(outputPath), { end: true });
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
    // Their package wants some funky custom 'File' type but it will accept a stream with a path.
    const result = await openai.createTranscription(stream as any, "whisper-1");
    return result;
  } catch (e) {
    console.log(e.response.data.error);
    console.error(e.message);
  }
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (_err, _fields, files) {
      // Audio must be formatted with ffmpeg because the Whisper API is currently screwy
      // and will not accept either blobs or the audio files as encoded by certain browsers.
      // There's probably a more efficient way to stream the audio without writing it to disk, but they should really just fix their API :/
      const savedFilePath = await saveFile(files.file as FormidableFile);
      const convertedFilePath = await convertToMp3(savedFilePath);
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
