<template>
  <v-app style="background: #eee;">
    <v-card
      flat
      color="transparent"
    >

      <!-- background toolbar -->
      <v-toolbar
        color="primary"
        dark
        extended
        flat
        extensionHeight="150"
      >
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title class="toolbar-title">
          <img
            src="/img/kantar_logo-dark.png"
            alt="Kantar logo"
            class="toolbar-title__logo"
            gradient="to top, rgba(0,0,0,.44), rgba(0,0,0,.44)"
          >
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn
            @click="logout()"
            flat
          >
            Cerrar Sesión
            <v-icon class="ml-2">exit_to_app</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div class="accent toolbar-accent"></div>

      <!-- card -->
      <v-card
        class="mx-auto elevation-3"
        max-width="1300"
        style="margin-top: -110px; margin-bottom: 50px;"
      >
        <nuxt />
      </v-card>
    </v-card>

    <v-navigation-drawer
      v-model="drawer"
      class="primary"
      absolute
      dark
      temporary
    >
      <v-list class="pa-0">
        <v-card>
          <v-img
            class="white--text"
            height="200px"
            src="/img/background.jpg"
          >
            <v-container
              fill-height
              fluid
            >
              <v-layout fill-height>
                <v-flex
                  xs12
                  align-end
                  flexbox
                >
                  <v-list-tile
                    avatar
                    tag="div"
                  >
                    <v-list-tile-avatar>
                      <img src="https://randomuser.me/api/portraits/men/85.jpg">
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title class="font-weight-black">Nombre de usuario</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-flex>
              </v-layout>
            </v-container>
          </v-img>
        </v-card>
      </v-list>

      <v-list class="pt-0">
        <v-divider light></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click=""
        >
          <v-list-tile-action style="min-width: 24px; margin-right: 16px;">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: null,
        items: [
          { title: 'Avance de Proyectos', icon: 'bar_chart' }
        ],
        right: null
      }
    },

    methods: {
      logout () {
        localStorage.removeItem('key')
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="scss">
.toolbar-title {
  display: flex;
  align-items: center;

  &__logo {
    height: 30px;
    object-fit: contain;
  }
}

.toolbar-accent {
  width: 100%;
  height: 8px;
}
</style>