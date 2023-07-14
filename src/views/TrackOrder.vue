<script setup>
import SideNavBar from "../components/SideNavBar.vue";
import { ref, onMounted } from "vue";
import { TrashIcon, } from '@heroicons/vue/20/solid'
import UserServices from '../services/UserServices.js';
import OrderServices from '../services/OrderServices.js';
import LocationServices from '../services/LocationServices.js';
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import OrdersTable from '../components/OrdersTable.vue';


const orders = ref([]);

async function getAllOrders() {
  try {
    const response = await OrderServices.getAllOrders();
    
    orders.value = response.data;
    console.log("track orders", orders.value)
  } catch (error) {
    console.error(error);
  }
}
const enableEditAction = ref(false)
onMounted(async ()=>{
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
    enableEditAction.value = loggedInUser.role !==2
    await getAllOrders(loggedInUser.id)});
</script>
<template>
    <div class="flex flex-1">
        <SideNavBar />
        <OrdersTable :orders="orders" :enableEditActions="enableEditAction" ></OrdersTable>
    </div>
</template>
