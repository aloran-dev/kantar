<template>
  <v-container fluid>

    <!-- data table head -->
    <v-toolbar
      flat
      color="white"
      class="mb-1"
    >
      <v-toolbar-title>Kantar Avance de proyectos</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        prepend-inner-icon="search"
        label="Search"
        single-line
        clearable
      ></v-text-field>
    </v-toolbar>

    <!-- data table -->
    <v-data-table
      :headers="headers"
      :items="estudios"
      :search="search"
      :loading="loading"
      loading-text="Cargando datos... espere un momento"
      :items-per-page="-1"
      flat
    >
      <template v-slot:items="props">
        <td>{{ props.item.nombre }}</td>
        <td>{{ props.item.fecha_ini }}</td>
        <td>
          <v-menu
            v-model="menu"
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
              @input="menu = false"
              @click:date="open()"
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
          > edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          > cloud_download
          </v-icon>
        </td>
      </template>
    </v-data-table>

    <!-- snackbar -->
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

    data () {
      return {
        search: '',
        loading: true,

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

        // datos de empleado
        estudios: [],

        // modal data
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

    mounted () {
      axios.get('http://172.30.27.40:8080/sialcom/system/reportes/kantar_dev/api/estudios/all.php')
        .then(res => {
          this.estudios = res.data
          this.loading = false;
        })
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
