<template>
    <div class="page-ma-prestation">
      <component :is="currentComponent"></component>
    </div>
  </template>
  
  <script>
  import MaPrestationOrganisateur from "./MaPrestationOrganisateur.vue";
  import MaPrestationRestaurateur from "./MaPrestationRestaurateur.vue";
  import MaPrestationVendeur from "./MaPrestationVendeur.vue";
  import MaPrestationCreateur from "./MaPrestationCreateur.vue";
  import { mapGetters } from "vuex";
  
  export default {
    name: "MaPrestation",
    computed: {
      ...mapGetters(["userSession"]),
      currentComponent() {
        // Détermine le composant à charger en fonction du rôle de l'utilisateur
        const role = this.userSession?.role;
        switch (role) {
          case "organisateur":
            return MaPrestationOrganisateur;
          case "restaurateur":
            return MaPrestationRestaurateur;
          case "vendeur":
            return MaPrestationVendeur;
          case "createur":
            return MaPrestationCreateur;
          default:
            return null;
        }
      }
    }
  };
  </script>

<style scoped>
.page-ma-prestation {
    padding-top: 100px;
}
</style>