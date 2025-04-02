import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
    fr: {
        "Accueil": "Accueil",
        "Carte": "Carte",
        "Activités": "Activités",
        "Réservations": "Réservations",
        "Mon Compte": "Mon Compte",
        "Connexion": "Connexion",
        "Comptes": "Comptes",
        "Produits": "Produits",
        "Statistiques": "Statistiques",
        "Ma Prestation": "Ma Prestation",
        "Commandes": "Commandes",
        "Ventes": "Ventes",
        "Mes réservations": "Mes réservations"
    },
    en: {
        "Accueil": "Home",
        "Carte": "Map",
        "Activités": "Activities",
        "Réservations": "Bookings",
        "Mon Compte": "My Account",
        "Connexion": "Login",
        "Comptes": "Accounts",
        "Produits": "Products",
        "Statistiques": "Statistics",
        "Ma Prestation": "My Service",
        "Commandes": "Orders",
        "Ventes": "Sales",
        "Mes réservations": "My Bookings"
    }
}

const savedLang = localStorage.getItem('userLanguage') || 'fr'

export default new VueI18n({
    locale: savedLang,
    fallbackLocale: 'fr',
    messages,
    silentTranslationWarn: process.env.NODE_ENV === 'production'
})