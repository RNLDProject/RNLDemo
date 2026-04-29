import AxiosInstance from "./AxiosInstance"; 

const UserService = {
   
    loadUsers: async (_page: number, _searchTerm: string) => {
        try {
            const response = await AxiosInstance.get("/user/loadUsers");
            return response;
        } catch (error) {
            throw error;
        }
    },

   
    storeUser: async (data: any) => {
        try {
            const response = await AxiosInstance.post("/user/storeUser", data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // UserService.ts
updateUser: async (userId: string | number, data: FormData) => {
    // Dapat POST ang method dito para mabasa ng Laravel ang multipart/form-data
    const response = await AxiosInstance.post(`/user/updateUser/${userId}`, data);
    return response;
},

    destroyUser: async (userId: string | number) => {
        try {
            const response = await AxiosInstance.put(`/user/destroyUser/${userId}`);
            return response;
        } catch (error) {
            throw error;
        }
        
    },
};



export default UserService;