<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const router = useRouter();
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
  role: "3"
});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    router.push({ name: "dashboard" });
  }
});


async function createAccount() {
  await UserServices.addUser(user.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Account created successfully!";
      router.push({ name: "login" });
      isCreateAccount.value = false;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function login() {
  
  await UserServices.loginUser(user)
    .then((data) => {
      window.localStorage.setItem("user", JSON.stringify(data.data));
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Login successful!";
      router.push({ name: "dashboard" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="flex flex-row sm:mx-auto sm:w-full sm:max-w-md items-center">
      <img class="mr-5 h-10 w-auto" src="/oc_logo.png" alt="Your Company" />
      <h2 class="text-2xl font-bold leading-9 tracking-tight text-gray-900">Couriers</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <form class="space-y-6" @submit.prevent="login" method="POST">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div class="mt-2">
              <input v-model="user.email" id="email" name="email" type="email" autocomplete="email" required=""
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="mt-2">
              <input id="password" name="password" type="password" autocomplete="current-password" required=""
                :value="user.password" @input="user.password = $event.target.value"
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            </div>
          </div>
          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md bg-[#80162B] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#80162B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
              in</button>
          </div>
        </form>
      </div>

      <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        {{ ' ' }}
        <a href="#" @click="openCreateAccount" class="font-semibold leading-6 text-[#80162B] hover:text-[#80162B]">Sign
          up</a>
      </p>
    </div>
    <v-dialog persistent v-model="isCreateAccount" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Create Account </v-card-title>
        <v-card-text>
          <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>

          <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>

          <v-text-field v-model="user.email" label="Email" required></v-text-field>

          <v-text-field v-model="user.password" label="Password" required></v-text-field>
          <label for="gender">Gender:</label>
          <v-radio-group v-model="user.gender" inline>
            <v-radio label="Male" value="male"></v-radio>
            <v-radio label="Female" value="female"></v-radio>
          </v-radio-group>
          <label for="gender">Role:</label>
          <v-radio-group v-model="user.role" inline>
            <v-radio label="Clerk" value="1"></v-radio>
            <v-radio label="Delivery Person" value="2"></v-radio>
            <v-radio label="Admin" value="3"></v-radio>
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
