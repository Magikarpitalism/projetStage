<template>
    <div class="main-container">
      <Widget>
        <template slot="title">Contacts</template>
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
            <tr v-for="(contact, index) in pageOfItems" :key="index" @click="showModal(contact)">
              <td>{{ contact.name }}</td>
              <td>{{ contact.email }}</td>
              <td>{{ contact.address_id }}</td>
              <td>{{ contact.phone }}</td>
              <td> <!-- Add the actions here -->
                <b-button variant="primary" class="mr-2" @click.stop="modifyContact(company)">mod</b-button>  <!-- class="mr-2" is the bootsrap class that give some margin right -->
                <b-button variant="danger" @click.stop="deleteCompany(company)">del</b-button>
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
        <jw-pagination :items="contacts" :pageSize="10" @changePage="onChangePage"></jw-pagination>
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
        companies: [], // New data variable for companies
        pageOfItems: [],
        pageOfCompanyItems: [],
        selectedContact: {},
        showContactModal: false,
        showAddContactModal: false,
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
    methods: {
      async fetchContacts() {
        const token = window.localStorage.getItem('authenticated'); // Get the saved JWT token
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; // Set the Authorization header
        const response = await axios.get("http://localhost:5000/api/contacts?with_data=true&offset=0&limit=500000000000000000000000000000000");
        console.log(response.data); // Log the data here
        this.contacts = response.data;
      },
      // New method for fetching companies data
      async fetchCompanies() {
        const token = window.localStorage.getItem('authenticated'); // Get the saved JWT token
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token; // Set the Authorization header
        const response = await axios.get("http://localhost:5000/api/companies");
        console.log(response.data);
        this.companies = response.data; // Adjust this line if the structure of the response data is different
      },
      onChangePage(pageOfItems) {
        this.pageOfItems = pageOfItems;
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
      this.fetchContacts();
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
  
  .details-container {
    color: white;
    display: flex;
    justify-content: space-between;
    width: 70%; 
    margin: auto; 
  }
  
  .details-left, .details-right {
    display: flex;
    flex-direction: column;
    margin-bottom: 40px; /* Add space at the bottom of each item */
  }
  
  .details-left p, .details-right p {
    margin-bottom: 40px; /* Add space between data points */
  }
  </style>