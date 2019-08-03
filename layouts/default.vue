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
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>KANTAR</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn
            @click="logout()"
            icon
          >
            <v-icon>exit_to_app</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <!-- card -->
      <v-card
        class="mx-auto elevation-3"
        max-width="1200"
        style="margin-top: -125px;"
      >
        <nuxt />
      </v-card>
    </v-card>

  </v-app>
</template>

<script>
  export default {
    methods: {
      logout () {
        localStorage.removeItem('key')
        this.$router.push('/')
      }
    }
  }
</script>

