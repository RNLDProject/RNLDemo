import AxiosInstance from "./AxiosInstance"; 

const UserService = {
    loadUsers: async (page: number, search: string = "") => {
        try {
            const response = await AxiosInstance.get("/user/loadUsers", {
                params: {
                    page: page,
                    search: search 
                }
            });
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

   
updateUser: async (userId: string | number, data: FormData) => {
    
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