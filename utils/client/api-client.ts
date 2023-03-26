class ApiClient {
  convertAudio = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob);
    try {
      const result = await fetch("/api/whisper", {
        method: "POST",
        body: formData,
      });
      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  };
}

const apiClient = new ApiClient();

export default apiClient;
