<script setup>
import { onMounted, ref } from 'vue'
import SideNavBar from '../components/SideNavBar.vue'
import AdminDashboard from './AdminDashboard.vue'
import DeliveryDashboard from './DeliveryDashboard.vue'
import ClerkDashboard from './ClerkDashboard.vue'

const role = ref(0);
onMounted(async()=>{
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
    role.value= loggedInUser.role
});


</script>
<template>
  <div class="flex flex-1 ">
    <SideNavBar />
    <AdminDashboard v-if="role==3"></AdminDashboard>
    <DeliveryDashboard v-if="role==2"></DeliveryDashboard>
    <ClerkDashboard v-if="role==1"></ClerkDashboard>
  </div>
</template>