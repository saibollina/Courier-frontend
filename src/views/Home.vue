<script setup>
import { onMounted,ref } from "vue";
import { useRouter } from "vue-router";
import {
  ChartPieIcon,
  HomeIcon,
} from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import UserServices from "../services/UserServices.js";

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, count: '5', current: true },
  { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]
const router = useRouter();
onMounted(async () => {
  if (localStorage.getItem("user") === null) {
    router.push({ name: "login" });
  }
});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const loggedInUser = JSON.parse(localStorage.getItem("user"));
async function handleSignout (){
  console.log("signing of", loggedInUser)
  await UserServices.logoutUser(loggedInUser)
    .then((data) => {
      console.log('signed offf', data);
      localStorage.removeItem("user");
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Logged out successful!";
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}
//TODO
function handleSettings (){
  
}
//TODO
function handleProfile (){
  
}
function closeSnackBar() {
  snackbar.value.value = false;
}
</script>
<template>
  <div class="flex flex-row h-screen">
    <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 container">
      <div class="flex h-16 shrink-0 items-center mt-2">
        <img class="h-8 w-auto" src="/favicon.ico"
          alt="Your Company" />
      </div>
      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <a :href="item.href"
                  :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                  <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                  {{ item.name }}
                  <span v-if="item.count"
                    class="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-gray-900 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-white ring-1 ring-inset ring-gray-700"
                    aria-hidden="true">{{ item.count }}</span>
                </a>
              </li>
            </ul>
          </li>
          <li class="-mx-6 mt-auto">
            <a href="#"
              class="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800">
              <div class="hidden ml-2 lg:block">
                <div class="flex items-center">
                  <Menu as="div" class="relative ml-4 flex-shrink-0">
                    <div>
                      <MenuButton
                        class="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span class="sr-only">Open user menu</span>
                        <div
                          class="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                          <span class="font-medium text-gray-600 dark:text-gray-300">{{
                            loggedInUser.firstName[0].toUpperCase() }}{{ loggedInUser.lastName[0].toUpperCase() }}</span>
                        </div>
                      </MenuButton>
                    </div>
                    <transition enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                      <MenuItems
                        class="absolute left-0 z-10  w-60 custom-menu-transition rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <MenuItem v-slot="{ active }">
                        <a @click="handleProfile" :class="[active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800','block px-4 py-2 text-sm text-gray-700 font-semibold']">Your
                          Profile</a>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                        <a @click="handleSettings"
                          :class="[active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'block px-4 py-2 text-sm text-gray-700 font-semibold']">Settings</a>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                        <a @click="handleSignout" :class="[active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'block px-4 py-2 text-sm text-gray-700 font-semibold']">Sign
                          out</a>
                        </MenuItem>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
              </div>
              <span aria-hidden="true">{{ loggedInUser.firstName.toUpperCase() }} {{ loggedInUser.lastName.toUpperCase()
              }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  <div>
    <p>
      Welcome {{loggedInUser?.firstName}}!!
    </p>
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
</template>
<style>.container {
  max-width: 250px;
  
  margin-left: 0;
  
}
.custom-menu-transition{
  position: absolute;
  bottom: 52px;
}
</style>