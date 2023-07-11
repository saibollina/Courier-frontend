<script setup>
import { defineProps, ref } from "vue";
import {
  EyeIcon,
  TrashIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline';

import UserServices from '../services/UserServices.js'

import UserViewModal from '../components/UserViewModal.vue'
import UserEditModal from './UserEditModal.vue';
import DeleteUserModal from './DeleteUserModal.vue';

const openView = ref(false)
const openEdit = ref(false)
const openRemove = ref(false)
const userId = ref('')

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const user = ref({
  firstName:'',
  lastName:'',
  email: '',
  gender:'',
  password: ''
})
const isCreateAccount = ref(false);
const props = defineProps(["people", "userRole","enableAddUser"]);
function getEployeeRole(roleId) {
  const roles = new Map([
    [1, 'Clerks'],
    [2, 'Delivery Persons'],
    [3, 'Admin'],
    [4, 'Customers']
  ]);
  return roles.get(roleId);
}

function getEployeeRoleId(roleName) {
  const roles = new Map([
    ['Clerks',1],
    ['Delivery Persons',2],
    ['Admin',3],
    ['Customers',4]
  ]);
  return roles.get(roleName);
}
function handleView(userid) {
  userId.value = userid
  openView.value = !openView.value
}
function handleEdit(userid) {
  userId.value = userid
  openEdit.value = !openEdit.value
}
function handleRemove(userid) {
  userId.value = userid
  openRemove.value = !openRemove.value
}
function addUser() {
    isCreateAccount.value = !isCreateAccount.value
}
function closeCreateAccount() {
    isCreateAccount.value = false;
    snackbar.value.value = false;
}
async function createAccount() {
  if(getEployeeRoleId(props.userRole) !==4){
    await UserServices.addUser(user.value)
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
  else{
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
}

function closeSnackBar() {
    snackbar.value.value = false;
}
</script>
<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex justify-between">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Users</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all the {{ userRole }} in your account including their name, email
          and role.</p>
      </div>
      <div v-show="enableAddUser" class="mt-4 sm:mt-0 px-3">
        <button type="button" @click="addUser"
          class="block rounded-md bg-[#80162B] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-#80162B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-[#80162B]">Add
          user</button>
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
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ person.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.email }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ getEployeeRole(person.role) }}</td>
                  <td
                    class="flex flex-1 relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">

                    <button type="button" class="mx-0.5 flex items-center justify-center  hover:text-gray-500"
                      @click="handleView(person.id)">
                      <span class="sr-only">View</span>
                      <EyeIcon class="h-5 w-5" aria-hidden="true" />
                    </button>

                    <button type="button" class="mx-0.5 flex items-center justify-center  hover:text-gray-500"
                      @click="handleEdit(person.id)">
                      <span class="sr-only">Edit</span>
                      <PencilSquareIcon class="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button type="button" class="mx-0.5 flex items-center justify-center  hover:text-gray-500"
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
    <UserViewModal v-if="openView" :show="openView" :function="handleView" :user="userId" />
    <UserEditModal v-if="openEdit" :show="openEdit" :function="handleEdit" :user="userId" />
    <DeleteUserModal v-if="openRemove" :show="openRemove" :function="handleRemove" :user="userId" />
    <v-dialog persistent v-model="isCreateAccount" width="800">
            <v-card class="rounded-lg elevation-5">
                <v-card-title class="headline mb-2">Create Account </v-card-title>
                <v-card-text>
                    <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>

                    <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>

                    <v-text-field v-model="user.email" label="Email" required></v-text-field>

                    <v-text-field v-if="getEployeeRoleId(props.userRole)!==4" v-model="user.password" label="Password" required></v-text-field>
                    <label for="gender">Gender:</label>
                    <v-radio-group v-model="user.gender" inline>
                        <v-radio label="Male" value="male"></v-radio>
                        <v-radio label="Female" value="female"></v-radio>
                    </v-radio-group>
                    <label for="gender">Role:</label>
                    <v-radio-group v-model="user.role" inline>
                        <v-radio :label="props.userRole" :value="getEployeeRoleId(props.userRole)"></v-radio>
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