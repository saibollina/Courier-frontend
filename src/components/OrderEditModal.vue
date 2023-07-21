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
import vSelect from 'vue-select'
import OrderServices from '../services/OrderServices';

const props = defineProps(['function', 'user','userRole','orderId'])
const isOpen = ref(false);
const updateEnable = ref(true);
const order = ref({
    id:'',
    orderedByClerk:{
        name: ''
    },
    orderedByCustomer:{
        name: '',
        firstName: '',
        lastName: '',
        email:'',
        phoneNumber:'',
    },
    orderAssignedTo:{
        name: '',
        firstName: '',
        lastName: '',
        id:'',
        email:''
    },
    receiverFirstName: '',
    receiverLastName:'',
    receiverPhoneNumber:'' ,
    status:' ',
    pickedUpBy:''
})
const deliveryPersons = ref([
    {
        name: '',
        firstName: '',
        lastName: '',
        id:'',
        email:''
    }
])
const snackbar = ref({
    value: false,
    color: "",
    text: "",
});
let originalOrder = {};
function closeModal() {
    isOpen.value = false
    props.openView = false
    props.function();
}
function isOrderUpdated(updatedOrder, originalOrder) {
    
    if (updatedOrder.receiverFirstName !== originalOrder.receiverFirstName)
        return true;
    if (updatedOrder.receiverLastName !== originalOrder.receiverLastName)
        return true;
    if (updatedOrder.receiverPhoneNumber !== originalOrder.receiverPhoneNumber)
        return true
    if (updatedOrder.pickedUpBy !== originalOrder.pickedUpBy)
        return true
    return false
}
function setSnackBar(value, text, color){
    snackbar.value.value = value;
            snackbar.value.color = color;
            snackbar.value.text = text;
}
async function updateOrderDetails() {
    let updatedOrder = {
        receiverFirstName: order.value.receiverFirstName,
        receiverLastName:order.value.receiverLastName,
        receiverPhoneNumber:order.value.receiverPhoneNumber,
        pickedUpBy: order.value.orderAssignedTo.id
    }
    const isupdated = isOrderUpdated(updatedOrder, originalOrder)
    try {
        if (isupdated) {
            updatedOrder = {
                ...updatedOrder,
                id:order.value.id,
                status: updatedOrder.pickedUpBy !== originalOrder.pickedUpBy ? 'DP-assigned': order.value.status 
            }
            await OrderServices.updateOrder(updatedOrder);
            updateEnable.value = false
            setSnackBar(true,'Order updated!','green')
        } else {
            setSnackBar(true,'No change in Order details','error')
        }
    } catch (error) {
        console.log('error');
        setSnackBar(true,error.response.data.message,'error')
    }

}
onMounted(async () => {

    const response = await OrderServices.getOrderDetailsById(props.orderId);
    order.value = {...response.data};
    originalOrder = {...response.data};
})
function closeSnackBar() {
    snackbar.value.value = false;
}
async function fetchActiveDeliveryPersons(){

  const userRole = 2; // Delivery person Role Id
  const response = await UserServices.getUsers(userRole);
  
  deliveryPersons.value= response.data.map((person)=>({
    ...person,
    label:person.name
  }));
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
                            class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                Order information
                            </DialogTitle>
                            <form class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" @submit.prevent="updateOrderDetails" method="post">
                                <div class="mt-4 border-t border-gray-200 pt-2">
                                    <h3 class="text-lg font-medium leading-6 text-gray-900">Pickup info</h3>
                                    
                                    <div class="my-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 ">
                                        <div>
                                            <label for="first-name" class="block text-sm font-medium text-gray-700">First
                                                name</label>
                                            <div class="mt-1">
                                                <input type="text" id="first-name" name="first-name"
                                                    :value="order.orderedByCustomer.firstName" :disabled="true"

                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>

                                        <div>
                                            <label for="last-name" class="block text-sm font-medium text-gray-700">Last
                                                name</label>
                                            <div class="mt-1">
                                                <input type="text" id="last-name" name="last-name"
                                                    :value="order.orderedByCustomer.lastName"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
                                            <div class="mt-1">
                                                <input type="text" name="phoneNumber" id="phoneNumber" autocomplete="phoneNumber"
                                                    
                                                    :value="order.orderedByCustomer.phoneNumber"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="pickupLocation" class="block text-sm font-medium text-gray-700">Pickup Location</label>
                                            <div class="mt-1">
                                                <input type="text" name="pickupLocation" id="pickupLocation"
                                                    
                                                    :value="order.pickupLocation"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                    </div>
                    
                                    <h3 class="text-lg border-t font-medium leading-6 text-gray-900 py-4">Ship info</h3>
                                    
                                    <div class="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                        <div>
                                            <label for="receiverFirstName" class="block text-sm font-medium text-gray-700">First
                                                name</label>
                                            <div class="mt-1">
                                                <input type="text" id="receiverFirstName" name="receiverLastName"
                                                    autocomplete="given-name" v-model="order.receiverFirstName"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>

                                        <div>
                                            <label for="receiverLastName" class="block text-sm font-medium text-gray-700">Last
                                                name</label>
                                            <div class="mt-1">
                                                <input type="text" id="receiverLastName" name="receiverLastName"
                                                    autocomplete="family-name" v-model="order.receiverLastName"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
    
                                        <div class="sm:col-span-2">
                                            <label for="receiverPhoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
                                            <div class="mt-1">
                                                <input type="text" name="receiverPhoneNumber" id="receiverPhoneNumber" autocomplete="email"
                                                    v-model="order.receiverPhoneNumber"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="dropLocation" class="block text-sm font-medium text-gray-700">Drop Location</label>
                                            <div class="mt-1">
                                                <input type="text" name="dropLocation" id="dropLocation"
                                                    
                                                    :value="order.dropLocation"
                                                    :disabled="true"
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
                                <!-- Delivery Info -->
                                <div class="mt-4 border-t border-gray-200 pt-2">
                                    <h3 class="text-lg font-medium leading-6 text-gray-900">Delivery Person info</h3>
                                    <!-- Delivery Person info -->
                                    <div v-if="order.status.toLowerCase() ==='order-placed'" class="sm:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700">Select deliveryPersons</label>
                                        <v-select :onClick="fetchActiveDeliveryPersons" :options="deliveryPersons" v-model="order.orderAssignedTo"></v-select>
                                    </div>
                                    <div v-if="order.orderAssignedTo" class="my-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 ">
                                        <div>
                                            <label for="first-name" class="block text-sm font-medium text-gray-700">First
                                                name</label>
                                            <div class="mt-1">
                                                <input type="text" id="first-name" name="first-name"
                                                    v-model="order.orderAssignedTo.firstName" :disabled="true"

                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>

                                        <div>
                                            <label for="last-name" class="block text-sm font-medium text-gray-700">Last
                                                name</label>
                                            <div class="mt-1">
                                                <input type="text" id="last-name" name="last-name"
                                                    v-model="order.orderAssignedTo.lastName"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                                            <div class="mt-1">
                                                <input type="text" name="email" id="email" autocomplete="email"
                                                    
                                                    :value="order.orderAssignedTo.email"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
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

  