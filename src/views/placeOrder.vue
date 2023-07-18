<script setup>
import SideNavBar from "../components/SideNavBar.vue";
import { ref, onMounted } from "vue";
import { TrashIcon } from '@heroicons/vue/20/solid'
import UserServices from '../services/UserServices.js';
import OrderServices from '../services/OrderServices.js';
import LocationServices from '../services/LocationServices.js';
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

const locations = ref([])
const cost = ref(
    {
        totalAmount: 0,
        estimatedTime: 0,
    })
const customer = ref({
    email: '',
    firstName: '',
    lastName: '',
    id: ''
});
const order = ref({
    customerID: '',
    orderedBy: '',
    dropLocation: {
        id: '',
        label: ''
    },
    pickupLocation: {
        id: '',
        label: ''
    },
    cost: '',
    receiverLastName:'',
    receiverPhoneNumber: '',
    receiverFirstName: '',
    parcelName: ''
})
const noUserFound = ref(true)
const fetUserClicked = ref(false)

//TODO handle actual logic
async function handleEstimateCost() {
    
    const orderDetails = {
        pickupLocation: order.value.pickupLocation.id,
        dropLocation: order.value.dropLocation.id,
    }
    const res = await OrderServices.estimateDeliveryCost(orderDetails);
    cost.value = res.data;
}

async function fetchUser() {
    try {
        fetUserClicked.value = true;
        const user = await UserServices.getCustomerByEmail(customer.value.email);
        customer.value = user.data;
        
        noUserFound.value = false;
    } catch (error) {
        if (error.response.status === 404) {
            noUserFound.value = true;
        }
    }
}

const isCreateAccount = ref(false);
const snackbar = ref({
    value: false,
    color: "",
    text: "",
});
const user = ref({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "male",
    role: "4"
});

function addUser() {
    isCreateAccount.value = !isCreateAccount.value
}

async function createAccount() {
    await UserServices.addCustomer(user.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Account created successfully!";
            // router.push({ name: "login" });
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}
function closeCreateAccount() {
    isCreateAccount.value = false;
}
function closeSnackBar() {
    snackbar.value.value = false;
}
const loggedInUser = JSON.parse(localStorage.getItem("user"));
async function placeOrder() {
    const orderDetails = {
        customerID: customer.value.id,
        orderedBy: loggedInUser.id,
        cost: cost.value.totalAmount,
        pickupLocation: order.value.pickupLocation.id,
        dropLocation: order.value.dropLocation.id,
        status: 'Order-placed',
        receiverPhoneNumber: order.value.receiverPhoneNumber,
        receiverLastName:order.value.receiverLastName,
        receiverFirstName: order.value.receiverFirstName,
        parcelName: order.value.parcelName
    }
    try {
        await OrderServices.placeOrder(orderDetails);
        snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Order placed successfully!";
            noUserFound.value = false;
    } catch (error) {

        snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
    }
    
}

onMounted(async () => {
    const response = await LocationServices.getLocations();
    locations.value = response.data.locations.map((value)=>({
        id:value,
        label: `${value[0]} Avenue ${value[1]} Street`
    }));
})
</script>
<template>
    <div class="flex flex-1">
        <SideNavBar />
        <div class="h-screen mt-6 overflow-scroll">
            <div class="bg-gray-50">

                <div class="mx-auto max-w-2xl px-4 pb-20 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 class="sr-only">Checkout</h2>

                    <form class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" @submit.prevent="placeOrder" method="post">
                        <div>
                            <div>
                                <h2 class="text-lg font-medium text-gray-900">Contact information</h2>

                                <div class="mt-4">
                                    <label for="email-address" class="block text-sm font-medium text-gray-700">Email
                                        address</label>
                                    <div class="mt-1">
                                        <input type="email" v-model="customer.email" :required="true" id="email-address"
                                            name="email-address" autocomplete="email"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </div>
                                    <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                        <div class="mt-4 sm:mt-0">
                                            <button type="button" @click="fetchUser"
                                                class="block rounded-md bg-[#80162B] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#80162B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-[#80162B]">Fetch
                                                user</button>
                                        </div>
                                        <div v-show="noUserFound" class="mt-4 sm:mt-0 ">
                                            <button type="button" @click="addUser"
                                                class="block rounded-md bg-[#80162B] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-#80162B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-[#80162B]">Add
                                                user</button>
                                        </div>
                                        <span v-show="noUserFound && fetUserClicked"
                                            class="text-red text-xs justify-center">
                                            user not found. Add user
                                        </span>
                                    </div>
                                </div>

                                <div v-show="!noUserFound" class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label for="first-name" class="block text-sm font-medium text-gray-700">First
                                            name</label>
                                        <div class="mt-1">
                                            <input type="text" id="first-name" name="first-name" autocomplete="given-name"
                                                :value="customer.firstName" :disabled="true"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="last-name" class="block text-sm font-medium text-gray-700">Last
                                            name</label>
                                        <div class="mt-1">
                                            <input type="text" id="last-name" name="last-name" autocomplete="family-name"
                                                :value="customer.lastName" :disabled="true"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-show="!noUserFound" class="mt-10 border-t border-gray-200 pt-10">
                                <h2 class="text-lg font-medium text-gray-900">Shipping information</h2>

                                <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label for="first-name" class="block text-sm font-medium text-gray-700">First
                                            name</label>
                                        <div class="mt-1">
                                            <input type="text" id="first-name" name="first-name" autocomplete="given-name"
                                                v-model="order.receiverFirstName"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="last-name" class="block text-sm font-medium text-gray-700">Last
                                            name</label>
                                        <div class="mt-1">
                                            <input type="text" id="last-name" name="last-name" autocomplete="family-name"
                                                v-model="order.receiverLastName"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                    <div class="sm:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700">Pickup location</label>
                                        <v-select :options="locations" v-model="order.pickupLocation"></v-select>
                                    </div>
                                    <div class="sm:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700">Drop location</label>
                                        <v-select :options="locations" v-model="order.dropLocation"></v-select>
                                    </div>
                                    <div class="sm:col-span-2">
                                        <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                                        <div class="mt-1">
                                            <input type="text" name="phone" id="phone" autocomplete="tel"
                                                v-model="order.receiverPhoneNumber"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Order summary -->
                        <div v-show="!noUserFound" class="mt-10 lg:mt-0">
                            <h2 class="text-lg font-medium text-gray-900">Order summary</h2>

                            <div class="mt-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
                                <div class="flex px-4 py-6 sm:px-6">
                                    <div class="ml-3 flex flex-1 flex-col">
                                        <div class="flex">
                                            <div class="min-w-0 flex-1">
                                                <div>
                                                    <label for="productName"
                                                        class="block text-sm font-medium text-gray-700">Product Name</label>
                                                    <div class="mt-1">
                                                        <input type="text" id="productName" name="productName"
                                                            v-model="order.parcelName"
                                                            placeholder="eg: parcel" autocomplete="given-name"
                                                            class="block w-full rounded-md border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="ml-4 flow-root flex-shrink-0">
                                                <button type="button"
                                                    class="-m-2.5 flex items-center justify-center bg-gray-50 p-2.5 text-gray-400 hover:text-gray-500">
                                                    <span class="sr-only">Remove</span>
                                                    <TrashIcon class="h-5 w-5" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>

                                        <div class="flex flex-1 items-end justify-between pt-2">
                                            <button type="button" @click="handleEstimateCost"
                                                class="rounded-md border border-transparent bg-[#80162B] px-2 py-1.5 text-base font-medium text-white shadow-sm hover:bg-[#80162B] focus:outline-none focus:bg-[#80162B] focus:ring-offset-2 focus:ring-offset-gray-50">Estimate
                                                cost</button>
                                        </div>
                                    </div>
                                </div>
                                <dl class="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                                    <!-- <div class="flex items-center justify-between">
                                        <dt class="text-sm">Total</dt>
                                        <dd class="text-sm font-medium text-gray-900">${{ cost.totalAmount }}</dd>
                                    </div> -->
                                    <div class="flex items-center justify-between">
                                        <dt class="text-sm">Estimated time</dt>
                                        <dd class="text-sm font-medium text-gray-900">{{ cost.estimatedTime }} mins</dd>
                                    </div>
                                    <div class="flex items-center justify-between border-t border-gray-200 pt-6">
                                        <dt class="text-base font-medium">Total</dt>
                                        <dd class="text-base font-medium text-gray-900">${{ cost.totalAmount }}</dd>
                                    </div>
                                </dl>

                                <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                                    <button type="submit"
                                        class="w-full rounded-md border border-transparent bg-[#80162B] px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-[#80162B] focus:outline-none focus:bg-[#80162B] focus:ring-offset-2 focus:ring-offset-gray-50">Confirm
                                        order</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <v-dialog persistent v-model="isCreateAccount" width="800">
            <v-card class="rounded-lg elevation-5">
                <v-card-title class="headline mb-2">Create Account </v-card-title>
                <v-card-text>
                    <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>

                    <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>

                    <v-text-field v-model="user.email" label="Email" required></v-text-field>

                    <label for="gender">Gender:</label>
                    <v-radio-group v-model="user.gender" inline>
                        <v-radio label="Male" value="male"></v-radio>
                        <v-radio label="Female" value="female"></v-radio>
                    </v-radio-group>
                    <label for="gender">Role:</label>
                    <v-radio-group v-model="user.role" inline>
                        <v-radio label="Customer" value="4"></v-radio>
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="flat" color="secondary" @click="closeCreateAccount()">Close</v-btn>
                    <v-btn variant="flat" color="primary" @click="createAccount()">Create Account</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.value" rounded="pill">
            {{ snackbar.text }}

            <template v-slot:actions>
                <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
