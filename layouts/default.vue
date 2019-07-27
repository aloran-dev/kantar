<template>
  <v-app>
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
        extensionHeight="100"
      >
      </v-toolbar>

      <!-- card -->
      <v-card
        class="mx-auto"
        max-width="1200"
        style="margin-top: -64px;"
      >
        <nuxt />
      </v-card>
    </v-card>

  </v-app>
</template>
