<script setup>
import { onMounted, ref } from 'vue'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import OrderServices from '../services/OrderServices';
import html2pdf from 'html2pdf.js';

const props = defineProps(['function', 'user', 'userRole', 'orderId'])
const isOpen = ref(false);
const updateEnable = ref(true);
const order = ref({
    id: '',
    orderedByClerk: {
        name: ''
    },
    orderedByCustomer: {
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    },
    orderAssignedTo: {
        name: '',
        firstName: '',
        lastName: '',
        id: '',
        email: '',
        phoneNumber:''
    },
    receiverFirstName: '',
    receiverLastName: '',
    receiverPhoneNumber: '',
    status: ' ',
    pickedUpBy: '',
    dropLocation: '',
    pickupLocation: '',
    cost: 0,
    parcelName: '',
    dropTime: '',
    pickUpTime: '',
    deliveredInTime: ''
})
const deliveryPersons = ref([
    {
        name: '',
        firstName: '',
        lastName: '',
        id: '',
        email: ''
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
function setSnackBar(value, text, color) {
    snackbar.value.value = value;
    snackbar.value.color = color;
    snackbar.value.text = text;
}
async function updateOrderDetails() {
    let updatedOrder = {
        receiverFirstName: order.value.receiverFirstName,
        receiverLastName: order.value.receiverLastName,
        receiverPhoneNumber: order.value.receiverPhoneNumber,
        pickedUpBy: order.value.orderAssignedTo.id
    }
    const isupdated = isOrderUpdated(updatedOrder, originalOrder)
    try {
        if (isupdated) {
            updatedOrder = {
                ...updatedOrder,
                id: order.value.id,
                status: updatedOrder.pickedUpBy !== originalOrder.pickedUpBy ? 'DP-assigned' : order.value.status
            }
            await OrderServices.updateOrder(updatedOrder);
            updateEnable.value = false
            setSnackBar(true, 'Order updated!', 'green')
        } else {
            setSnackBar(true, 'No change in Order details', 'error')
        }
    } catch (error) {
        console.log('error');
        setSnackBar(true, error.response.data.message, 'error')
    }

}
const downloadInvoice = () => {
    const orderDetails = order.value
    // Generate the HTML content for the invoice
    const orderDetailsHtml = 
    `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        /* Add your custom CSS styles here (optional) */
        /* For example: */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }

        .invoice {
            padding: 20px;
            border: 1px solid #ccc;
            max-width: 600px;
            margin: 0 auto;
        }

        .invoice-header {
            text-align: center;
            margin-bottom: 20px;
            background-color: black;
            color: white;
            padding: 10px 0;
        }

        .invoice-header h2 {
            margin-bottom: 1;
        }

        .from-to-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .from-to-details .details {
            flex: 1;
        }

        .details-section h3 {
            font-weight: bold;
            font-size: 1.2em; /* Increase the font size for h3 */
            margin-bottom: 8px;
        }

        .details-section p {
            font-weight: 300; /* Lighter font weight */
            font-size: 1em; /* Default font size for p */
            color: gray; 
        }
        .from-to-details hr {
            margin-top: 5px;
            margin-bottom: 5px;
            border: 0;
            border-top: 1px solid #ccc;
        }

        .order-details {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .order-details th,
        .order-details td {
            padding: 8px;
            border: 1px solid #ccc;
            text-align: left;
        }

        .order-details th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        .total {
            text-align: right;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="invoice">
        <div class="invoice-header">
            <h2>Invoice</h2>
        </div>

        <div class="from-to-details">
            <div class="details">
                <h3>From:</h3>
                <hr/>
                <!-- Replace with the sender (from) details -->
                <p>${orderDetails.orderedByCustomer.name}</p>
                <p>Address: ${orderDetails.pickupLocation[0]} Avenue ${orderDetails.pickupLocation[1]} Street</p>
                <p>Contact: ${orderDetails.orderedByCustomer.phoneNumber}</p>
            </div>
        </div>
        <div class="from-to-details">
            <div class="details">
                <h3>To:</h3>
                <hr/>
                <p>${orderDetails.receiverFirstName} ${orderDetails.receiverLastName}</p>
                <p>Address: ${orderDetails.dropLocation[0]} Avenue ${orderDetails.dropLocation[1]} Street</p>
                <p>Contact: ${orderDetails.receiverPhoneNumber}</p>
            
            </div>
        </div>

        <table class="order-details">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Parcel Name</th>
                    <th>Cost</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <!-- Replace with the actual order details -->
                    <td>${orderDetails.id}</td>
                    <td>${orderDetails.parcelName}</td>
                    <td>${orderDetails.cost}</td>
                    <td>${orderDetails.status}</td>
                    <!-- Add more table data (td) as needed -->
                </tr>
                <!-- Add more rows for additional orders (if available) -->
            </tbody>
        </table>

        <div class="total">
            <h3>Total: ${orderDetails.cost}</h3>
        </div>
    </div>
</body>

</html>
`

    // Options for the PDF generation (optional)
    const options = {
        margin: [10, 10], // Page margins (top, right, bottom, left)
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 }, // Optional image settings
        html2canvas: { scale: 2 }, // Optional html2canvas settings
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, // Optional jsPDF settings
    };

    // Generate the PDF from the HTML content
    html2pdf().from(orderDetailsHtml).set(options).save();
}
onMounted(async () => {

    const response = await OrderServices.getOrderDetailsById(props.orderId);
    order.value = { ...response.data };
    originalOrder = { ...response.data };
})
function closeSnackBar() {
    snackbar.value.value = false;
}
function getReadableDateformat(dateString) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const getFullAddress = (value)=>{
  return `${value[0]} Avenue ${value[1]} Street`
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
                            <div class="flex flex-row-reverse">
                                <button :disabled="order.status !=='Delivered'" @click="downloadInvoice" :class="[order.status ==='Delivered'?'bg-primary' : 'bg-primary opacity-50','text-white font-bold py-2 px-4 rounded mt-4']">
                                Download Invoice
                                </button>
                            </div>
                            <form class="lg:grid lg:grid-cols-3 lg:gap-x-12 xl:gap-x-16"
                                @submit.prevent="updateOrderDetails" method="post">
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
                                                    :value="order.orderedByCustomer.lastName" :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone
                                                Number</label>
                                            <div class="mt-1">
                                                <input type="text" name="phoneNumber" id="phoneNumber"
                                                    autocomplete="phoneNumber" :value="order.orderedByCustomer.phoneNumber"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="pickupLocation"
                                                class="block text-sm font-medium text-gray-700">Pickup Location</label>
                                            <div class="mt-1">
                                                <input type="text" name="pickupLocation" id="pickupLocation"
                                                    :value="getFullAddress(order.pickupLocation)" :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <h3 class="text-lg border-t font-medium leading-6 text-gray-900 py-4">Ship info</h3>

                                    <div class="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                        <div>
                                            <label for="receiverFirstName"
                                                class="block text-sm font-medium text-gray-700">First
                                                name</label>
                                            <div class="mt-1">
                                                <input type="text" id="receiverFirstName" name="receiverLastName"
                                                    autocomplete="given-name" v-model="order.receiverFirstName"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>

                                        <div>
                                            <label for="receiverLastName"
                                                class="block text-sm font-medium text-gray-700">Last
                                                name</label>
                                            <div class="mt-1">
                                                <input type="text" id="receiverLastName" name="receiverLastName"
                                                    autocomplete="family-name" v-model="order.receiverLastName"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>

                                        <div class="sm:col-span-2">
                                            <label for="receiverPhoneNumber"
                                                class="block text-sm font-medium text-gray-700">Phone Number</label>
                                            <div class="mt-1">
                                                <input type="text" name="receiverPhoneNumber" id="receiverPhoneNumber"
                                                    autocomplete="email" v-model="order.receiverPhoneNumber"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="dropLocation" class="block text-sm font-medium text-gray-700">Drop
                                                Location</label>
                                            <div class="mt-1">
                                                <input type="text" name="dropLocation" id="dropLocation"
                                                    :value="getFullAddress(order.dropLocation)" :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Delivery Info -->
                                <div class="mt-4 border-t border-gray-200 pt-2">
                                    <h3 class="text-lg font-medium leading-6 text-gray-900">Delivery Person info</h3>
                                    <div v-if="order.orderAssignedTo"
                                        class="my-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 ">
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
                                                    v-model="order.orderAssignedTo.lastName" :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
                                            <div class="mt-1">
                                                <input type="text" name="phoneNumber" id="phoneNumber" autocomplete="email"
                                                    :value="order.orderAssignedTo.phoneNumber" :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="my-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 ">
                                        <div class="sm:col-span-2">
                                            <label for="email" class="block text-sm font-medium text-red-700">Yet to assign
                                                delivery person</label>
                                        </div>
                                    </div>
                                </div>
                                <!-- order info-->
                                <div class="mt-4 border-t border-gray-200 pt-2">
                                    <h3 class="text-lg font-medium leading-6 text-gray-900">Order info</h3>
                                    <div class="my-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 ">
                                        <div>
                                            <label for="first-name" class="block text-sm font-medium text-gray-700">Parcel
                                                Name</label>
                                            <div class="mt-1">
                                                <input type="text" id="first-name" name="first-name"
                                                    v-model="order.parcelName" :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="cost" class="block text-sm font-medium text-gray-700">Cost</label>
                                            <div class="mt-1">
                                                <input type="text" name="cost" id="cost" :value="order.cost"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="status"
                                                class="block text-sm font-medium text-gray-700">Status</label>
                                            <div class="mt-1">
                                                <input type="text" name="status" id="status" :value="order.status"
                                                    :disabled="true"
                                                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="pickUpTime" class="block text-sm font-medium text-gray-700">Pickup
                                                Time</label>
                                            <div class="mt-1">
                                                <input type="text" name="pickUpTime" id="pickUpTime"
                                                    :value="order.pickUpTime ? getReadableDateformat(order.pickUpTime) : 'Yet to pick up Parcel'"
                                                    :disabled="true"
                                                    :class="['block w-full rounded-md border-gray-300 shadow-sm sm:text-sm', order.pickUpTime ? 'text-gray-700' : 'text-red-700']" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="dropTime" class="block text-sm font-medium text-gray-700">Drop
                                                Time</label>
                                            <div class="mt-1">
                                                <input type="text" name="dropTime" id="dropTime"
                                                    :value="order.dropTime ? getReadableDateformat(order.dropTime) : 'Yet to deliver'"
                                                    :disabled="true"
                                                    :class="['block w-full rounded-md border-gray-300 shadow-sm sm:text-sm', order.dropTime ? 'text-gray-700' : 'text-red-700']" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="deliveredInTime"
                                                class="block text-sm font-medium text-gray-700">Delivered In Time</label>
                                            <div class="mt-1">
                                                <input type="text" name="deliveredInTime" id="deliveredInTime"
                                                    :value="order.dropTime ? order.deliveredInTime : 'Yet to deliver'"
                                                    :disabled="true"
                                                    :class="['block w-full rounded-md border-gray-300 shadow-sm  sm:text-sm', order.dropTime ? 'text-gray-700' : 'text-red-700']" />
                                            </div>
                                        </div>
                                        <div class="sm:col-span-2">
                                            <label for="deliveredInTime"
                                                class="block text-sm font-medium text-gray-700">Estimated Delivery
                                                Time</label>
                                            <div class="mt-1">
                                                <input type="text" name="deliveredInTime" id="deliveredInTime"
                                                    :value="`${order.estimatedDeliveryTime} min`" :disabled="true"
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

  