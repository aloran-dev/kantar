<template>
  <v-container fluid>

    <!-- data table head -->
    <v-toolbar
      flat
      color="white"
      class="mb-1"
    >
      <v-toolbar-title>AVANCE DE PROYECTOS</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        prepend-inner-icon="search"
        label="Buscar"
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
      loading-text="Cargando datos, espere un momento..."
      :rows-per-page-items="rowOptions"
      flat
    >
      <template v-slot:no-data>
        <p class="text-xs-center">Cargando datos, por favor espera...</p>
      </template>

      <template v-slot:no-results>
        <v-alert
          :value="true"
          type="info"
        >
          Tu busqueda no coincide con ningun resultado
        </v-alert>
      </template>

      <template v-slot:items="props">
        <td>{{ props.item.carpeta.replace(/^[0-9]+\s/, '') }}</td>
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
                style="width: 120px;"
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
        <td class="text-xs-right">{{ props.item.efectivas }}</td>
        <td class="text-xs-right">{{ props.item.canceladas }}</td>
        <td class="text-xs-right">{{ props.item.completadas }}</td>
        <td class="text-xs-center">
          <v-checkbox
            style="display: inline-block"
            v-model="props.item.generar_base"
            primary
            hide-details
          ></v-checkbox>
        </td>
        <td class="text-xs-center">
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

          <v-textarea
            label="Parametros"
            v-model="editedItem.condicion_extra"
            auto-grow
            box
          ></v-textarea>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialogClose()"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="dialogSave()"
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

        rowOptions: [
          5,
          15,
          25,
          { text: "Todos", value: -1 }
        ],

        // cabecera de tabla
        headers: [
          { text: 'Nombre del proyecto', value: 'carpeta' },
          { text: 'Fecha de inicio', value: 'fecha_ini' },
          { text: 'Fecha de fin', value: 'fecha_fin' },
          { text: 'Efectivas', value: 'efectivas' },
          { text: 'Canceladas', value: 'canceladas' },
          { text: 'Completadas', value: 'completadas' },
          { text: 'Generar base', value: 'generar_base', sortable: false },
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
          carpeta: '',
          condicion_extra: '',
          nombre: '',
          fecha_ini: '',
          fecha_fin: '',
          efectivas: 0,
          canceladas: 0,
          completadas: 0,
          generar_base: false
        },

        // snackbar
        snack: {
          status: false,
          color: '',
          text: ''
        },

        // dialog
        dialog: {
          status: false
        }
      }
    },

    beforeMount () {
      if (!localStorage.getItem('key')) this.$router.push('/')
    },

    mounted () {
      // TODO: falta agregar manejo de errores
      axios.get('http://172.30.27.40:8080/sialcom/system/reportes/kantar_dev/api/estudios/all.php')
        .then(res => {
          this.estudios = res.data
          this.loading = false;
        })
    },

    // TODO: falta agregar manejo de errores
    methods: {
      // Se ejecuta cuando se cambia la fecha
      updateItem (item) {
        // inicia loader
        this.loading = true;

        // asigna el estudio que se quiere editar a un objeto
        this.editedIndex = this.estudios.indexOf(item)
        this.editedItem = Object.assign({}, item)

        this.conteo()
      },

      conteo () {
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

      downloadItem (item) {
        // asigna el estudio que se quiere editar a un objeto
        this.editedIndex = this.estudios.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.editedItem.generar_base = (item.generar_base === true) ? true : false;

        axios.post('http://172.30.27.40:8080/sialcom/system/reportes/kantar_dev/api/generar/csv.php', {
          "id": this.editedItem.id,
          "generar_base": this.editedItem.generar_base,
          "fecha_ini": this.editedItem.fecha_ini,
          "fecha_fin": this.editedItem.fecha_fin,
        })
          .then(res => {
            this.snack.text = 'Archivos generados con exito'
            this.snack.color = 'info'
            this.snack.status = true
          })
      }
    }
  }
</script>
