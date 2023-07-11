<script setup>
import { onMounted,ref } from "vue";
import { useRouter } from "vue-router";
import {
  ChartPieIcon,
  HomeIcon,
  UsersIcon,
  TruckIcon,
  BriefcaseIcon
} from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import UserServices from "../services/UserServices.js";
import { defineProps } from "vue";

const props = defineProps(["showEmployeeSubNav"]);

const router = useRouter();
const navigation = ref([
  { name: 'Dashboard', href: '', icon: HomeIcon, count: '', current: router.currentRoute.value.path ==='/dashboard' , roles:[1,2,3]},
  { name: 'Place order', href: '#', icon: TruckIcon, count: '', current: router.currentRoute.value.path ==='/placeOrder' , roles:[1]},
  { name: 'Employees', href: '#', icon: UsersIcon, count:'',current: router.currentRoute.value.path ==='/employees', roles: [3],children: [
      { name: 'Clerks', href: '#', current: router.currentRoute.value.path ==='/clerks' },
      { name: 'Delivery Person', href: '#', current: router.currentRoute.value.path ==='/deliveryPersons' },
      { name: 'Customers', href: '#', current: router.currentRoute.value.path ==='/customers' },
    ], },
    { name: 'Orders', href: '#', icon: BriefcaseIcon, count:'',current: false, roles:[1,3]},
  { name: 'Reports', href: '#', icon: ChartPieIcon, count:'',current: false, roles:[3]}
  
])

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
const open = ref(props.showEmployeeSubNav);
const loggedInUser = JSON.parse(localStorage.getItem("user"));
async function handleSignout (){
  await UserServices.logoutUser(loggedInUser)
    .catch((error) => {
      console.log(error);
      localStorage.removeItem("user");
    }).finally(()=>{
      localStorage.removeItem("user");
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Logged out successful!";
      router.push({ name: "login" });
    })
}

//TODO
function handleProfile (){
  
}
function closeSnackBar() {
  snackbar.value.value = false;
}

  function handleNavigation(item){
    navigation.value.forEach((nav) => {
      nav.current = (nav === item);
    });
    router.push({ name: item.name.toLowerCase()})

  }

  function handleSubItemNavigation(item, subItem){
    console.log({item, subItem})
    navigation.value.forEach((nav) => {
      if(nav === item){
        nav.children.forEach((subNav)=>{subNav.current = (subNav === subItem)});
      }
      else{
        nav.current = false;
      }
    });
    router.push({ name: subItem.name.toLowerCase()})

  }

function handleDisclosure(){
  console.log("handleDisclosure", open.value)
  open.value = !open.value
  console.log("after handleDisclosure", open.value)
}
</script>

<template>
  <div class="hidden h-screen w-80 lg:inset-y-0 lg:flex lg:flex-col">
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
                <button v-if="item.roles.includes(loggedInUser.role) && !item.children" :id="item.name"
                  @click="handleNavigation(item)"
                  :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                  <component :is="item.icon" class="h-6 w-6 shrink-0 mr-1" aria-hidden="true" />
                  {{ item.name }}
                  <span v-if="item.count"
                    class="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-gray-900 px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-white ring-1 ring-inset ring-gray-700"
                    aria-hidden="true">{{ item.count }}</span>
                </button>
                <template v-else-if="item.roles.includes(loggedInUser.role)">
                  <button @click="handleNavigation(item);handleDisclosure()"
                    :class="[item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']"
                  >
                    <component :is="item.icon" class="h-6 w-6 shrink-0 mr-1" aria-hidden="true" />
                    {{ item.name }}
                  </button>
                  <ul v-show="open" class="mt-1 px-2">
                    <li v-for="subItem in item.children" :key="subItem.name">
                      <button :id="subItem.name"
                        @click="handleSubItemNavigation(item, subItem);$event.stopPropagation()"
                        :class="[subItem.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800', 'group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']"
                      >
                        {{ subItem.name }}
                      </button>
                    </li>
                  </ul>
                </template>
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
