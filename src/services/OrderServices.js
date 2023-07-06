import apiClient from "./services";

export default {
    placeOrder(order){
        return apiClient.post("orders", order);
    },
    estimateDeliveryCost(order){
        return apiClient.get("orders/estimateCost", { params: { pickupLocation: order.pickupLocation, dropLocation: order.dropLocation }})
    }
};
