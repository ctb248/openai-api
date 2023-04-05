class ApiClient {
  convertAudio = async (blob: Blob, pw: string) => {
    const formData = new FormData();
    formData.append("file", blob, "audioBlob.ogg");
    const res = await fetch("/api/whisper", {
      method: "POST",
      body: formData,
      headers: {
        "X-Password": pw,
      },
    });

    if (!res.ok) {
      console.log(res);
      throw new Error("Oops");
    }
    return res;
  };
  generateResponse = async (input: string, pw: string) => {
    const res: Response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Password": pw,
      },
      body: JSON.stringify({ input }),
    });

    if (!res.ok) {
      console.log(res);
      throw new Error("Unauthorized");
    }

    return res;
  };
  getModels = async () => {
    const res: Response = await fetch("/api/models");

    if (!res.ok) {
      console.log(res);
      throw new Error("Unauthorized");
    }

    return res;
  };
}

const apiClient = new ApiClient();

export default apiClient;
