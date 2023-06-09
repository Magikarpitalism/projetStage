<template>
    <div class="main-container">
      <Widget>
        <template slot="title">Contacts</template>
         <!-- A search bar. When 'Enter' is pressed, it triggers the 'applySearch' method -->
        <b-form-input v-model="search" @keyup.enter="applySearch" type="text" placeholder="Search" />
        <!-- Table for displaying contacts data -->
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loop through the 'filteredContacts' array, displaying each contact in a table row -->
            <tr v-for="(contact, index) in filteredContacts" :key="index" @click="showModal(contact)">
              <!-- Data cells for each contact's name, email, address, and phone -->
              <td>{{ contact.name }}</td>
              <td>{{ contact.email }}</td>
              <td>{{ contact.address_id }}</td>
              <td>{{ contact.phone }}</td>
              <td> <!-- Add the actions here -->
                <b-button variant="primary" class="mr-2" @click.stop="modifyContact(contact)">mod</b-button>  <!-- class="mr-2" is the bootsrap class that give some margin right -->
                <b-button variant="danger" @click.stop="deleteContact(contact)">del</b-button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Modify Company Modal -->
        <b-modal v-model="showModifyContactModal" title="Modify Contact">
          <b-form @submit.prevent="updateContact">
            <b-form-group label="Name" label-for="contactName">
              <b-form-input id="contactName" v-model="modifiedContact.name" required></b-form-input>
            </b-form-group>
            <b-form-group label="Email" label-for="contactSiret">
              <b-form-input id="contactSiret" v-model="modifiedContact.email" required></b-form-input>
            </b-form-group>
            <b-form-group label="Address" label-for="contactEmail">
              <b-form-input id="contactEmail" v-model="modifiedContact.address_id" required></b-form-input>
            </b-form-group>
            <b-form-group label="Phone" label-for="contactPhone">
              <b-form-input id="contactPhone" v-model="modifiedContact.phone" required></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="success">Submit</b-button>
          </b-form>
        </b-modal>
        <!-- Pagination elements for navigating through the contacts list -->
        <div class="pagination">
          <p class="aff">Affichage: &nbsp</p>
          <b-select v-model="itemsPerPage" :options="limitOptions" class="limit-dropdown" @input="applySearch"></b-select>
          <b-button v-if="currentPage > 5" @click="goToPage(currentPage - 5)">&laquo;</b-button>
          <b-button v-for="page in pageNumbers" :key="page" @click="goToPage(page)" :disabled="page === currentPage">{{ page }}</b-button>
          <b-button v-if="currentPage < totalPageCount - 4" @click="goToPage(currentPage + 5)">&raquo;</b-button>
          <b-select v-model="currentPage" :options="Array.from({ length: totalPageCount }, (_, i) => i + 1)" class="page-dropdown" @input="goToPage"></b-select>
        </div>
      </Widget>

      <!-- ADD button -->
      <b-button variant="primary" @click="showAddContactModal = true">ADD</b-button>

      <!-- Modal for adding a new contact -->
      <b-modal v-model="showAddContactModal" title="Add a new contact">
        <b-form @submit.prevent="addContact">
          <b-form-group label="Contact Name" label-for="contactName">
            <b-form-input id="contactName" v-model="newContact.name" required></b-form-input>
          </b-form-group>

          <!-- Add more fields as necessary... -->

          <b-button type="submit" variant="success">Submit</b-button>
        </b-form>
      </b-modal>

      <Modal v-if="showContactModal" @close="showContactModal = false">
        <div class="modal-container">
          <br><br><h3>Related Companies</h3><br>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Siret</th>
            <th>Email</th>
            <th>Address</th>
            <th>Billing address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="company in relatedCompanies" :key="company.id">
            <td>{{ company.name }}</td>
            <td>{{ company.siret }}</td>
            <td>{{ company.email }}</td>
            <td>{{ company.address_id }}</td>
            <td>{{ company.billing_address_id }}</td>
            <td>{{ company.phone }}</td>
          </tr>
        </tbody>
      </table>
      <!-- <br><jw-pagination :items="relatedCompanies" @changePage="onChangeCompPage"></jw-pagination><br> -->
    </div>
  </Modal>
    </div>
  </template>
  
  <script>
  // Import required modules from different files
  import axios from 'axios'; // To make API calls
  import Widget from '@/components/Widget/Widget'; // Importing custom widget
  import JwPagination from 'jw-vue-pagination'; // Pagination module
  import Modal from '@/components/modal'; // Modal module
  import { BModal, BButton } from 'bootstrap-vue' // Bootstrap vue components
  
  export default {
    name: 'Contacts', // Component name
    components: { 
      Widget, 
      Modal, 
      BModal, 
      BButton, 
      JwPagination // Component imports
    },
    data() { // Component data
      return {
        contacts: [], // All the contacts, initially an empty array
        allContacts: [], // To hold all contacts fetched from API
        companies: [], // Companies related to a contact
        pageOfItems: [], // Data for the current page
        pageOfCompanyItems: [], // Data for the company items in the current page
        selectedContact: {}, // Selected contact to show its related companies
        showContactModal: false, // Controls if the contact modal is shown or not
        showAddContactModal: false, // Controls if the add contact modal is shown or not
        currentOffset: 0, // To handle pagination offset
        limit: 10, // Number of contacts per page
        limitOptions: [10, 20, 50], // Options for number of contacts per page
        search: '', // Search query
        searchQuery: '', // Store the search query after pressing Enter
        itemsPerPage: 10, // Number of items per page
        currentPage: 1, // Current page
        relatedCompanies: [], // Companies related to the selected contact
        newContact: { // Data for the new contact to be added
          name: '' 
          // Add more fields as necessary...
        },
        showModifyContactModal: false, // Controls if the modify contact modal is shown or not
        modifiedContact: { // Data for the contact to be modified
          name: '',
          email: '',
          address_id: '',
          phone: ''
        }
      };
    },
    computed: {
  // Computes the total number of pages
  totalPages() {
    return Math.ceil(14981 / this.limit);
  },
  // Computes the current page based on the current offset
  currentPage() {
    return this.currentOffset / this.limit + 1;
  },
  // Computes the page numbers to be shown in the paginator
  pageNumbers() {
    // Show 10 pages at a time
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = startPage + 9;

    // Make sure we don't show more than the total number of pages
    if (endPage > this.totalPageCount) {
      endPage = this.totalPageCount;
      startPage = Math.max(1, endPage - 4);
    }

    return Array.from({ length: endPage - startPage + 1 }, (v, i) => i + startPage);
  },
  // Filters contacts based on the search query and then paginates the results
  filteredContacts() {
    // If there's no search query, return paginated contacts
    if (!this.searchQuery) return this.allContacts.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);

    // Filter contacts by search query
    const filtered = this.allContacts.filter(contact => 
      Object.values(contact).some(value => 
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );

    // Paginate filtered contacts
    return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  },

  // Returns the count of the filtered contacts
  filteredContactsCount() {
    // If there's no search query, return the total count of contacts
    if (!this.searchQuery) return this.allContacts.length;

    // Otherwise, return the count of contacts that match the search query
    return this.allContacts.filter(contact => 
      Object.values(contact).some(value => 
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    ).length;
  },

  // Computes the total page count for the pagination
  totalPageCount() {
    return Math.ceil(this.filteredContactsCount / this.itemsPerPage);
  }
},
    methods: {
  // Fetch all contacts from the API using offset and limit for pagination
  async fetchAllContacts(offset = 0, limit = 200) {
    // Retrieve the authentication token stored in local storage
    const token = window.localStorage.getItem('authenticated');
    // Set the authorization header for axios using the token
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    // Make a GET request to the API, passing in the offset and limit as query parameters
    const response = await axios.get(`http://localhost:5000/api/contacts?with_data=true&offset=${offset}&limit=${limit}`);
    // If response data exists and contains elements, append the response data to the allContacts array
    if (response.data && response.data.length) {
      this.allContacts = [...this.allContacts, ...response.data];
      // Recursively fetch the next batch of contacts
      await this.fetchAllContacts(offset + limit, limit);
    }
  },
  // Increase current page by 1 if it's not the last page
  nextPage() {
    if (this.currentPage < this.totalPageCount) {
      this.currentPage += 1;
    }
  },
  // Decrease current page by 1 if it's not the first page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  },
  // Update the current page to a specific page
  goToPage(page) {
    this.currentPage = page;
  },
  // Update the searchQuery data property when a search is made
  applySearch() {
    this.searchQuery = this.search;
    // Reset the current page to 1 every time a new search is applied
    this.currentPage = 1; 
  },
  // Update the page of items when page changes
  onChangePage(pageOfItems) {
    // Update the current page of items with the new page
    this.pageOfItems = pageOfItems;
    // If the first item on the new page has a greater ID than the first item on the current page, go to the next page
    if ((this.pageOfItems[0] || {}).id > (this.companies[0] || {}).id) {
      this.nextPage();
    }
  },
  // Fetch all companies data from the API
  async fetchCompanies() {
    const token = window.localStorage.getItem('authenticated'); // Retrieve the authentication token from local storage
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; // Set the authorization header for axios using the token
    const response = await axios.get("http://localhost:5000/api/companies"); // Send a GET request to the API endpoint for fetching companies
    console.log(response.data);
    this.companies = response.data; // Store the returned companies data in the companies array
  },
  // Update the page of company items when page changes
  onChangeCompPage(pageOfCompanyItems) {
    this.pageOfCompanyItems = pageOfCompanyItems; // Update the current page of company items with the new page
  },
  // Show modal with company related to selected contact
  async showModal(contact) {
    this.selectedContact = contact; // Store the selected contact
    await this.fetchCompanies(); // Fetch companies data when modal is shown
    // Filter companies by checking if the selected contact's id is in the company's contact_ids
    this.relatedCompanies = this.companies.filter(company => company.contact_ids && company.contact_ids.includes(contact.id));
    this.showContactModal = true; // Show the modal
  },
  // Modify the selected contact
  modifyContact(contact) { 
    this.modifiedContact = Object.assign({}, contact); // Copy the contact data to prevent mutating the original data
    this.showModifyContactModal = true; // Show the modal for modifying a contact
  },
  // Update the selected contact
  async updateContact() {
    try {
      await axios.put(`http://localhost:5000/api/contacts/${this.modifiedContact.id}`, this.modifiedContact); // Send a PUT request to update the contact
      let index = this.contacts.findIndex(c => c.id === this.modifiedContact.id); // Find the index of the modified contact in the contacts array
      if (index !== -1) {
        this.contacts[index] = Object.assign({}, this.modifiedContact); // If found, replace the contact at that index with the updated contact
      }
      this.showModifyContactModal = false; // Hide the modal
    } catch (error) {
      console.log(error); // Log any errors
    }
  },
  // Delete the selected contact
  async deleteContact(contact) {
    // Confirm with the user that they want to delete the contact
    if (confirm(`Are you sure you want to delete ${contact.name}? This action cannot be undone.`)) {
      // If they confirm, send a DELETE request to the server with the contact's id
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${contact.id}`);
        // After successfully deleting the contact, remove it from the contacts array
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
      } catch (error) {
        // Handle the error...
        console.error(error);
      }
    }
  },
  // Add a new contact
  async addContact() {
    try {
      await axios.post('http://localhost:5000/api/contacts', this.newContact); // Send a POST request to add the new contact
      this.showAddContactModal = false; // Hide the add contact modal
      this.newContact.name = ''; // Clear the new contact's name field
      this.fetchAllContacts(); // Refresh the list of all contacts
    } catch (error) {
      console.log(error); // Log any errors
    }
  },
},
    created() {
    // When the component is created, fetch all contacts
    this.fetchAllContacts();
    },
  };
  </script>
  
  <style scoped>
  .main-container {
    display: flex;
    justify-content: center; 
    width: 100%; 
    flex-direction: column;
  }
  .table {
    color: rgba(255, 255, 255, 0.854);
    width: 100%; 
    table-layout: fixed; 
  }
  .table th,
  .table td {
    padding: 1rem; 
    text-align: center; 
  }
  .modal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 800px;
  }
  .pagination {
  display: flex;
  justify-content: center; 
}
  .pagination button {
    background-color: rgb(31, 87, 255);
    color: white;
  }
  .limit-dropdown {
    margin-right: 25px;
    max-width: 70px; 
  }
  .page-dropdown {
    margin-left: 25px;
    max-width: 100px; 
  }
  .aff{
    margin-top: 7px;
  }
  </style>