import openai from "../../utils/server/OpenAiClient";
import formidable from "formidable";
import * as fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const options = {
      uploadDir: path.join(process.cwd(), "tmp"),
      keepExtensions: true,
    };

    const form = new formidable.IncomingForm(options);
    form.keepExtensions = true;

    await new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }

        const file = files.file;
        console.log("parsing done \n" + file.filepath);
        console.log(file.originalFilename, " ", file.newFilename);

        const newPath = path.join(options.uploadDir, "IEXIST.wav");

        try {
          await fs.promises.access(file.filepath, fs.constants.F_OK);
          console.log("File exists, renaming...");
          await fs.promises.rename(file.filepath, newPath);
          console.log("File renamed successfully.");
          resolve("hi");
        } catch (error) {
          console.error("Error during file rename:", error);
          reject(error);
        }
      });
    });

    res.status(200).end();
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
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
