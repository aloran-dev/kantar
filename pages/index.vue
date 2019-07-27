<template>
  <v-container fluid>
    <v-toolbar
      flat
      color="white"
      class="mb-1"
    >
      <v-toolbar-title>Kantar Avance de proyectos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog
        v-model="dialog"
        max-width="500px"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            dark
            class="mb-2"
            v-on="on"
          >Actualizar reporte</v-btn>
        </template>

        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      v-model="editedItem.employee_name"
                      label="Nombre"
                      :rules="[
                        v => !!v || 'Este campo es requerido',
                        v => (/^[a-zA-Z]+$/.test(v)) || 'Tu nombre no debe contener numeros ni espacios',
                        v => (v && v.length <= 20) || 'Tu nombre no debe contener más de 20 caracteres',
                        v => (v && v.length >= 8) || 'Tu nombre debe contener más de 8 caracteres',
                      ]"
                      :counter="20"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="editedItem.employee_salary"
                      :rules="[
                        v => !!v || 'Este campo es requerido',
                        v => (/^[0-9]+([.][0-9]+)?/.test(v)) || 'Por favor ingresa solo numeros sin espacios',
                        v => (v && v <= 20000) || 'Tu salario no debe ser mayor a 20000',
                        v => (v && v >= 8000) || 'Tu salario debe ser mayor a 8000',
                      ]"
                      label="Salario"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="editedItem.employee_age"
                      :rules="[
                        v => !!v || 'Este campo es requerido',
                        v => (/^[0-9]+$/.test(v)) || 'Por favor ingresa solo numeros sin espacios',
                        v => (v && v <= 35) || 'Tu edad no puede ser mayor a 35',
                        v => (v && v >= 18) || 'Debes tener más de 18 años para continuar',
                      ]"
                      label="Edad"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              flat
              @click="close"
            >Cancelar</v-btn>
            <v-btn
              color="blue darken-1 white--text"
              @click="save"
              :disabled="!valid"
            >Guardar</v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="estudios"
      :search="search"
      flat
    >
      <template v-slot:items="props">
        <td>{{ props.item.nombre }}</td>
        <td>{{ props.item.fecha_ini }}</td>

        <td>

          <v-menu
            v-model="menu2"
            :close-on-content-click="true"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                class="caption"
                v-model="props.item.fecha_fin"
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="props.item.fecha_fin"
              @input="menu2 = false"
            ></v-date-picker>
          </v-menu>

        </td>

        <td>{{ props.item.efectivas }}</td>
        <td>{{ props.item.canceladas }}</td>
        <td>{{ props.item.completadas }}</td>
        <td>
          <v-icon>check</v-icon>
        </td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            cloud_download
          </v-icon>
        </td>
      </template>
    </v-data-table>

    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
    >
      {{ snackText }}
      <v-btn
        text
        flat
        dark
        @click="snack = false"
      >Close</v-btn>
    </v-snackbar>

  </v-container>
</template>

<script>
  import axios from 'axios'
  export default {
    async asyncData () {
      const { data } = await axios.get('http://172.30.27.40:8080/sialcom/system/reportes/kantar_dev/api/estudios/all.php')
      return {
        dialog: false,
        valid: false,
        search: '',
        // cabecera de tabla
        headers: [
          { text: 'Nombre del proyecto', value: 'nombre' },
          { text: 'Fecha de inicio', value: 'fecha_ini' },
          { text: 'Fecha de fin', value: 'fecha_fin' },
          { text: 'Efectivas', value: 'efectivas' },
          { text: 'Canceladas', value: 'canceladas' },
          { text: 'Completadas', value: 'completadas' },
          { text: 'Audios', value: 'audio' },
          { text: 'Acciones', value: 'name', sortable: false }
        ],
        estudios: data,
        // datos de empleado
        editedIndex: -1,
        editedItem: {
          'id': '',
          'Nombre del proyecto': '',
          'Fecha de inicio': '',
          'Fecha de fin': '',
          'Efectivas': '',
          'Canceladas': '',
          'Completadas': '',
        },
        defaultItem: {
          'id': '',
          'Nombre del proyecto': '',
          'Fecha de inicio': '',
          'Fecha de fin': '',
          'Efectivas': '',
          'Canceladas': '',
          'Completadas': ''
        },

        // snackbar
        snack: false,
        snackColor: '',
        snackText: '',
      }
    },
    computed: {
      // dependiendo de si existe el empleado en la lista se elige el titulo del modal
      formTitle () {
        return this.editedIndex === -1 ? 'Agregar nuevo empleado' : 'Editar empleado'
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    methods: {
      save () {
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Data saved'
      },
      cancel () {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = 'Canceled'
      },
      open () {
        this.snack = true
        this.snackColor = 'info'
        this.snackText = 'Dialog opened'
      },
    }
  }
</script>
