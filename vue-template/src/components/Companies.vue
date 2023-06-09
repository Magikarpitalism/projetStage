<template>
  <div class="main-container">
  <!-- The Widget component is a type of 'container' component.
  It's a reusable structure that can encapsulate other React components.
  This helps in managing the UI structure, reusability, and promoting DRY (Don't Repeat Yourself) principle. -->
    <Widget>
      <!-- Title for the widget -->
      <template slot="title">Companies</template>
      <!-- Input field to search companies -->
      <b-form-input v-model="search" @keyup.enter="applySearch" type="text" placeholder="Search" />
      <!-- Table to list companies -->
      <table class="table table-striped">
        <thead>
          <!-- Table headers -->
          <tr>
            <th>Name</th>
            <th>Siret</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <!-- Generate a row for each company. Use click event to open modal with company details -->
          <tr v-for="(company, index) in filteredCompanies" :key="index" @click="showModal(company)">
            <!-- Display company details in each cell -->
            <td>{{ company.name }}</td>
            <td>{{ company.siret }}</td>
            <td>{{ company.email }}</td>
            <td>{{ company.phone }}</td>
            <td>
              <!-- Buttons for modifying and deleting a company. Use click event to open modal for modification and deletion -->
              <b-button variant="primary" class="mr-2" @click.stop="modifyCompany(company)">mod</b-button>  
              <b-button variant="danger" @click.stop="deleteCompany(company)">del</b-button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Modify Company Modal -->
      <b-modal v-model="showModifyCompanyModal" title="Modify Company">
        <!-- Form to capture updated company details -->
        <b-form @submit.prevent="updateCompany"> <!-- Add the @submit.prevent directive that will call the updateCompany method by using the v-model directive on the form inputs -->
          <b-form-group label="Name" label-for="companyName">
            <b-form-input id="companyName" v-model="modifiedCompany.name" required></b-form-input>
          </b-form-group>
          <b-form-group label="Siret" label-for="companySiret">
            <b-form-input id="companySiret" v-model="modifiedCompany.siret" required></b-form-input>
          </b-form-group>
          <b-form-group label="Email" label-for="companyEmail">
            <b-form-input id="companyEmail" v-model="modifiedCompany.email" required></b-form-input>
          </b-form-group>
          <b-form-group label="Phone" label-for="companyPhone">
            <b-form-input id="companyPhone" v-model="modifiedCompany.phone" required></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="success">Submit</b-button>
        </b-form>
      </b-modal>
      <div class="pagination">
        <p class="aff">Affichage: &nbsp</p>
        <b-select v-model="itemsPerPage" :options="limitOptions" class="limit-dropdown" @input="applySearch"></b-select>
        <b-button v-if="currentPage > 5" @click="goToPage(currentPage - 5)">&laquo;</b-button>
        <b-button v-for="page in pageNumbers" :key="page" @click="goToPage(page)" :disabled="page === currentPage">{{ page }}</b-button>
        <b-button v-if="currentPage < totalPageCount - 4" @click="goToPage(currentPage + 5)">&raquo;</b-button>
        <b-select v-model="currentPage" :options="Array.from({ length: totalPageCount }, (_, i) => i + 1)" class="page-dropdown" @input="goToPage"></b-select>
      </div>
    </Widget>
    <Modal v-if="showCompanyModal" @close="showCompanyModal = false">
  <div class="modal-container">
    <br><br><h2>Company Details</h2><br><br>
    <div class="details-container">
      <div class="details-left">
        <p>Name: {{ selectedCompany.name }}</p>
        <p>Siret: {{ selectedCompany.siret }}</p>
        <p>Email: {{ selectedCompany.email }}</p>
        <p>Address: {{ selectedCompany.address_id }}</p>
      </div>
      <div class="details-right">
        <p>Billing address: {{ selectedCompany.billing_address_id }}</p>
        <p>Phone: {{ selectedCompany.phone }}</p>
        <p @click="showContactModal(selectedCompany)" class="contact-list-link">Contact List</p>
      </div>
    </div>
  </div>
</modal>
<Modal v-if="displayContactModal" @close="displayContactModal = false">
  <div class="contact-modal">
    <div class="modal-container"> 
      <br><br><h2>Contact Details</h2><br>
      <div class="details-container">
        <div class="table-container">
        <table class="table table-striped contact-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Address ID</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(contact, index) in pageOfContactItems" :key="index">
              <td>{{ contact.firstName }}</td>
              <td>{{ contact.lastName }}</td>
              <td>{{ contact.email }}</td>
              <td>{{ contact.address_id }}</td>
              <td>{{ contact.phone }}</td>
            </tr>
          </tbody>
        </table>
        <br><jw-pagination :items="selectedContacts" @changePage="onChangeContactPage"></jw-pagination><br>
      </div>
    </div>
  </div>
</div>
  </modal>
  <!-- ADD button -->
  <b-button variant="primary" @click="showAddCompanyModal = true">ADD</b-button>

  <!-- Modal for adding a new company -->
  <b-modal v-model="showAddCompanyModal" title="Add a new company">
    <b-form @submit.prevent="addCompany">
      <b-form-group label="Company Name" label-for="companyName">
        <b-form-input id="companyName" v-model="newCompany.name" required></b-form-input>
      </b-form-group>

      <!-- Add more fields as necessary... -->

      <b-button type="submit" variant="success">Submit</b-button>
    </b-form>
  </b-modal>
  </div>
</template>

<script>
import axios from 'axios'; // Importing axios for making HTTP requests
import Widget from '@/components/Widget/Widget'; // Importing Widget component
import JwPagination from 'jw-vue-pagination'; // Importing pagination component
import Modal from '@/components/modal'; // Importing modal component

export default {
  name: 'Tables',
  components: { Widget, Modal, JwPagination}, // Registering components to be used in this component
  data() { // Data function to provide reactive data
    return { // The reactive data
      companies: [], // Array to hold companies data fetched from the API
      allCompanies: [], // Array to hold all companies data
      pageOfItems: [], // Holds the current page of items
      pageOfContactItems: [], // Holds the current page of contact items
      selectedCompany: {}, // Object to hold data of a selected company
      selectedContacts: [], // Array to hold contacts of a selected company
      showCompanyModal: false, // Boolean to control the visibility of company details modal
      displayContactModal: false, // Boolean to control the visibility of contact details modal
      showAddCompanyModal: false, // Boolean to control the visibility of add company modal
      currentOffset: 0, // Current offset for fetching companies
      limit: 10, // Limit for fetching companies
      limitOptions: [10, 20, 50], // Options for page limit
      search: '', // Search input
      searchQuery: '', // Applied search query
      itemsPerPage: 10, // Items per page
      currentPage: 1, // Current page number
      newCompany: { // Object to hold new company data
        name: ''
      },
      showModifyCompanyModal: false, // Boolean to control the visibility of modify company modal
      modifiedCompany: { // Object to hold data of a company being modified
        name: '',
        siret: '',
        email: '',
        phone: ''
      }
    };
  },
  computed: { // Computed properties
    totalPages() { // Total number of pages
      return Math.ceil(10973 / this.limit);
    },
    currentPage() { // Calculating current page
      return this.currentOffset / this.limit + 1;
    },
    pageNumbers() { // Calculate the range of page numbers to show in the pagination
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = startPage + 9;
      if (endPage > this.totalPageCount) {
        endPage = this.totalPageCount;
        startPage = Math.max(1, endPage - 4);
      }
      return Array.from({ length: endPage - startPage + 1 }, (v, i) => i + startPage);
    },
    filteredCompanies() { // Filtered companies based on search query
      // If no search query, return current page of companies
      if (!this.searchQuery) return this.allCompanies.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
      
      // If search query, filter all companies based on the query
      const filtered = this.allCompanies.filter(company => 
        Object.values(company).some(value => 
          value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );
      return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    },

    filteredCompaniesCount() { // Count of filtered companies
      if (!this.searchQuery) return this.allCompanies.length;

      // If search query, count all companies that match the query
      return this.allCompanies.filter(company => 
        Object.values(company).some(value =>
          value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      ).length;
    },
  totalPageCount() {
    return Math.ceil(this.filteredCompaniesCount / this.itemsPerPage);
  }
},
  methods: {
  // Method to fetch all companies from the API
  // This method will fetch in batches until no more companies are returned
  async fetchAllCompanies(offset = 0, limit = 200) {
    const token = window.localStorage.getItem('authenticated'); // Get the saved JWT token
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; // Set the Authorization header

    const response = await axios.get(`http://localhost:5000/api/companies?with_data=true&offset=${offset}&limit=${limit}`);
    
    // If the response contains companies, add them to the allCompanies array
    if (response.data && response.data.length) {
      this.allCompanies = [...this.allCompanies, ...response.data];

      // Fetch the next batch of companies
      await this.fetchAllCompanies(offset + limit, limit);
    }
  },
  // Method to go to the next page
  nextPage() {
    if (this.currentPage < this.totalPageCount) {
      this.currentPage += 1;
    }
  },
  // Method to go to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
  },
  // Method to navigate to a specific page
  goToPage(page) {
    this.currentPage = page;
  },
  // Method to apply the search
  applySearch() {
    this.searchQuery = this.search;
    this.currentPage = 1; // Reset to first page whenever a new search is applied
  },
  // Method to handle page change
  // It updates the pageOfItems and fetches the next set of companies if necessary
  onChangePage(pageOfItems) {
    // update page of items
    this.pageOfItems = pageOfItems;

    // If the user has clicked next, fetch the next set of companies
    if ((this.pageOfItems[0] || {}).id > (this.companies[0] || {}).id) {
      this.nextPage();
    }
  },
  // Method to handle contact page change
  // It updates the pageOfContactItems
  onChangeContactPage(pageOfContactItems) {
    this.pageOfContactItems = pageOfContactItems;
  },
  // Method to display company modal
  showModal(company) {
    this.selectedCompany = company; // Set the selected company
    this.showCompanyModal = true; // Show the company modal
  },
// This method is used to add a new company. It's an asynchronous function, meaning it returns a Promise.
async addCompany() {
      try {
        // Here we send a POST request to the server with the new company data. This data is stored in the `newCompany` object.
        // The server is expected to create a new company with this data and return a response.
        await axios.post('http://localhost:5000/api/companies', this.newCompany);
        // If the request was successful, we hide the add company modal by setting `showAddCompanyModal` to false
        this.showAddCompanyModal = false;
        // We also clear the name of the new company
        this.newCompany.name = '';
        // If necessary, we could fetch the updated list of companies here. This would allow us to display the newly added company without requiring the user to refresh the page.
        // However, this is not implemented in this script.
      } catch (error) {
        // If there was an error with the request, we log it to the console.
        console.log(error);
      }
    },
    // This asynchronous method fetches contact data by their IDs
    async fetchContactsByIds(ids) {
      // First, we get the authentication token from the local storage
      const token = window.localStorage.getItem('authenticated'); // Get the saved JWT token
      // We set the Authorization header for the axios requests
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; // Set the Authorization header
      // Then, we send a GET request to the server to fetch the contacts
      const response = await axios.get("http://localhost:5000/api/contacts");
      // We assume the response data is an array of contacts. We filter this array to only keep the contacts whose IDs are included in the `ids` parameter.
      // The `ids` parameter is expected to be an array of IDs.
      this.selectedContacts = response.data.flat().filter(contact => ids.includes(contact.id));
    },
    // This asynchronous method displays the contact modal for a given company
    async showContactModal(company) {
      // We first log a message to the console for debugging purposes
      console.log("Opening contacts modal");
      // Then, we fetch the contacts of the given company using the `fetchContactsByIds` method. 
      // The `contact_ids` property of the company is expected to be an array of IDs.
      await this.fetchContactsByIds(company.contact_ids);
      // Once the contacts have been fetched, we display the contact modal by setting `displayContactModal` to true
      this.displayContactModal = true;
    },
    modifyCompany(company) {
    this.modifiedCompany = Object.assign({}, company); // copy the company data to prevent mutating the original
    this.showModifyCompanyModal = true;
    },
    async updateCompany() {
      try {
        await axios.put(`http://localhost:5000/api/companies/${this.modifiedCompany.id}`, this.modifiedCompany);
        // If the request is successful, find the company in the companies array and update it
        let index = this.companies.findIndex(c => c.id === this.modifiedCompany.id);
        if (index !== -1) {
          this.companies[index] = Object.assign({}, this.modifiedCompany);
        }
        this.showModifyCompanyModal = false;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteCompany(company) {
      // Confirm with the user that they want to delete the company
      if (confirm(`Are you sure you want to delete ${company.name}? This action cannot be undone.`)) {
        // If they confirm, send a DELETE request to the server with the company's id
        try {
          await axios.delete(`http://localhost:5000/api/companies/${company.id}`);
          // After successfully deleting the company, remove it from the companies array
          this.companies = this.companies.filter(c => c.id !== company.id);
        } catch (error) {
          // Handle the error...
          console.error(error);
        }
      }
    },
  },
  created() {
    // Fetch all companies as soon as the Vue instance is created.
    this.fetchAllCompanies();
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
  table-layout: fixed; /* This should help with the 'squished' issue */
}

.table th,
.table td {
  padding: 1rem; 
  text-align: center; /* This will center the text inside the cells */
}
.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px; /* adjust as needed */
}

.details-container {
  color: white;
  display: flex;
  justify-content: space-between;
  width: 70%; /* Reduce the width to create a padding effect */
  margin: auto; /* Center the details container */
}

.details-left, .details-right {
  display: flex;
  flex-direction: column;
  margin-bottom: 40px; /* Add space at the bottom of each item */
}

.details-left p, .details-right p {
  margin-bottom: 40px; /* Add space between data points */
}
.contact-list-link {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.854);
}
.contact-table {
  width: 100%; 
  table-layout: auto; 
}

.contact-table th,
.contact-table td {
  padding: 1rem; 
  text-align: center;
  width: 20%; /* adjust as necessary to give more space between columns */
}
.contact-modal {
  margin-left: -15px;
}
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
