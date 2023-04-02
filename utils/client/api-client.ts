class ApiClient {
  convertAudio = async (blob: Blob, pw: string) => {
    const formData = new FormData();
    formData.append("file", blob, "audioBlob.ogg");
    try {
      const result = await fetch("/api/whisper", {
        method: "POST",
        body: formData,
        headers: {
          "X-Password": pw,
        },
      });
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
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
}

const apiClient = new ApiClient();

export default apiClient;
