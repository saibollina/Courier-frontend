<script setup>
import { ref } from "vue";
import { onMounted } from "vue";
import SideNavBar from '../components/SideNavBar.vue';
import UserTable from '../components/UserTable.vue';
import UserServices from '../services/UserServices';
const people = ref([]);

async function getAllEMployes() {
  try {
    const employees = await UserServices.getUsers();
    
    people.value = employees.data;
  } catch (error) {
    console.error(error);
  }
}
onMounted(getAllEMployes);
</script>
<template>
  <div class="flex flex-1">
        <SideNavBar :showEmployeeSubNav = "true"/>
        <UserTable :people="people" :refetchUsers="getAllEMployes" :enableReport="false" :enableAddUser="false"/>
  </div>
</template>
