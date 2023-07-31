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
import StatsServices from '../services/StatsServices';
import html2pdf from 'html2pdf.js';

const props = defineProps(['function','user', 'userRole','enableReport'])
const isOpen = ref(false)
const user = ref({
    firstName: '',
    lastName: '',
    email: '',
    role:''
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
    if(props.userRole !=='Customers'){
        const response =  await UserServices.getUserById(props.user);
        user.value = response.data;
    }else{
        const response =  await UserServices.getCustomerById(props.user);
        user.value = response.data;
    }
        
})

function getOrdersInPastWeek(pastWeekOrders){
    let totalOrders = 0;
  for (const item of pastWeekOrders) {
    totalOrders += item.orderCount;
  }
  return totalOrders;
}
function getDeliverBoyPastWeekStats(pastWeekOrders){
    let totalOrders =0;
    let totalInTimeDeliveries=0;
    let totalOutTimeDeliveries=0;
    for(const item of pastWeekOrders){
        totalOrders+= item.notOnTimeCount+item.onTimeCount;
        totalInTimeDeliveries+=item.onTimeCount;
        totalOutTimeDeliveries+=item.notOnTimeCount;
    }
    return {totalOrders,totalInTimeDeliveries, totalOutTimeDeliveries}
}
function getDeliveryPersonStatsHtml(userSats){
    const ordersInPastWeek = getDeliverBoyPastWeekStats(userSats.pastWeekOrders)
    const userStatsHtml = 
    `
<!DOCTYPE html> 
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Stats and Bar Graph</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
            }

            h2 {
                text-align: center;
            }

            .stats-container {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                margin-top: 20px;
                background-color: #000
            }

            .stat {
                flex: 1;
                text-align: center;
                border: 1px solid #ccc;
                padding: 10px;
            }
            .stat h3 {
                color: white
            }
            .stat p {
                color: gray
            }
            .bar-graph {
                display: flex;
                align-items: flex-end;
                height: 200px;
            }

            .bar {
                flex: 1;
                margin: 0 2px;
                background-color: #007bff;
                transition: height 0.3s;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h2>User Stats</h2>
            <div class="stats-container">
                <div class="stat">
                    <h3>orders Assigend</h3>
                    <p>${userSats.ordersAssigend}</p>
                </div>
                <div class="stat">
                    <h3>orders Delivered</h3>
                    <p>${userSats.ordersDelivered}</p>
                </div>
                <div class="stat">
                    <h3>In Time deliveries</h3>
                    <p>${userSats.ordersInTimeDelivered}</p>
                </div>
                <div class="stat">
                    <h3>Out Time deliveries</h3>
                    <p>${userSats.ordersOutTimeDelivered}<p>
                </div>
            </div>
            <div class="stats-container">
                <div class="stat">
                    <h3>Past Week orders Assigned</h3>
                    <p>${ordersInPastWeek.totalOrders}</p>
                </div>
                <div class="stat">
                    <h3>Past Week In Time Deliveries</h3>
                    <p>${ordersInPastWeek.totalInTimeDeliveries}</p>
                </div>
                <div class="stat">
                        <h3>Past Week out Time Deliveries</h3>
                        <p>${ordersInPastWeek.totalOutTimeDeliveries}</p>
                </div>
                <div class="stat">
                        <h3>Total Bonus</h3>
                        <p>${userSats.totalBonusEarned}</p>
                </div>
            </div>
        </div>
    </body>

</html>
    `
    return userStatsHtml;
}

function getClerkStatsHtml(userSats){
    const ordersInPastWeek= getOrdersInPastWeek(userSats.pastWeekOrders)
    const userStatsHtml = 
    `
<!DOCTYPE html> 
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Stats and Bar Graph</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
            }

            h2 {
                text-align: center;
            }

            .stats-container {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                margin-top: 20px;
                background-color: #000
            }

            .stat {
                flex: 1;
                text-align: center;
                border: 1px solid #ccc;
                padding: 10px;
            }
            .stat h3 {
                color: white
            }
            .stat p {
                color: gray
            }
            .bar-graph {
                display: flex;
                align-items: flex-end;
                height: 200px;
            }

            .bar {
                flex: 1;
                margin: 0 2px;
                background-color: #007bff;
                transition: height 0.3s;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h2>User Stats</h2>
            <div class="stats-container">
                <div class="stat">
                    <h3>Orders Placed</h3>
                    <p>${userSats.ordersPlaced}</p>
                </div>
                <div class="stat">
                    <h3>Orders Delivered</h3>
                    <p>${userSats.ordersDelivered}</p>
                </div>
                <div class="stat">
                    <h3>Orders In Progress</h3>
                    <p>${userSats.ordersInProgress}</p>
                </div>
                <div class="stat">
                    <h3>Past Week Orders</h3>
                    <p>${ordersInPastWeek}<p>
            </div>
            </div>
        </div>
    </body>

</html>`
return userStatsHtml;
}
async function downloadReport(){
    let userStatsHtml= ''
    let res
    switch (user.value.role) {
        case 1:
        res = await StatsServices.getClerkStats(user.value.id)

        userStatsHtml = getClerkStatsHtml(res.data)
            break;
        case 2:
        res = await StatsServices.getDeliveryPersonStats(user.value.id)
        console.log(res.data)
        userStatsHtml = getDeliveryPersonStatsHtml(res.data)
            break
        case 3:
            break
        case 4:
            break;
    }
    // const barGraphofUser= generateBarGraph(userSats.pastWeekOrders)
    
    const options = {
        margin: [10, 10], // Page margins (top, right, bottom, left)
        filename: 'report.pdf',
        image: { type: 'jpeg', quality: 0.98 }, // Optional image settings
        html2canvas: { scale: 2 }, // Optional html2canvas settings
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, // Optional jsPDF settings
    };

    // Generate the PDF from the HTML content
    html2pdf().from(userStatsHtml).set(options).save();
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
                            <DialogTitle as="h3" class="flex text-lg font-medium leading-6 text-gray-900">
                                User information
                                <!-- <div class="flex flex-row-reverse"> -->
                                <button v-show="props.enableReport" @click="downloadReport" class="ml-10 bg-primary text-white font-bold px-4 py-1 rounded">
                                Download Report
                                </button>
                            <!-- </div> -->
                            </DialogTitle>
                            
                            <div class="mt-4 border-t border-gray-200 pt-5">
                                <div class="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label for="first-name" class="block text-sm font-medium text-gray-700">First
                                            name</label>
                                        <div class="mt-1">
                                            <input type="text" id="first-name" name="first-name" autocomplete="given-name"
                                                :value="user.firstName"
                                                :disabled="true"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="last-name" class="block text-sm font-medium text-gray-700">Last
                                            name</label>
                                        <div class="mt-1">
                                            <input type="text" id="last-name" name="last-name" autocomplete="family-name"
                                                :value="user.lastName"
                                                :disabled="true"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                    <div class="sm:col-span-2">
                                        <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                                        <div class="mt-1">
                                            <input type="text" name="role"
                                                :value="getEployeeRole(user.role)"
                                                :disabled="true"
                                                id="role" autocomplete="street-address"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                    <div class="sm:col-span-2">
                                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                                        <div class="mt-1">
                                            <input type="text" name="email" id="email" autocomplete="email"
                                                :value="user.email"
                                                :disabled="true"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

  