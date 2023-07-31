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

const props = defineProps(['function', 'user','userRole','refetchUsers'])
const isOpen = ref(false);
const updateEnable = ref(true);
const user = ref({
    firstName: '',
    lastName: '',
    email: '',
})
const snackbar = ref({
    value: false,
    color: "",
    text: "",
});
let originalUser = {};
function closeModal() {
    isOpen.value = false
    props.openView = false
    props.function();
}
function getEployeeRole(roleId) {
    const roles = new Map([
        [1, 'Clerk'],
        [2, 'Delivery Person'],
        [3, 'Admin'],
        [4, 'Customer']
    ]);
    return roles.get(roleId);
}
function isUserUpdated(updatedUser, originalUser) {
    
    if (updatedUser.firstName !== originalUser.firstName)
        return true;
    if (updatedUser.lastName !== originalUser.lastName)
        return true;
    if (updatedUser.email !== originalUser.email)
        return true
    return false
}
function setSnackBar(value, text, color){
    snackbar.value.value = value;
            snackbar.value.color = color;
            snackbar.value.text = text;
}
async function updateUser() {
    const updatedUser = {
        id: user.value.id,
        firstName: user.value.firstName,
        lastName: user.value.lastName,
        email: user.value.email,
    }
    const isupdated = isUserUpdated(updatedUser, originalUser)
    try {
        if (isupdated) {
            if(props.userRole !=='Customers'){
                await UserServices.updateUser(updatedUser);
            }else{
                await UserServices.updateCustomer(updatedUser);
            }
            updateEnable.value = false
            setSnackBar(true,'User updated!','green')
            closeModal()
            props.refetchUsers() 
        } else {
            setSnackBar(true,'No change in user data','error')
        }
    } catch (error) {
        console.log('error', error);
        setSnackBar(true,error.response.data.message,'error')
    }

}
onMounted(async () => {
    
    if(props.userRole !=='Customers'){
        const response = await UserServices.getUserById(props.user);
        user.value = {...response.data};
        originalUser = {...response.data};
    }else{
        const response = await UserServices.getCustomerById(props.user);
        user.value = {...response.data};
        originalUser = {...response.data};
    }
    
})
function closeSnackBar() {
    snackbar.value.value = false;
}
</script>

<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-900 bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                User information
                            </DialogTitle>
                            <form @submit.prevent="updateUser" method="post">
                                <div class="mt-4 border-t border-gray-200 pt-10">
                                    <div class="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                        <div>
                                            <label for="first-name" class="block text-sm font-medium text-gray-700">First
                                                name</label>
                                            <div class="mt-1">
                                                <input type="text" id="first-name" name="first-name"
                                                    autocomplete="given-name" v-model="user.firstName"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>

                                        <div>
                                            <label for="last-name" class="block text-sm font-medium text-gray-700">Last
                                                name</label>
                                            <div class="mt-1">
                                                <input type="text" id="last-name" name="last-name"
                                                    autocomplete="family-name" v-model="user.lastName"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                                            <div class="mt-1">
                                                <input type="text" name="role" :value="getEployeeRole(user.role)"
                                                    :disabled="true" id="role" autocomplete="street-address"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                                            <div class="mt-1">
                                                <input type="text" name="email" id="email" autocomplete="email"
                                                    v-model="user.email"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                                        <button type="submit" :disabled="!updateEnable"
                                            :class="[updateEnable ? 'bg-[#80162B]' : 'bg-[#80162B] opacity-50', 'w-full rounded-md border border-transparent px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-[#80162B] focus:outline-none focus:bg-[#80162B] focus:ring-offset-2 focus:ring-offset-gray-50']">Update
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
            <v-snackbar v-model="snackbar.value" rounded="pill">
                {{ snackbar.text }}

                <template v-slot:actions>
                    <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
                        Close
                    </v-btn>
                </template>
            </v-snackbar>
        </Dialog>
    </TransitionRoot>
</template>

  