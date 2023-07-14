<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import SideNavBar from '../components/SideNavBar.vue';
import UserTable from '../components/UserTable.vue';
import UserServices from '../services/UserServices';
const people = ref([]);

async function getAllClerks() {
  try {
    const userRole= 1
    const employees = await UserServices.getUsers(userRole);
    people.value = employees.data;
  } catch (error) {
    console.error(error);
  }
}
onMounted(getAllClerks);
</script>
<template>
  <div class="flex flex-1">
        <SideNavBar :showEmployeeSubNav = "true"/>
        <UserTable :people="people" :userRole="`Clerks`" :refetchUsers="getAllClerks" :enableAddUser="true"/>
  </div>
</template>
