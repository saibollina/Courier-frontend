<script setup>
import SideNavBar from "../components/SideNavBar.vue";
import { ref, onMounted } from "vue";
import { TrashIcon } from '@heroicons/vue/20/solid'
import UserServices from '../services/UserServices.js';
import OrderServices from '../services/OrderServices.js';
import LocationServices from '../services/LocationServices.js';
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import OrdersTable from '../components/OrdersTable.vue';


const orders = ref([]);

// async function getAllAssignedOrders(userId) {
//   try {
//     const response = await OrderServices.getAllAssignedOrders(userId);
    
//     orders.value = response.data;
//   } catch (error) {
//     console.error(error);
//   }
// }
// onMounted(()=>{
//     const loggedInUser = JSON.parse(localStorage.getItem("user"))
//     getAllAssignedOrders(loggedInUser.id)});

async function getAllOrders() {
  try {
    const response = await OrderServices.getAllOrders();
    console.log(response.data);
    orders.value = response.data;
  } catch (error) {
    console.error(error);
  }
}
onMounted(()=>{
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
    getAllOrders(loggedInUser.id)});
</script>
<template>
    <div class="flex flex-1">
        <SideNavBar />
        <OrdersTable :orders="orders"></OrdersTable>
    </div>
</template>
