<script setup>
import SideNavBar from "../components/SideNavBar.vue";
import { ref, onMounted } from "vue";
import OrderServices from '../services/OrderServices.js';
import NoOrdersModal from '../components/NoOrdersModal.vue';
import LocationServices from '../services/LocationServices';

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
function setSnackBar(value, text, color) {
  snackbar.value.value = value;
  snackbar.value.color = color;
  snackbar.value.text = text;
}
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
    phoneNumber: ''
  },
  orderAssignedTo: {
    name: '',
    firstName: '',
    lastName: '',
    id: '',
    email: ''
  },
  receiverFirstName: '',
  receiverLastName: '',
  receiverPhoneNumber: '',
  status: ' ',
  pickedUpBy: '',
  pickupLocation:'',
  dropLocation:'',
  estimatedDeliveryTime: '',
  pickUpTime:'',
});
const tripInfo = ref({
        officeToSource:{
          numberOfHops:0,
          path:[]
        },
        sourceToDestination:{
          numberOfHops:0,
          path:[]
        },
        destinationToOffice:{
          numberOfHops:0,
          path:[]
        }
      })
const readyToPickup = ref(true);
const delivered = ref(false);
async function getAssignedLiveOrder (){
  try {
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
    const response = await OrderServices.getAllAssignedOrders(loggedInUser.id);
    const newOrder = response.data.filter(order => order.status === "DP-assigned" || order.status=="Picked-Up")[0];
    if(newOrder){
      order.value = newOrder;
      readyToPickup.value = order.value.status === 'DP-assigned'
      delivered.value = order.value.status === 'Delivered'
      const tripRes = await LocationServices.getFullTrip(newOrder)
      tripInfo.value = tripRes.data
    }
  } catch (error) {
    console.error(error);
  }
}
function contructTripRoute(path){

  return path.join(" -> ")
}
onMounted(getAssignedLiveOrder);

const updateOrder = async (status) => {
  try {
    if(status === "Picked-Up"){
      await OrderServices.updatePickUpTime({
        ...order.value
      });
    }else{
      await OrderServices.updateDeliveryTime({
        ...order.value
      });
    }
      
    status === "Picked-Up" ? readyToPickup.value = false : delivered.value = true
    setSnackBar(true, 'Order updated!', 'green')
  } catch (error) {
    console.log('error');
  }
}
</script>
<template >
  <div class="flex flex-1 ">
    <SideNavBar />
    <div v-if="order.id !== ''" class="mt-4 border-gray-200 pt-2">
      <h3 class="text-lg font-medium leading-6 text-gray-900 border-b">Pickup info</h3>
      <div class="my-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 ">
        <div>
          <label for="first-name" class="block text-sm font-medium text-gray-700">First
            name</label>
          <div class="mt-1">
            <input type="text" id="first-name" name="first-name" :value="order.orderedByCustomer.firstName"
              :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label for="last-name" class="block text-sm font-medium text-gray-700">Last
            name</label>
          <div class="mt-1">
            <input type="text" id="last-name" name="last-name" :value="order.orderedByCustomer.lastName" :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
          <div class="mt-1">
            <input type="text" name="phoneNumber" id="phoneNumber" autocomplete="phoneNumber" :value="order.orderedByCustomer.phoneNumber"
              :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="pickupLocation" class="block text-sm font-medium text-gray-700">Pickup Location</label>
          <div class="mt-1">
            <input type="text" name="pickupLocation" id="pickupLocation" autocomplete="pickupLocation" :value="order.pickupLocation"
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
            <input type="text" id="receiverFirstName" name="receiverLastName" autocomplete="given-name"
              v-model="order.receiverFirstName" :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div>
          <label for="receiverLastName" class="block text-sm font-medium text-gray-700">Last
            name</label>
          <div class="mt-1">
            <input type="text" id="receiverLastName" name="receiverLastName" autocomplete="family-name"
              v-model="order.receiverLastName" :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>

        <div class="sm:col-span-2">
          <label for="receiverPhoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
          <div class="mt-1">
            <input type="text" name="receiverPhoneNumber" id="receiverPhoneNumber" autocomplete="email"
              v-model="order.receiverPhoneNumber" :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="dropLocation" class="block text-sm font-medium text-gray-700">Drop Location</label>
          <div class="mt-1">
            <input type="text" name="dropLocation" id="dropLocation" autocomplete="dropLocation" :value="order.dropLocation"
              :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="estimatedDeliveryTime" class="block text-sm font-medium text-gray-700">Estimated Delivery In</label>
          <div class="mt-1">
            <input type="text" name="estimatedDeliveryTime" id="estimatedDeliveryTime" autocomplete="estimatedDeliveryTime" :value="`${order.estimatedDeliveryTime} mins`"
              :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        <div class="mt-4 sm:mt-0">
          <button type="button" @click="updateOrder('Picked-Up')" :disabled="!readyToPickup"
            :class="[readyToPickup ? 'bg-[#80162B]' : 'bg-[#80162B] opacity-50', 'block rounded-md bg-[#80162B] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#80162B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-[#80162B]']">Pick
            this up</button>
        </div>
        <div class="mt-4 sm:mt-0 ">
          <button type="button" @click="updateOrder('Delivered')" :disabled="readyToPickup || delivered"
            :class="[ !(readyToPickup || delivered)? 'bg-[#80162B]' : 'bg-[#80162B] opacity-50', 'block rounded-md bg-[#80162B] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-#80162B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-[#80162B]']">Delivered</button>
        </div>
      </div>
    </div>
    <div v-if="order.id !== ''"  class="mt-4 border-gray-200 pt-2 ml-4">
      <h3 class="text-lg font-medium leading-6 text-gray-900 border-b">Trip info</h3>
      <div class="my-2 sm:col-span-2">
          <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Office  Location To Pickup Location</label>
          <div class="mt-1">
            <input type="text" name="phoneNumber" id="phoneNumber" autocomplete="phoneNumber" :value="contructTripRoute(tripInfo.officeToSource.path)" style="overflow-x: auto;width:400px;"
              :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div class="my-6 sm:col-span-2">
          <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Pickup Location to Drop Location</label>
          <div class="mt-1">
            <input type="text" name="phoneNumber" id="phoneNumber" autocomplete="phoneNumber" :value="contructTripRoute(tripInfo.sourceToDestination.path)" style="overflow-x: auto;width:400px;"
              :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div class="sm:col-span-2">
          <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Drop Location To Office</label>
          <div class="mt-1">
            <input type="text" name="phoneNumber" id="phoneNumber" autocomplete="phoneNumber" :value="contructTripRoute(tripInfo.destinationToOffice.path)" style="overflow-x: auto;width:400px;"
              :disabled="true"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
    </div>
    <div v-if="order.id === ''">
      <NoOrdersModal></NoOrdersModal>
    </div>
  </div>
</template>
