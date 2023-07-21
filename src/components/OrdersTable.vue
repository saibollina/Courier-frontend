<script setup>
import { defineProps, ref } from "vue";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/vue/24/outline';
import OrderEditModal from '../components/OrderEditModal.vue';
import OrderViewModal from '../components/OrderViewModal.vue';

const openView = ref(false)
const openEdit = ref(false)
const openRemove = ref(false)
const orderId = ref('')
const props = defineProps(["orders","enableEditActions"]);

function handleView(orderid){
    orderId.value= orderid
    openView.value = !openView.value
}
function handleEdit(orderid){
    orderId.value= orderid
openEdit.value = !openEdit.value
}
function handleRemove(orderid){
    orderId.value= orderid
    openRemove.value = !openRemove.value
}
</script>
<template>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Orders</h1>
          <p class="mt-2 text-sm text-gray-700">List of all the orders</p>
        </div>
      </div>
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">OrderId</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">OrderedBy</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cost</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estimated Time</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <span class="sr-only">Edit</span>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="order in orders" :key="order.id">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ order.id }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ order.orderedByCustomer.name  }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ order.status }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">$ {{ order.cost }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ order.estimatedDeliveryTime }} mins</td>
                    <td class="flex flex-1 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">

                        <button type="button"
                            class="mx-0.5 flex items-center justify-center  hover:text-gray-500"
                            @click="handleView(order.id)">
                            <span class="sr-only">View</span>
                            <EyeIcon  class="h-5 w-5" aria-hidden="true" />
                        </button>

                        <button v-show="enableEditActions" type="button"
                            class="mx-0.5 flex items-center justify-center  hover:text-gray-500"
                            @click="handleEdit(order.id)">
                            <span class="sr-only">Edit</span>
                            <PencilSquareIcon class="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button v-show="enableEditActions" type="button" class="mx-0.5 flex items-center justify-center  hover:text-gray-500"
                            @click="handleRemove(order.id)">
                            <span class="sr-only">Remove</span>
                            <TrashIcon class="h-5 w-5" aria-hidden="true" />
                        </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        <OrderViewModal v-if="openView" :show="openView" :function="handleView" :user="userId" :orderId="orderId"/> 
        <OrderEditModal v-if="openEdit" :show="openEdit" :function="handleEdit" :user="userId" :orderId="orderId"/>
    </div>
</template>