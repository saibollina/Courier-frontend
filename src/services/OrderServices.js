import apiClient from "./services";

export default {
    placeOrder(order){
        return apiClient.post("orders", order);
    },
    estimateDeliveryCost(order){
        return apiClient.get("orders/estimateCost", { params: { pickupLocation: order.pickupLocation, dropLocation: order.dropLocation }})
    },
    getAllAssignedOrders(userId){
        return apiClient.get(`orders/assignedTo/${userId}`)
    },
    getAllOrders(){
        return apiClient.get('orders')
    },
    getAllOrdersPlacedByClerk(userId){
        return apiClient.get(`orders/orderedBy/${userId}`)
    },
    getOrderDetailsById(orderId){
        return apiClient.get(`orders/${orderId}`)
    },
    updateOrder(order){
        
        return apiClient.put(`orders/${order.id}`, order)
    }
};
