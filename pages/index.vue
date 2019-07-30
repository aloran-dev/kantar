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
              @click:date="updateItem(props.item)"
            ></v-date-picker>
          </v-menu>
        </td>
        <td>{{ props.item.efectivas }}</td>
        <td>{{ props.item.canceladas }}</td>
        <td>{{ props.item.completadas }}</td>
        <td>
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          > edit
          </v-icon>
          <v-icon
            small
            class="mr-2"
            @click="downloadItem(props.item)"
          > cloud_download
          </v-icon>
        </td>
      </template>
    </v-data-table>

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

    <!-- dialog -->
    <v-dialog
      v-model="dialog.status"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Editar parametros
        </v-card-title>

        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog.status = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="dialog.status = false"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
          { text: 'Acciones', value: 'name', sortable: false }
        ],

        // datos de empleado
        estudios: [],

        // datos de edicion
        editedIndex: -1,
        editedItem: {
          id: '',
          conexion: '',
          base: '',
          condicion_extra: '',
          nombre: '',
          fecha_ini: '',
          fecha_fin: '',
          efectivas: 0,
          canceladas: 0,
          completadas: 0
        },

        // snackbar
        snack: {
          status: false,
          colorolor: '',
          text: ''
        },

        // dialog
        dialog: {
          status: false,
        }
      }
    },

    mounted () {
      // TODO: falta agregar manejo de errores
      axios.get('http://172.30.27.40:8080/sialcom/system/reportes/kantar_dev/api/estudios/all.php')
        .then(res => {
          this.estudios = res.data
          this.loading = false;
        })
    },

    methods: {
      // TODO: falta agregar manejo de errores
      updateItem (item) {
        // inicia loader
        this.loading = true;

        // asigna el estudio que se quiere editar a un objeto
        this.editedIndex = this.estudios.indexOf(item)
        this.editedItem = Object.assign({}, item)

        // manda post a endpoint
        axios.post('http://172.30.27.40:8080/sialcom/system/reportes/kantar_dev/api/conteo/general.php', {
          "base": this.editedItem.base,
          "fecha_ini": this.editedItem.fecha_ini,
          "fecha_fin": this.editedItem.fecha_fin,
          "condicion_extra": this.editedItem.condicion_extra
        })
          .then(res => {
            this.editedItem.efectivas = res.data.efectivas || 0
            this.editedItem.canceladas = res.data.canceladas || 0
            this.editedItem.completadas = res.data.completadas || 0

            this.estudios.splice(this.editedIndex, 1, this.editedItem)

            this.loading = false

            this.snack.text = 'Conteo de proyecto actualizado'
            this.snack.color = 'info'
            this.snack.status = true
          })

      },

      editItem (item) {
        this.dialog.status = true

        this.snack.text = 'Editar item'
        this.snack.color = 'info'
        this.snack.status = true
      },

      downloadItem (item) {
        this.snack.text = 'Descargar Item'
        this.snack.color = 'info'
        this.snack.status = true
      }
    }
  }
</script>
