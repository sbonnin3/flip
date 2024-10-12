<template>
    <div class="pageconnexion">
        <div class="login-container">
            <h2>Connexion</h2>
            <form @submit.prevent="login">
                <div>
                    <label for="identifiant">Identifiant:</label>
                    <input v-model="identifiant" type="text" id="identifiant" required />
                </div>
                <div>
                    <label for="motDePasse">Mot de Passe:</label>
                    <input v-model="motDePasse" type="password" id="motDePasse" required />
                </div>
                <button type="submit">Se connecter</button>
                <p v-if="errorMessage">{{ errorMessage }}</p>
            </form>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "PageConnexion",
    data() {
        return {
            identifiant: "",
            motDePasse: "",
            errorMessage: ""
        };
    },
    methods: {
        ...mapActions(['setUserSession']), // Import de l'action pour définir l'utilisateur connecté
        login() {
            const user = this.$store.getters.comptes.find(
                (compte) => compte.identifiant === this.identifiant && compte.motDePasse === this.motDePasse
            );
            if (user) {
                // Si l'utilisateur est trouvé, mettre à jour la session utilisateur dans le store
                this.setUserSession(user);
                // Rediriger vers la page MonCompte
                this.$router.push("/MonCompte");
            } else {
                // Message d'erreur si les informations de connexion sont incorrectes
                this.errorMessage = "Identifiant ou mot de passe incorrect.";
            }
        }
    }
};
</script>

<style scoped>
.pageconnexion {
    padding-top: 130px;
}

.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

form div {
    margin-bottom: 10px;
}

button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

p {
    color: red;
}
</style>