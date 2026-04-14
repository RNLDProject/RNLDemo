import AxiosInstance from "./AxiosInstance";

const GenderService = {
  storeGender: async (data: unknown) => {
    try {
      const response = await AxiosInstance.post("/gender/storeGender", data);
      return response;
    } catch (error) {
      console.error("storeGender error:", error);
      throw error;
    }
  },
};

export default GenderService;
