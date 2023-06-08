<template>
  <div class="main-container">
    <Widget>
      <template slot="title">Companies</template>
      <b-form-input v-model="search" @keyup.enter="applySearch" type="text" placeholder="Search" />
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Siret</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(company, index) in filteredCompanies" :key="index" @click="showModal(company)">
            <td>{{ company.name }}</td>
            <td>{{ company.siret }}</td>
            <td>{{ company.email }}</td>
            <td>{{ company.phone }}</td>
            <td>
              <b-button variant="primary" class="mr-2" @click.stop="modifyCompany(company)">mod</b-button>  <!-- class="mr-2" is the bootsrap class that give some margin right -->
              <b-button variant="danger" @click.stop="deleteCompany(company)">del</b-button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Modify Company Modal -->
      <b-modal v-model="showModifyCompanyModal" title="Modify Company">
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
import axios from 'axios';
import Widget from '@/components/Widget/Widget';
import JwPagination from 'jw-vue-pagination';
import Modal from '@/components/modal';

export default {
  name: 'Tables',
  components: { Widget, Modal, JwPagination},
  data() {
    return {
      companies: [],
      allCompanies: [],
      pageOfItems: [],
      pageOfContactItems: [], // Add this line
      selectedCompany: {},
      selectedContacts: [],
      showCompanyModal: false,
      displayContactModal: false,
      showAddCompanyModal: false,
      currentOffset: 0,
      limit: 10,
      limitOptions: [10, 20, 50],
      search: '',
      searchQuery: '',
      itemsPerPage: 10,
      currentPage: 1, 
      newCompany: {
        name: ''
        // Add more fields as necessary...
      },
      showModifyCompanyModal: false,
        modifiedCompany: {
          name: '',
          siret: '',
          email: '',
          phone: ''
        }
    };
  },
  computed: {
  totalPages() {
    return Math.ceil(10973 / this.limit);
  },
  currentPage() {
    return this.currentOffset / this.limit + 1;
  },
  pageNumbers() {
    // Show 10 pages at a time
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = startPage + 9;

    if (endPage > this.totalPageCount) {
      endPage = this.totalPageCount;
      startPage = Math.max(1, endPage - 4);
    }

    return Array.from({ length: endPage - startPage + 1 }, (v, i) => i + startPage);
  },
  filteredCompanies() {
    if (!this.searchQuery) return this.allCompanies.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);

    const filtered = this.allCompanies.filter(company => 
      Object.values(company).some(value => 
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );

    return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  },

  filteredCompaniesCount() {
    if (!this.searchQuery) return this.allCompanies.length;

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
    async fetchCompanies(offset, limit) {
      const token = window.localStorage.getItem('authenticated'); 
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; 
      const response = await axios.get(`http://localhost:5000/api/companies?with_data=true&offset=${offset}&limit=${limit}`);
      console.log(response.data);
      this.companies = response.data;

      //update pageOfItems directly when companies are fetched:
      this.pageOfItems = this.companies;
    },
    nextPage() {
      if (this.currentPage < this.totalPageCount) {
        this.currentPage += 1;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    //code that make it so that you need to press enter
    applySearch() {
      this.searchQuery = this.search;
      this.currentPage = 1; // Reset to first page whenever a new search is applied
    },
    async fetchAllCompanies(offset = 0, limit = 200) {
    const token = window.localStorage.getItem('authenticated'); 
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; 

    const response = await axios.get(`http://localhost:5000/api/companies?with_data=true&offset=${offset}&limit=${limit}`);
    
    if (response.data && response.data.length) {
      this.allCompanies = [...this.allCompanies, ...response.data];

      // Fetch next batch of companies
      await this.fetchAllCompanies(offset + limit, limit);
    }
  },
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;

      // If the user has clicked next, fetch the next set of companies
      if ((this.pageOfItems[0] || {}).id > (this.companies[0] || {}).id) {
        this.nextPage();
      }
    },
    onChangeContactPage(pageOfContactItems) { // Add this method
      this.pageOfContactItems = pageOfContactItems;
    },
    showModal(company) {
      this.selectedCompany = company;
      this.showCompanyModal = true;
    },
    async addCompany() {
      try {
        await axios.post('http://localhost:5000/api/companies', this.newCompany);
        this.showAddCompanyModal = false;
        this.newCompany.name = '';
        // Fetch the updated companies list here, if necessary...
      } catch (error) {
        console.log(error);
      }
    },
    async fetchContactsByIds(ids) {
      const token = window.localStorage.getItem('authenticated'); // Get the saved JWT token
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; // Set the Authorization header
      const response = await axios.get("http://localhost:5000/api/contacts");
      // Assuming the response data is an array of contacts
      this.selectedContacts = response.data.flat().filter(contact => ids.includes(contact.id));
    },
    async showContactModal(company) {
      console.log("Opening contacts modal");
      // fetch contacts and other logic
      await this.fetchContactsByIds(company.contact_ids);
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

.prev{
  margin-right: 10px;
}
.next{
  margin-left: 10px;
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
