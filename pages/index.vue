<template>
  <div style="width: 400px;">
    <v-toolbar
      color="primary"
      dark
      flat
      class="px-2 py-3"
    >
      <v-toolbar-title>
        <h1 class="header">KANTAR</h1>
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
          lazy-validation
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
            :rules="passRules"
            :type="'password'"
            label="Contraseña"
            prepend-icon="lock"
            required
          ></v-text-field>

          <v-card-actions class="mt-3 px-0">
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!valid"
              :loading="loading"
              color="primary"
              @click="validate"
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
  import axios from 'axios'

  export default {
    layout: 'login',

    data: () => ({
      valid: true,
      loading: false,

      // rules and input
      user: '',
      userRules: [
        v => !!v || 'El nombre de usuario es requerido'
      ],
      pass: '',
      passRules: [
        v => !!v || 'La contraseña es requerida'
      ],

      // snackbar
      snack: {
        status: false,
        color: '',
        text: ''
      },
    }),

    beforeMount () {
      if (localStorage.getItem('key')) this.$router.push('/avance')
    },

    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.loading = true
          this.valid = false

          axios.post('http://172.30.27.40:8080/sialcom/system/reportes/kantar_dev/api/consultausuarios/revisar_usuarios.php', {
            "usuario_name": this.user,
            "pass_name": this.pass
          })
            .then(res => {
              console.log(res.data)
              this.loading = false

              if (res.data.msg === 'ok') {
                localStorage.setItem('key', res.data.key)
                this.$router.push('/avance')
              } else {
                this.snack.text = "Error al inciar sesión, por favor comprueba tus datos"
                this.snack.color = "Error"
                this.snack.status = true
                this.$refs.form.reset()
              }
            })
        }
      },

      sesion () {
        axios.post('http://172.30.27.40:8080/sialcom/system/reportes/kantar_dev/api/consultausuarios/verificar_sesion.php', {}, {
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        })
          .then(res => {
            console.log(res.data)
          })
      }
    }
  }
</script>
