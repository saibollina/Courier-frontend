<script setup>
import { onMounted, ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import SideNavBar from '../components/SideNavBar.vue'
import UserServices from '../services/UserServices.js'
import StatsServices from '../services/StatsServices.js'
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
} from '@heroicons/vue/24/outline'
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

const stats = ref({
    "usersByRole": [
        {
            "role": 1,
            "number_of_users": 0
        },
        {
            "role": 2,
            "number_of_users": 0
        },
        {
            "role": 3,
            "number_of_users": 0
        }
    ],
    "orderCount": 0,
    "successRate": 0,
    'numberOfCustomers': 0,
    "ordersDeliveredCount": 0,
})
const statuses = { 1: 'text-green-400 bg-green-400/10', 0: 'text-rose-400 bg-rose-400/10' }
const activityItems = ref([
  {
    name: 'Michael Foster',
    role: 'main',
    status: '1',
    orderCount: '3'
  },
  // More items...
])

function getEployeeRole(roleId) {
    const roles = new Map([
        [1, 'Clerk'],
        [2, 'Delivery Person'],
        [3, 'Admin'],
        [4, 'Customer']
    ]);
    return roles.get(roleId);
}
function getEmployeeCount(roleId) {
  const user= stats.value.usersByRole.filter((user)=>{
    return user.role===roleId
  })
  return user[0].number_of_users;
  
}
onMounted(async()=>{
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
    if (loggedInUser.role === 3) {
        
        const response = await UserServices.getUsers();
        activityItems.value = response.data
        console.log('userss', activityItems.value)
        const res = await StatsServices.getAdminStats();
        stats.value = res.data
    } else {
        await getAllOrdersPlacedByClerk(loggedInUser.id)
    }
});


</script>
<template>
  <div class="flex flex-1 ">
    <!-- <SideNavBar /> -->
    <div class="mt-8">


      <main>
        <header>
          <!-- Secondary navigation -->
          <!-- <nav class="flex overflow-x-auto border-b border-white/10 py-4 bg-gray-900">
            <ul role="list" class="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8">
              <li v-for="item in secondaryNavigation" :key="item.name">
                <a :href="item.href" :class="item.current ? 'text-primary' : ''">{{ item.name }}</a>
              </li>
            </ul>
          </nav> -->

          <!-- Heading -->
          <!-- <div class="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-900 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          </div> -->

          <!-- Stats -->
          <div class="grid grid-cols-1 bg-gray-900 sm:grid-cols-2 lg:grid-cols-4">
            <div  :class="['border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Number of Clerks</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ getEmployeeCount(1) }}</span>

              </p>
            </div>
            <div  :class="['sm:border-l border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Number of Admins</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ getEmployeeCount(3) }}</span>

              </p>
            </div>
            <div  :class=" [ 'lg:border-l border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Number of Delivery Persons</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ getEmployeeCount(2) }}</span>

              </p>
            </div>
            <div  :class="['sm:border-l border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Number of Customers</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ stats.numberOfCustomers }}</span>
              </p>
            </div>
            <div  :class="['sm:border-l border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Orders placed</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ stats.orderCount }}</span>
              </p>
            </div>
            <div  :class="['sm:border-l border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Orders Delivered</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ stats.ordersDeliveredCount }}</span>
              </p>
            </div>
            <div  :class="['sm:border-l border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Delivered in Time</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ stats.successRate.toFixed(2) }} %</span>
              </p>
            </div>
            <div  :class="['sm:border-l border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Delivered out of Time</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ (100 - stats.successRate).toFixed(2) }} %</span>
              </p>
            </div>
          </div>
        </header>

        <!-- Activity list -->
        <div class="border-t border-white/10 pt-11 bg-gray-900">
          <h2 class="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">Staff</h2>
          <table class="mt-6 w-full whitespace-nowrap text-left">
            <colgroup>
              <col class="w-full sm:w-4/12" />
              <col class="lg:w-4/12" />
              <col class="lg:w-2/12" />
              <col class="lg:w-1/12" />
              <col class="lg:w-1/12" />
            </colgroup>
            <thead class="border-b border-white/10 text-sm leading-6 text-white">
              <tr>
                <th scope="col" class="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">User</th>
                <th scope="col" class="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">Role</th>
                <th scope="col" class="py-2 pl-0 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">Status</th>
                <!-- <th scope="col" class="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">Deployed at</th> -->
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="item in activityItems" :key="item.commit">
                <td class="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                  <div class="flex items-center gap-x-4">
                    <!-- <img :src="item.user.imageUrl" alt="" class="h-8 w-8 rounded-full bg-gray-800" /> -->
                    <div class="truncate text-sm font-medium leading-6 text-white">{{ item.name }}</div>
                  </div>
                </td>
                <td class="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                  <div class="flex gap-x-3">
                    <!-- <div class="font-mono text-sm leading-6 text-gray-400">{{ item.role }}</div> -->
                    <span class="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">{{ getEployeeRole(item.role) }}</span>
                  </div>
                </td>
                <td class="py-4 pl-0 text-sm leading-6 sm:pr-8 lg:pr-20">
                  <div class="flex items-center justify-end gap-x-2 sm:justify-start">
                    <div :class="[statuses[item.status], 'flex-none rounded-full p-1']">
                      <div class="h-1.5 w-1.5 rounded-full bg-current" />
                    </div>
                    <div class="hidden text-white sm:block">{{ item.status ? 'Active': 'Offline' }}</div>
                  </div>
                </td>
                <!-- <td class="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">{{ item.orderCount }}</td> -->
                <!-- <td class="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                  <time :datetime="item.dateTime">{{ item.date }}</time>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>