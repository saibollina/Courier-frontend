import apiClient from "./services";

export default {
    getLocations(){
        return apiClient.get("locations");
    },
    getFullTrip(order){

        return apiClient.get("getFullTrip",{ params: { pickupLocation: order.pickupLocation, dropLocation: order.dropLocation }})
    }
};
