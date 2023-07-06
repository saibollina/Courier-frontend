<script setup>
import { defineProps, ref } from "vue";
import {
  EyeIcon,
  TrashIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline';

import UserViewModal from '../components/UserViewModal.vue'
import UserEditModal from './UserEditModal.vue';
import DeleteUserModal from './DeleteUserModal.vue';

const openView = ref(false)
const openEdit = ref(false)
const openRemove = ref(false)
const userId = ref('')
const props = defineProps(["people", "userRole"]);
function getEployeeRole(roleId){
  const roles = new Map([
    [1, 'Clerk'],
    [2, 'Delivery Person'],
    [3, 'Admin'],
    [4,'Customer']
  ]);
  return roles.get(roleId);
}
function handleView(userid){
    console.log("userEmail", userid)
    userId.value= userid
    openView.value = !openView.value
}
function handleEdit(userid){
    userId.value= userid
openEdit.value = !openEdit.value
}
function handleRemove(userid){
    userId.value= userid
    openRemove.value = !openRemove.value
}
</script>
<template>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Users</h1>
          <p class="mt-2 text-sm text-gray-700">A list of all the {{ userRole }} in your account including their name, email and role.</p>
        </div>
      </div>
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <span class="sr-only">Edit</span>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="person in people" :key="person.id">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ person.name }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.email  }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ getEployeeRole(person.role) }}</td>
                    <td class="flex flex-1 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">

                        <button type="button"
                            class="mx-0.5 flex items-center justify-center  hover:text-gray-500"
                            @click="handleView(person.id)">
                            <span class="sr-only">View</span>
                            <EyeIcon  class="h-5 w-5" aria-hidden="true" />
                        </button>

                        <button type="button"
                            class="mx-0.5 flex items-center justify-center  hover:text-gray-500"
                            @click="handleEdit(person.id)">
                            <span class="sr-only">Edit</span>
                            <PencilSquareIcon class="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button type="button"
                            class="mx-0.5 flex items-center justify-center  hover:text-gray-500"
                            @click="handleRemove(person.id)">
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
        <UserViewModal v-if="openView" :show="openView" :function="handleView" :user="userId"/> 
        <UserEditModal v-if="openEdit" :show="openEdit" :function="handleEdit" :user="userId"/>
        <DeleteUserModal v-if="openRemove" :show="openRemove" :function="handleRemove" :user="userId"/>
    </div>
</template>