<script setup>
import SideNavBar from "../components/SideNavBar.vue";
import { ref } from "vue";
import { CheckCircleIcon, TrashIcon } from '@heroicons/vue/20/solid'

const cost = ref(
    {
        subtotal: 0,
        taxedAmount:0,
        totalAmount:0 
    })
    // More products...

//TODO handle actual logic
function handleEstimateCost(){
    const subtotal = 100;
    const taxedAmount= subtotal*0.05;
    cost.value={subtotal,taxedAmount,totalAmount: subtotal+taxedAmount}
}
</script>

<template>
    <div class="flex flex-1">
        <SideNavBar />
        <div class="h-screen mt-6">
            <div class="bg-gray-50">

                <div class="mx-auto max-w-2xl px-4 pb-20 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 class="sr-only">Checkout</h2>

                    <form class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        <div>
                            <div>
                                <h2 class="text-lg font-medium text-gray-900">Contact information</h2>

                                <div class="mt-4">
                                    <label for="email-address" class="block text-sm font-medium text-gray-700">Email
                                        address</label>
                                    <div class="mt-1">
                                        <input type="email" id="email-address" name="email-address" autocomplete="email"
                                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </div>
                                </div>
                                <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label for="first-name" class="block text-sm font-medium text-gray-700">First
                                            name</label>
                                        <div class="mt-1">
                                            <input type="text" id="first-name" name="first-name" autocomplete="given-name"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="last-name" class="block text-sm font-medium text-gray-700">Last
                                            name</label>
                                        <div class="mt-1">
                                            <input type="text" id="last-name" name="last-name" autocomplete="family-name"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-10 border-t border-gray-200 pt-10">
                                <h2 class="text-lg font-medium text-gray-900">Shipping information</h2>

                                <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div>
                                        <label for="first-name" class="block text-sm font-medium text-gray-700">First
                                            name</label>
                                        <div class="mt-1">
                                            <input type="text" id="first-name" name="first-name" autocomplete="given-name"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label for="last-name" class="block text-sm font-medium text-gray-700">Last
                                            name</label>
                                        <div class="mt-1">
                                            <input type="text" id="last-name" name="last-name" autocomplete="family-name"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                    <div class="sm:col-span-2">
                                        <label for="address" class="block text-sm font-medium text-gray-700">Pick up Location</label>
                                        <div class="mt-1">
                                            <input type="text" name="address" id="address" autocomplete="street-address"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>

                                    <div class="sm:col-span-2">
                                        <label for="address" class="block text-sm font-medium text-gray-700">Drop up Location</label>
                                        <div class="mt-1">
                                            <input type="text" name="apartment" id="apartment"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                    <div class="sm:col-span-2">
                                        <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                                        <div class="mt-1">
                                            <input type="text" name="phone" id="phone" autocomplete="tel"
                                                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Order summary -->
                        <div class="mt-10 lg:mt-0">
                            <h2 class="text-lg font-medium text-gray-900">Order summary</h2>

                            <div class="mt-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
                                    <div class="flex px-4 py-6 sm:px-6"> 
                                        <div class="ml-3 flex flex-1 flex-col">
                                            <div class="flex">
                                                <div class="min-w-0 flex-1">
                                                    <div>
                                                        <label for="productName"
                                                            class="block text-sm font-medium text-gray-700">Product Name</label>
                                                        <div class="mt-1">
                                                            <input type="text" id="productName" name="productName" placeholder="eg: parcel"
                                                                autocomplete="given-name"
                                                                class="block w-full rounded-md border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="ml-4 flow-root flex-shrink-0">
                                                    <button type="button"
                                                        class="-m-2.5 flex items-center justify-center bg-gray-50 p-2.5 text-gray-400 hover:text-gray-500">
                                                        <span class="sr-only">Remove</span>
                                                        <TrashIcon class="h-5 w-5" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="flex flex-1 items-end justify-between pt-2">
                                                <button type="button" @click="handleEstimateCost"
                                    class="rounded-md border border-transparent bg-indigo-600 px-2 py-1.5 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Estimate cost</button>
                                            </div>
                                        </div>
                                    </div>
                                <dl class="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                                    <div class="flex items-center justify-between">
                                        <dt class="text-sm">Subtotal</dt>
                                        <dd class="text-sm font-medium text-gray-900">${{ cost.subtotal }}</dd>
                                    </div>
                                <div class="flex items-center justify-between">
                                    <dt class="text-sm">Taxes</dt>
                                    <dd class="text-sm font-medium text-gray-900">${{ cost.taxedAmount }}</dd>
                                </div>
                                <div class="flex items-center justify-between border-t border-gray-200 pt-6">
                                    <dt class="text-base font-medium">Total</dt>
                                    <dd class="text-base font-medium text-gray-900">${{ cost.totalAmount }}</dd>
                                </div>
                            </dl>

                            <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                                <button type="submit"
                                    class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Confirm
                                    order</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div></template>
