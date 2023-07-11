<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import SideNavBar from '../components/SideNavBar.vue';
import UserTable from '../components/UserTable.vue';
import UserServices from '../services/UserServices';
const people = ref([]);

async function getAllCustomers() {
  try {
    const employees = await UserServices.getAllCustomers();
    people.value = employees.data;
  } catch (error) {
    console.error(error);
  }
}
onMounted(getAllCustomers);
</script>
<template>
  <div class="flex flex-1">
        <SideNavBar :showEmployeeSubNav = "true"/>
        <UserTable :people="people" :userRole="`Customers`" :enableAddUser="true"/>
  </div>
</template>
