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
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.fecha_ini"
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <v-text-field
              v-model="props.item.fecha_ini"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <template v-slot:input>
              <v-date-picker
                v-model="props.item.fecha_ini"
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="close"
                >Cancel</v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="save"
                >OK</v-btn>
              </v-date-picker>
            </template>
          </v-edit-dialog>
        </td>
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.fecha_fin"
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          > {{ props.item.fecha_fin }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.fecha_fin"
                label="Editar"
                single-line
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </td>
        <td>{{ props.item.completadas }}</td>
        <td>{{ props.item.canceladas }}</td>
        <td>{{ props.item.efectivas }}</td>
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
      const { data } = await axios.get('https://github.com/CriticalGeek/gestion_empleados/blob/master/pages/index.vue')
      return {
        dialog: false,
        valid: false,
        search: '',
        // cabecera de tabla
        headers: [
          { text: 'Nombre del proyecto', value: 'nombre' },
          { text: 'Fecha de inicio', value: 'fecha_ini' },
          { text: 'Fecha de fin', value: 'fecha_fin' },
          { text: 'Completadas', value: 'completadas' },
          { text: 'Canceladas', value: 'canceladas' },
          { text: 'Efectivas', value: 'efectivas' },
          { text: 'Audios', value: 'audio' },
          { text: 'Acciones', value: 'name', sortable: false }
        ],
        estudios: [
          {
            "id": "1",
            "nombre": "208107381_SatisfaccionCompetencia",
            "fecha_ini": "2019-04-03",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "Q130_PCLASIFICACION_1 != '' and \n( \n    audio = 'si' || \n    agente not in( \n        410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,\n        2243,2262,2314,2436,2451,2648,2659,2664,2695,2722,\n        2741,2871,2890,2898,2980,3064,3325,3407,3472,3505,\n        3651,3669,3682,3691,3697,3710,3733,3747,3795,3842,\n        3865,3901,3902,3910,4065,4265,4266,4314,4319,4338,\n        4256 \n    ) \n) and \n(st != \"cancelada\" || st is null) and \na.id not in (\n\t\tselect id from competencias.bdv where fechabo >= curdate() and st = \"cancelada\"\n        ) and \na.id not in ( \n    12094,5131,6695,12204,285,11990,12177,13954,9546,11359,\n    15100,13318,9891,6582,2085,6201,5180,5140,12239,13619,\n    5138,11748,12264,4656,8702,5212,10741,10715,14340,7231,\n    2517,14265,4652,2200,3540,7608\n    )"
          },
          {
            "id": "2",
            "nombre": "208107284_Competencia_Empresarial",
            "fecha_ini": "2019-05-21",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "Q067_AUTO_AUTOR_1 != \"\" and \n(\n    audio = 'si' || \n    agente not in (\n        410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,2243,2262,2314,2436,2451,2648,2659,2664,2695,2722,\n\t    2741,2871,2890,2898,2980,3064,3325,3407,3472,3505,3651,3669,3682,3691,3697,3710,3733,3747,3795,3842,3865,3901,3902,\n    \t3910,4065,4265,4266,4314,4319,4338,4256\n    )\n) and \n(st != \"cancelada\" || st is null) and \nsegmento = \"Empresarial\" "
          },
          {
            "id": "3",
            "nombre": "208107286_Competencia_Comercial",
            "fecha_ini": "2019-05-21",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "Q067_AUTO_AUTOR_1 != \"\" and\n(\n\taudio = 'si' || \n\tagente not in(\n\t\t\t410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,2243,2262,2314,2436,2451,2648,2659,2664,2695,2722,\n\t\t\t2741,2871,2890,2898,2980,3064,3325,3407,3472,3505,3651,3669,3682,3691,3697,3710,3733,3747,3795,3842,\n\t\t\t3865,3901,3902,3910,4065,4265,4266,4314,4319,4338,4256\n\t\t\t)\n) and \n(st != \"cancelada\" || st is null) and \nsegmento = \"Comercial\""
          },
          {
            "id": "5",
            "nombre": "208107382_SatisfaccionPlay",
            "fecha_ini": "2019-03-11",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "Q124_PCLASIFICACION_1 != \"\" and \n(st is null || st != \"cancelada\") and \n( \n    audio = \"si\" or \n    agente not in ( \n        410,411,412,1642,1679,1823,1946,1961,1980,2237,2243,2262,2314,2436,2451,\n        2648,2664,2695,2722,2741,2871,2890,2898,2980,3064,3325,3472,3505,3651,\n        3669,3682,3691,3697,3710,3733,3747,3795,3842,3865,3901,3902,3910,4065,\n        4265,4266,4314,4319,4338 \n    ) \n) and \na.id not in(\n    24290,20250,20279,20335,20373,20384,20515,20873,20950,20961,20991,21035,21113,\n    21139,21503,22561,22860,23514,24955,25039,26788,28214,29549,30067,31465,31595,\n    32166,32175,32321,32327,32402,32474,32846,33156,34231,35059,35174,35518,36109,\n    36202,36267,36517,36914,37334,37364,37423,37434,37793,37859,38192,38203,38450,\n    38702,38994,39003,39134,39364,39599,39872,40003,40102,40172,40701,40996,41142,\n    41173,41263,41308,41330,41341,41495,41589,41655,41665,41868,41873,42270,42924,\n    42957,43283,43390,43841,43945,44217,44443,44773,45672,45832,46992,47840,47910,\n    48606,48887,49210,49536,51505,51957,52460,52634,53130,53319,53327,53351,53353,\n    53369,53373,53416,53782,53990,54017,54195,54452,54460,54461,54634,54838,54867,\n    54916,55257,55511,55703,55830,55911,55932,55996,56103,56147,56214,56345,56352,\n    56433,56569,56666,56950,57098,57156,57208,57522,57619,57988,57992,58007,58016,\n    58030,58100,58103,58173,58244,58331,58334,58348,58639,58853,58975,59030,59080,\n    59090,59280,59576,59943,59957,59995,60066,60234,60347,60516,60533,60559,60563,\n    60613,60679,60709,60938,61024,61112,61132,61314,61645,61798,61878,61936,62030,\n    62034,62209,62236,62242,62267,62348,62550,62774,62788,62815,63030,63103,63128,\n    63145,63413,63667,63704,63724,63776,63867,63967,64000,64081,64224,64470,64847,\n    64851,64951,64958,65149,65404,65555,65597,65911,65958,66661,66691,67047,67076,\n    67105,67153,67156,67322,67385,67413,67605,67613,67636,67743,68154,68242,68282,\n    68318,68320,68352,68364,68426,68449,68796,68897,69092,69554,69561,69616,69643,\n    69758,69916,70016,70023,70151,70221,70366,70407,70601,70908,71031,71042,71079\n)\n\tand a.id not in (\n\t\tselect id\n\tfrom\n\t\tcati_test.bdv\n\twhere\n\t\tfechabo > curdate()-1\n\t\tand st = \"cancelada\")"
          },
          {
            "id": "6",
            "nombre": "208107397_Grandes_2019",
            "fecha_ini": "2019-06-17",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "a.Q078_PA2_Gasto_mens_1 != '' and \n(\n    audio = 'si' or\n    agente not in(\n        410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,2243,2262,2314,2436,2451,2648,2659,2664,2695,2722,\n        2741,2871,2890,2898,2980,3064,3325,3407,3472,3505,3651,3669,3682,3691,3697,3710,3733,3747,3795,3842,3865,\n        3901,3902,3910,4065,4265,4266,4314,4319,4338,4256\n    )\n) and \n(st != \"cancelada\" || st is null)"
          },
          {
            "id": "7",
            "nombre": "208107398_Micros_2019",
            "fecha_ini": "2019-05-27",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "a.Q079_PA2_Gasto_mens_1 != '' and \n(\n    audio = 'si' or \n    a.agente not in (\n        410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,2243,2262,2314,2436,2451,2648,2659,2664,2695,2722,\n        2741,2871,2890,2898,2980,3064,3325,3407,3472,3505,3651,3669,3682,3691,3697,3710,3733,3747,3795,3842,\n        3865,3901,3902,3910,4065,4265,4266,4314,4319,4338,4256\n    )\n) and \na.id not in (\n    1036\n) and \n(st != \"cancelada\" || st is null) "
          },
          {
            "id": "8",
            "nombre": "208107399_Medianas_2019",
            "fecha_ini": "2019-05-28",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "a.Q079_PA2_Gasto_mens_1!= \"\"  \nand (a.st  !=\"cancelada\" || a.st is null) and a.audio =\"si\"\nAND  a.id not in (select id from edc_empresas_medianas.bdv where fechabo >= date_add(curdate(), interval 1 day)  and  st = \"CANCELADA\")\nAND a.agente NOT IN (\n\t410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,2243,2262,2314,2436,2451,2648,2659,2664,2695,2722,\n\t2741,2871,2890,2898,2980,3064,3325,3407,3472,3505,3651,3669,3682,3691,3697,3710,3733,3747,3795,3842,3865,3901,3902,\n\t3910,4065,4265,4266,4314,4319,4338,4256\n) "
          },
          {
            "id": "9",
            "nombre": "208107493_FTTH",
            "fecha_ini": "2019-05-21",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "Q017_Q017_P7_1 != '' and \n(st != \"cancelada\" || st is null) and \n(\n\taudio = 'si' || \n\tagente not in (\n\t\t410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,2243,2262,2314,2436,2451,2648,2659,2664,2695,2722,\n\t\t2741,2871,2890,2898,2980,3064,3325,3407,3472,3505,3651,3669,3682,3691,3697,3710,3733,3747,3795,3842,\n\t\t3865,3901,3902,3910,4065,4265,4266,4314,4319,4338\n\t)\n)"
          },
          {
            "id": "10",
            "nombre": "208107494_General_Masivo",
            "fecha_ini": "2019-05-21",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "Q075_Q075_P71_1 != '' and \n  (st != \"cancelada\" || st is null) and \n  (\n  \tagente not in(\n  \t\t410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,2243,\n  \t\t2262,2314,2436,2451,2648,2659,2664,2695,2722,2741,2871,\n  \t\t2890,2898,2980,3064,3325,3407,3472,3505,3651,3669,3682,\n  \t\t3691,3697,3710,3733,3747,3795,3842,3865,3901,3902,3910,\n  \t\t4065,4265,4266,4314,4319,4338,4256\n  \t\t) || \n  \t\taudio =\"si\" \n  \t)"
          },
          {
            "id": "11",
            "nombre": "208107495_Reparaciones",
            "fecha_ini": "2019-05-23",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "Q044_Q047_PClasif_1 != '' and \n(st != \"cancelada\" || st is null) and\n(\n\taudio = 'si' || \n\tagente not in(\n\t\t410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,2243,2262,2314,2436,2451,2648,2659,2664,2695,2722,\n\t\t2741,2871,2890,2898,2980,3064,3325,3407,3472,3505,3651,3669,3682,3691,3697,3710,3733,3747,3795,3842,\n\t\t3865,3901,3902,3910,4065,4265,4266,4314,4319,4338,4256\n\t) \n)"
          },
          {
            "id": "12",
            "nombre": "208107496_Instalaciones",
            "fecha_ini": "2019-05-25",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "Q047_Q047_PClasif_1 != '' and\n(\n\taudio = 'si' || \n\tagente not  in(\n\t\t410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,2243,2262,2314,2436,2451,2648,2659,2664,2695,2722,\n\t\t2741,2871,2890,2898,2980,3064,3325,3407,3472,3505,3651,3669,3682,3691,3697,3710,3733,3747,3795,3842,\n\t\t3865,3901,3902,3910,4065,4265,4266,4314,4319,4338,4256\n\t) \n)  and\n(st != \"cancelada\" || st is null)"
          },
          {
            "id": "13",
            "nombre": "208107497_Teleatencion",
            "fecha_ini": "2019-05-21",
            "fecha_fin": "2019-07-18",
            "condicion_extra": "(\n\t(a.Q030_Q030_PClasif_1!= \"\" and b.TIPO_SUS=1) or \n\t(a.Q039_Q049_PNOMBRE_1!=\"\" and b.TIPO_SUS=2)\n) and \n(\n\taudio = \"si\" or     \n\tagente not in (\n\t\t410,411,412,1642,1675,1679,1823,1946,1961,1980,2237,2243,2262,2314,2436,2451,2648,2659,2664,2695,2722,\n\t\t2741,2871,2890,2898,2980,3064,3325,3407,3472,3505,3651,3669,3682,3691,3697,3710,3733,3747,3795,3842,\n\t\t3865,3901,3902,3910,4065,4265,4266,4314,4319,4338,4256\n\t) \n) and \n(st != \"cancelada\" || st is null) "
          }
        ],
        // datos de empleado
        editedIndex: -1,
        editedItem: {
          'id': '',
          'Nombre del proyecto': '',
          'Fecha de inicio': '',
          'Fecha de fin': '',
          'Completadas': '',
          'Canceladas': '',
          'Efectivas': ''
        },
        defaultItem: {
          'id': '',
          'Nombre del proyecto': '',
          'Fecha de inicio': '',
          'Fecha de fin': '',
          'Completadas': '',
          'Canceladas': '',
          'Efectivas': ''
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
