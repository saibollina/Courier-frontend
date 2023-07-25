<script setup>
import { onMounted, ref } from 'vue'
import StatsServices from '../services/StatsServices.js'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const stats = ref({

    "ordersPlaced":0,
    "ordersDelivered":0,
    "ordersInProgress":0,
})

const deliverydData = ref({
    labels: ["Chocolate", "Vanilla", "Strawberry", "Chocolate", "Vanilla", "Strawberry", "Chocolate"],
    datasets: [
        {
            label: "Orders Placed",
            backgroundColor: "#f87979",
            data: []
        },
    ]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    x: {
      ticks: {
        color: "black", // Set X-axis label color to white
      },
      grid: {
        display: false, // Disable the Y-axis grid lines
      },
    },
    y: {
      beginAtZero: true, // Ensure Y-axis starts from zero
      ticks: {
        stepSize: 1, // Set step size to 1 to display integer values only
        color: "black", 
      },
      grid: {
        display: false, // Disable the Y-axis grid lines
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: "black", // Set legend label color to white
      },
    },
  },
}
function getPastSevenDays(data) {
  const today = new Date();
  const pastSevenDays = [];
  const x= {
    datasets: [
        {
            label: "Orders Placed",
            backgroundColor: "#f87979",
            data: []
        },
    ]
}
  const label = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const trimedDate= date.toISOString().slice(0, 10);
    const weekOrders= data.pastWeekOrders.filter(each=> each.day === trimedDate)
    if(weekOrders.length){
        x.datasets[0].data.push(weekOrders[0].orderCount)
    }
    else{
        x.datasets[0].data.push(0)
    }
    label.push(date.toISOString().slice(0, 10));

  }

  return {
        label: label.reverse(),
        datasets:[
            {
                label: "Orders Placed",
                backgroundColor: "#f87979",data:x.datasets[0].data.reverse()
            }
        ]
    };
}
onMounted(async()=>{
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
    const res = await StatsServices.getClerkStats(loggedInUser.id)
    console.log(res.data)
    stats.value= res.data;

const abc= getPastSevenDays(res.data)
console.log("abc---", abc)
    deliverydData.value = {
    labels:abc.label ,
    datasets: abc.datasets
};
});

</script>
<template>
  <div class="flex flex-1 ">
    <div class="mt-8">
      <main>
        <header>
          <div class="grid grid-cols-1 bg-gray-900 sm:grid-cols-2 lg:grid-cols-4">
            <div  :class="['border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Orders Placed</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ stats.ordersPlaced }}</span>

              </p>
            </div>
            <div  :class="['sm:border-l border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Orders delivered</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ stats.ordersDelivered }}</span>
              </p>
            </div>
            <div  :class=" [ 'lg:border-l border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8']">
              <p class="text-sm font-medium leading-6 text-gray-400">Orders In Progress</p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span class="text-4xl font-semibold tracking-tight text-white">{{ stats.ordersInProgress }}</span>
              </p>
            </div>
          </div>
          <div class="py-6"></div>
          <div class="chart-container">
            <Bar :data="deliverydData" :options="chartOptions" />
          </div>
          
        </header>
       
      </main>
      
    </div>

  </div>
</template>
<style>
.chart-container {
  width: 600px; /* Set the desired width */
  height: 400px; /* Set the desired height */
}
</style>