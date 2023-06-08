<template>
    <div class="main-container">
      <Widget>
        <template slot="title">Contacts</template>
        <b-form-input v-model="search" @keyup.enter="applySearch" type="text" placeholder="Search" />
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
            <tr v-for="(contact, index) in filteredContacts" :key="index" @click="showModal(contact)">
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
  import axios from 'axios';
  import Widget from '@/components/Widget/Widget';
  import JwPagination from 'jw-vue-pagination';
  import Modal from '@/components/modal';
  import { BModal, BButton } from 'bootstrap-vue'
  
  export default {
    name: 'Contacts',
    components: { Widget, Modal, BModal, BButton, JwPagination},
    data() {
      return {
        contacts: [],
        allContacts: [],
        companies: [], // New data variable for companies
        pageOfItems: [],
        pageOfCompanyItems: [],
        selectedContact: {},
        showContactModal: false,
        showAddContactModal: false,
        currentOffset: 0,
        limit: 10,
        limitOptions: [10, 20, 50],
        search: '',
        searchQuery: '',
        itemsPerPage: 10,
        currentPage: 1, 
        relatedCompanies: [], // New data variable for related companies
        newContact: { // New
          name: ''
          // Add more fields as necessary...
        },
        showModifyContactModal: false,
          modifiedContact: {
            name: '',
            email: '',
            address_id: '',
            phone: ''
          }
      };
    },
    computed: {
    totalPages() {
      return Math.ceil(14981 / this.limit);
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
  filteredContacts() {
    if (!this.searchQuery) return this.allContacts.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);

    const filtered = this.allContacts.filter(contact => 
      Object.values(contact).some(value => 
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );

    return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  },

  filteredContactsCount() {
    if (!this.searchQuery) return this.allContacts.length;

    return this.allContacts.filter(contact => 
      Object.values(contact).some(value => 
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    ).length;
  },

  totalPageCount() {
    return Math.ceil(this.filteredContactsCount / this.itemsPerPage);
  }
},
    methods: {
      async fetchContacts(offset, limit) {
        const token = window.localStorage.getItem('authenticated'); 
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; 
        const response = await axios.get(`http://localhost:5000/api/contacts?with_data=true&offset=${offset}&limit=${limit}`);
        console.log(response.data);
        this.contacts = response.data;

        //update pageOfItems directly when companies are fetched:
        this.pageOfItems = this.contacts;
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
      async fetchAllContacts(offset = 0, limit = 200) {
      const token = window.localStorage.getItem('authenticated'); 
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; 

      const response = await axios.get(`http://localhost:5000/api/contacts?with_data=true&offset=${offset}&limit=${limit}`);
      
      if (response.data && response.data.length) {
        this.allContacts = [...this.allContacts, ...response.data];

        // Fetch next batch of companies
        await this.fetchAllContacts(offset + limit, limit);
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
      // New method for fetching companies data
      async fetchCompanies() {
        const token = window.localStorage.getItem('authenticated'); // Get the saved JWT token
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; // Set the Authorization header
        const response = await axios.get("http://localhost:5000/api/companies");
        console.log(response.data);
        this.companies = response.data; // Adjust this line if the structure of the response data is different
      },
      onChangeCompPage(pageOfCompanyItems) {
        this.pageOfCompanyItems  = pageOfCompanyItems ;
      },
      async showModal(contact) {
        this.selectedContact = contact;
        await this.fetchCompanies(); // Fetch companies data when modal is shown
        // Filter companies by checking if the selected contact's id is in the company's contact_ids
        this.relatedCompanies = this.companies.filter(company => company.contact_ids && company.contact_ids.includes(contact.id));
        this.showContactModal = true;
      },
      modifyContact(contact) { 
        this.modifiedContact = Object.assign({}, contact); // copy the contact data to prevent mutating the original
        this.showModifyContactModal = true;
      },
      async updateContact() {
        try {
          await axios.put(`http://localhost:5000/api/contacts/${this.modifiedContact.id}`, this.modifiedContact);
          let index = this.contacts.findIndex(c => c.id === this.modifiedContact.id);
          if (index !== -1) {
            this.contacts[index] = Object.assign({}, this.modifiedContact);
          }
          this.showModifyContactModal = false;
        } catch (error) {
          console.log(error);
        }
      },
      async deleteContact(contact) {
        // Confirm with the user that they want to delete the company
        if (confirm(`Are you sure you want to delete ${contact.name}? This action cannot be undone.`)) {
          // If they confirm, send a DELETE request to the server with the company's id
          try {
            await axios.delete(`http://localhost:5000/api/contacts/${contact.id}`);
            // After successfully deleting the company, remove it from the companies array
            this.contacts = this.contacts.filter(c => c.id !== contact.id);
          } catch (error) {
            // Handle the error...
            console.error(error);
          }
        }
      },
      async addContact() { // New method
        try {
          await axios.post('http://localhost:5000/api/contacts', this.newContact);
          this.showAddContactModal = false;
          this.newContact.name = '';
          this.fetchContacts();
          // Fetch the updated contacts list here, if necessary...
        } catch (error) {
          console.log(error);
        }
      },
    },
    created() {
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