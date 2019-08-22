<template>
  <div style="width: 400px;">
    <v-toolbar
      color="primary"
      dark
      flat
      class="px-2 py-3"
    >
      <v-toolbar-title>
        <img
          src="/img/kantar_logo-dark.png"
          alt="Kantar logo"
          class="logo"
        />
        <h2 class="subheading">Gestión de avance de proyectos</h2>
      </v-toolbar-title>
    </v-toolbar>

    <v-card
      class="px-3 py-3"
      elevation="5"
      style="width: 100%"
    >
      <v-card-text class="py-0">
        <v-form
          ref="form"
          v-model="valid"
          @submit.prevent="validate"
        >
          <v-text-field
            v-model="user"
            :rules="userRules"
            label="Nombre de usuario"
            prepend-icon="person"
            required
          ></v-text-field>

          <v-text-field
            v-model="pass"
            :append-icon="show1 ? 'visibility' : 'visibility_off'"
            :type="show1 ? 'text' : 'password'"
            :rules="passRules"
            label="Contraseña"
            prepend-icon="lock"
            @click:append="show1 = !show1"
            required
          ></v-text-field>

          <v-card-actions class="mt-3 px-0">
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid"
              :loading="loading"
              color="primary"
              type="submit"
            >
              Iniciar sesión
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- snackbar -->
    <v-snackbar
      v-model="snack.status"
      :color="snack.color"
      :timeout="3000"
      top
    >
      {{ snack.text }}
      <v-btn
        text
        flat
        dark
        @click="snack.status = false"
      >Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    layout: 'login',

    data: () => ({
      valid: true,
      loading: false,
      show1: false,

      // rules and input
      user: '',
      userRules: [v => !!v || 'El nombre de usuario es requerido'],
      pass: '',
      passRules: [v => !!v || 'La contraseña es requerida'],

      // snackbar
      snack: {
        status: false,
        color: '',
        text: '',
      },
    }),

    beforeMount () {
      if (localStorage.getItem('key')) this.$router.push('/avance');
    },

    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.loading = true;
          this.valid = false;

          axios
            .post(
              `${this.$axios.defaults.baseURL}consultausuarios/revisar_usuarios.php`,
              {
                usuario_name: this.user,
                pass_name: this.pass,
              },
            )
            .then(res => {
              console.log(res.data);
              this.loading = false;

              if (res.data.msg === 'ok') {
                localStorage.setItem('key', res.data.key);
                this.$router.push('/avance');
              } else {
                this.snack.text =
                  'Error al inciar sesión, por favor comprueba tus datos';
                this.snack.color = 'Error';
                this.snack.status = true;
                this.$refs.form.reset();
              }
            });
        }
      },
    },
  };
</script>

<style lang="scss">
.logo {
  height: 30px;
  object-fit: contain;
}
</style>
