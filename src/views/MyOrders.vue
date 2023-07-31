<script setup>
import SideNavBar from "../components/SideNavBar.vue";
import { ref, onMounted } from "vue";
import OrderServices from '../services/OrderServices.js';
import 'vue-select/dist/vue-select.css';
import OrdersTable from '../components/OrdersTable.vue';


const orders = ref([]);

async function getAllAssignedOrders(userId) {
  try {
    const response = await OrderServices.getAllAssignedOrders(userId);
    
    orders.value = response.data;

  } catch (error) {
    console.error(error);
  }
}
async function getAllOrdersPlacedByClerk(userId) {
  try {
    const response = await OrderServices.getAllOrdersPlacedByClerk(userId);
    
    orders.value = response.data;
  } catch (error) {
    console.error(error);
  }
}
async function reftechOrders(){
  const loggedInUser = JSON.parse(localStorage.getItem("user"))
    enableEditAction.value = loggedInUser.role !==2
    if (loggedInUser.role === 2) {

        await getAllAssignedOrders(loggedInUser.id)
    } else {
        await getAllOrdersPlacedByClerk(loggedInUser.id)
    }
}
const enableEditAction = ref(false)
onMounted(async()=>{
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
    enableEditAction.value = loggedInUser.role !==2
    if (loggedInUser.role === 2) {

        await getAllAssignedOrders(loggedInUser.id)
    } else {
        await getAllOrdersPlacedByClerk(loggedInUser.id)
    }
});

</script>
<template>
    <div class="flex flex-1">
        <SideNavBar />
        <OrdersTable :orders="orders" :enableEditActions="enableEditAction" :reftechOrders="reftechOrders"></OrdersTable>
    </div>
</template>
