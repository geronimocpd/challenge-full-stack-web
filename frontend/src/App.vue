<template>
  <v-app>
    <v-app-bar
        app
        color="primary"
        dark
    >
      <div class="d-flex align-center">

        <v-img
            alt="Vuetify Name"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            min-width="100"
            :src="myImage"
            width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
          href="https://www.grupoa.com.br/"
          target="_blank"
          text
      >
        <span class="mr-2">Saiba Mais</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <CadastroAlunos/>
    </v-main>
  </v-app>


</template>

<script>
import CadastroAlunos from './components/CadastroAlunos';

export default {
  name: 'App',

  components: {
    CadastroAlunos,
  },

  data: () => ({
    myImage: require('./assets/grupoa.png')
  }),
};
</script>
