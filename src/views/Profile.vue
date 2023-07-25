<script setup>
import { onMounted, ref } from 'vue'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import UserServices from '../services/UserServices';
import SideNavBar from '../components/SideNavBar.vue';


const isOpen = ref(false)
const user = ref({
    firstName: '',
    lastName: '',
    email: ''
})

function closeModal() {
    isOpen.value = false
    props.function();
}
function getEployeeRole(roleId){
  const roles = new Map([
    [1, 'Clerk'],
    [2, 'Delivery Person'],
    [3, 'Admin'],
    [4,'Customer']
  ]);
  return roles.get(roleId);
}
onMounted(async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const response =  await UserServices.getUserById(loggedInUser.id);
        user.value = response.data;
    
        
})

</script>

<template>
    <SideNavBar/>
</template>

  