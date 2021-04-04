<template>

  <v-container>
    <v-dialog v-model="dialog">
      <template v-slot:activator="{ on }">
        <div class="d-flex" style="margin: 10px;">

          <v-col cols="8" sm="8">
            <v-text-field  v-model="find" v-on:keypress="findItems(find)" value=""  label="Pesquisar Aluno"></v-text-field>
          </v-col>

          <v-col cols="4" sm="4">
            <v-btn style="float: left" color="primary" dark v-on="on">
              Cadastrar Aluno
            </v-btn></v-col>
        </div>
      </template>
      <v-card>
        <v-card-title>
          <span v-if="editedItem.id">Edit {{editedItem.id}}</span>
          <span v-else>Create</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
            </v-col>
            <v-col cols="12" sm="8">
              <v-text-field v-model="editedItem.released_year" type="number" label="Released"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field v-model="editedItem.pypl_rank" type="number" label="pypl_rank"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field v-model="editedItem.githut_rank" type="number" label="GIT"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field v-model="editedItem.tiobe_rank" type="number" label="Tiobe"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="showEditDialog(),loadItems()">Cancel</v-btn>
          <v-btn color="blue" text @click="saveItem(editedItem)">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
      <v-data-table
          :headers="headers"
          :items="items">
        <template v-slot:item.actions="{ item }">
          <div class="text-truncate">
            <v-icon
                class="mr-2"
                @click="showEditDialog(item)"
                color="primary"
            >
              mdi-pencil
            </v-icon>
            <v-icon
                @click="deleteItem(item)"
                color="pink"
            >
              mdi-delete
            </v-icon>
          </div>
        </template>
      </v-data-table>

    </v-card>
  </v-container>
</template>

<script>

import axios from 'axios';

  export default {
    name: 'CadastroAlunos',

    data: () => ({
      headers: [
        {text: 'Id', value: 'id'},
        {text: 'Nome', value: 'name'},
        {text: 'E-mail', value: 'email', sortable: false, width: "100"},
        {text: 'RA', value: 'ra', name: 'ra', width: "100"},
        {text: 'CPF', value: 'cpf', name: 'cpf', width: "80"},
        {text: 'Action', value: 'actions', sortable: false},
      ],
      items: [],
      dialog: false, // used to toggle the dialog
      editedItem: {}, // empty holder for create/update ops
    }),
    mounted() {
      this.loadItems()

    },
    methods: {
      showEditDialog(item) {
        this.editedItem = item || {}
        this.dialog = !this.dialog
      },
      loadItems() {
        this.items = [];
        axios.get(`http://localhost:3000/programming-languages`)
            .then((response) => {
              this.items = response.data.data;
            }).catch((error) => {
          console.log(error)
        })
      },
      findItems(searchForm) {
        if (searchForm.length < 1) {
          this.items = [];
          axios.get(`http://localhost:3000/cad-alunos`)
              .then((response) => {
                this.items = response.data.data;
              }).catch((error) => {
            console.log(error)
          })

        } else {

          let variavel = '/find/' + searchForm;

          console.log(variavel);

          //console.log(${find}};
          this.items = [];
          axios.get(`http://localhost:3000/cad-alunos` + variavel)
              .then((response) => {
                this.items = response.data.data;
              }).catch((error) => {
            console.log(error)
          })

        }
      },
      saveItem(item) {

        let method = "post"
        let url = `http://localhost:3000/cad-alunos`
        let id = item.id

        let data = {
          fields: item
        }

        let datapost = {
          name: item.name,
          released_year: item.released_year,
          githut_rank: item.githut_rank,
          pypl_rank: item.pypl_rank,
          tiobe_rank: item.tiobe_rank,
        }


        if (id) {
          // SE o id ja existe irá atualizar
          method = "put"
          url = `http://localhost:3000/cad-alunos/${id}`

          delete data.fields.id
        }

        console.log(datapost);

        axios[method](url, datapost).then((response) => {


          if (response.data && response.data.id) {
            // add new item to state
            this.editedItem.id = response.data.id
            if (!id) {
              // add the new item to items state
              this.items.push(this.editedItem)
            }
            this.editedItem = {}
          }
          this.dialog = !this.dialog
        })
      },
      deleteItem(item) {
        let id = item.id
        let idx = this.items.findIndex(item => item.id === id)
        if (confirm('Are you sure you want to delete this?')) {
          axios.delete(`http://localhost:3000/cad-alunos/${id}`).then((response) => {
            console.log(response);
            this.items.splice(idx, 1)
          })
        }
      },
    }
  }
</script>
