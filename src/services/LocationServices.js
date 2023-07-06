import apiClient from "./services";

export default {
    getLocations(){
        return apiClient.get("locations");
    }
};
