<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import SideNavBar from '../components/SideNavBar.vue';
import UserTable from '../components/UserTable.vue';
import UserServices from '../services/UserServices';
const people = ref([]);

async function getAllDeliveryPersons() {
  try {
    const userRole= 2
    const employees = await UserServices.getUsers(userRole);
    people.value = employees.data;
  } catch (error) {
    console.error(error);
  }
}
onMounted(getAllDeliveryPersons);
</script>
<template>
  <div class="flex flex-1">
        <SideNavBar :showEmployeeSubNav = "true" />
        <UserTable :people="people" :userRole="`Delivery Persons`" :refetchUsers="getAllDeliveryPersons" :enableAddUser="true"/>
  </div>
</template>
