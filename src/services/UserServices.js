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

    return apiClient.post("customers", user);
  },
  updateUser(user) {
    return apiClient.put(`users/${user.id}`, user);
  },
  updateUserStatus(user,status) {

    return apiClient.put(`users/updateStatus/${user.id}`, {status});
  },
  updateCustomer(user) {
    return apiClient.put(`customers/${user.id}`, user);
  },
  loginUser(user) {
    
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
  getCustomerById(userId){
    return apiClient.get(`customers/${userId}`)
  },
  deleteUserById(userId){
    return apiClient.delete(`users/${userId}`)
  },
  deleteCustomerById(userId){
    return apiClient.delete(`customers/${userId}`)
  },
  getAllCustomers(){
    return apiClient.get("customers")
  }
};
