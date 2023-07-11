import apiClient from "./services";

export default {
  getUsers(userRole) {
    if(userRole){

      return apiClient.get("users",{ params: { userRole: userRole }});
    }
    return apiClient.get("users");
  },
  addUser(user) {
    return apiClient.post("users", user);
  },
  addCustomer(user){
    console.log('customer', user)
    return apiClient.post("customers", user);
  },
  updateUser(user) {
    return apiClient.put(`users/${user.id}`, user);
  },
  loginUser(user) {
    console.log(user);
    return apiClient.post("login", user.value, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.value.email + ":" + user.value.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  },
  getUserByEmail(email){
    return apiClient.get(`users/email/${email}`)
  },
  getCustomerByEmail(email){
    return apiClient.get(`customers/email/${email}`)
  },
  getUserById(userId){
    return apiClient.get(`users/${userId}`)
  },
  getCustomerById(customerId) {
    return apiClient.get(`customers/${customerId}`)
  },
  deleteUserById(userId){
    return apiClient.delete(`users/${userId}`)
  },
  getAllCustomers(){
    return apiClient.get("customers")
  }
};
