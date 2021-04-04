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
              <v-text-field :rules="nameRules" v-model="editedItem.nome" label="Nome"></v-text-field>
            </v-col>
            <v-col cols="12" sm="8">
              <v-text-field  :rules="emailRules" v-model="editedItem.email"  label="E-Mail"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field :rules="raRules" v-model="editedItem.ra" type="number" label="RA"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12">
              <v-text-field   :rules="cpfRules" v-model="editedItem.cpf" type="number" label="CPF"></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" text @click="showEditDialog(),loadItems()">Cancelar</v-btn>
          <v-btn color="blue" text @click="saveItem(editedItem)">Salvar</v-btn>
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
        {text: 'Nome', value: 'nome'},
        {text: 'E-mail', value: 'email', sortable: false, width: "100"},
        {text: 'RA', value: 'ra', name: 'ra', width: "100"},
        {text: 'CPF', value: 'cpf', name: 'cpf', width: "80"},
        {text: 'Ações', value: 'actions', sortable: false},
      ],
      items: [],
      dialog: false, // used to toggle the dialog
      editedItem: {}, // empty holder for create/update ops
      nameRules: [
        v => !!v || 'Nome é obrigatório',
      ],
      emailRules: [
        v => !!v || 'E-mail é Obrigatório',
        v => /.+@.+\..+/.test(v) || 'E-mail deve ser um email válido',
      ],
      cpfRules: [
        v => !!v || 'CPF é obrigatório',
        v => (v && v.length === 11) || 'Deve Conter 11 Caracteres',
      ],
      raRules: [
        v => !!v || 'RA é obrigatório'
      ]

    }
    ),
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
        axios.get(`http://localhost:3000/cad-alunos`)
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
          nome: item.nome,
          email: item.email,
          ra: item.ra,
          cpf: item.cpf
        }


        if (id) {
          // SE o id ja existe irá atualizar
          method = "put"
          url = `http://localhost:3000/cad-alunos/${id}`

          delete data.fields.id
        }

        axios[method](url, datapost).then((response) => {

          if (response.data && response.data.id) {
            // adicionado
            this.editedItem.id = response.data.id
            if (!id) {
              // Editando
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
        if (confirm('Tem certeza que quer deletar esse registro?')) {
          axios.delete(`http://localhost:3000/cad-alunos/${id}`).then((response) => {
            console.log(response);
            this.items.splice(idx, 1)
          })
        }
      },
    }
  }
</script>
