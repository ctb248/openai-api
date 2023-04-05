const fetchWrapper = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(input, init);

  if (!res.ok) {
    console.error(res);
    throw new Error("Oops");
  }
  return res;
};

class ApiClient {
  convertAudio = async (blob: Blob, pw: string) => {
    const formData = new FormData();
    formData.append("file", blob, "audioBlob.ogg");
    return fetchWrapper("/api/whisper", {
      method: "POST",
      body: formData,
      headers: {
        "X-Password": pw,
      },
    });
  };
  generateResponse = async (input: string, pw: string) => {
    return fetchWrapper("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Password": pw,
      },
      body: JSON.stringify({ input }),
    });
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
