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
