import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("./views/Dashboard.vue"),
    },
    {
      path:"/placeOrder",
      name:"place order",
      component: ()=> import("./views/placeOrder.vue"),
    },
    {
      path:"/employees",
      name:"employees",
      component: ()=> import("./views/Employees.vue"),
    },
    {
      path:"/clerks",
      name:"clerks",
      component: ()=> import("./views/Clerks.vue"),
    },
    {
      path:"/deliveryPersons",
      name:"delivery person",
      component: ()=> import("./views/DeliverPersons.vue"),
    },
    {
      path:"/customers",
      name:"customers",
      component: ()=> import("./views/Coustomers.vue"),
    },
    {
      path:"/ordersPlaced",
      name: "orders",
      component: ()=> import("./views/TrackOrder.vue"),
    },
    {
      path:"/myOrders",
      name: "my orders",
      component: ()=> import("./views/MyOrders.vue"),
    },
    {
      path:"/assignedOrder",
      name: "assigned order",
      component: ()=> import("./views/AssignedOrder.vue"),
    },
    {
      path:"/profile",
      name: "profile",
      component: ()=> import("./views/Profile.vue"),
    }
  ],
});

export default router;
