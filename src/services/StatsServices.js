import apiClient from "./services";

export default {
    getAdminStats(){
        return apiClient.get("getAdminStats");
    },
    getDeliveryPersonStats(userId){
        return apiClient.get(`getDeliveryPersonStats/${userId}`);
    },
    getClerkStats(userId){
        return apiClient.get(`getClerkStats/${userId}`);
    }
};
