<template>
    <div class="overlay">
      <ul>
        <p class="contact">Contacts: &nbsp</p>
        <li v-for="(id, index) in contactIds" :key="index">
          <router-link :to="`/app/contacts?id=${id}`">{{ id }}</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: ['contactIds'],
  }
  </script>
  
  <style scoped>
  .overlay {
    display: flex;
    flex-direction: column; /* Change this line */
    background-color: #0553a0cd;
    /* rest of your styles */
  }
  
  .overlay ul {
    display: flex;
    flex-direction: row;
    list-style-type: none;
  }
  
  .overlay ul li {
    margin-top: 15px;
    margin-right: 10px;
  }
  .contact{
    margin-top: 15px;
    margin-right: 10px;
  }
  
  .overlay a {
    color: white;
    text-decoration: none;
  }
  
  .overlay a:hover {
    color: green;
  }
  </style>