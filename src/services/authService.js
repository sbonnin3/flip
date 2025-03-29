import { comptes } from "@/datasource/comptes";

export function loginUser(credentials) {
    console.log("Tentative de connexion avec :", credentials);

    if (!comptes || !Array.isArray(comptes)) {
        console.error("Erreur : la liste des comptes est vide ou non chargée.");
        return null;
    }

    // Log des identifiants dans la liste
    comptes.forEach(u => console.log(`Compte existant : ${u.identifiant}`));

    const user = comptes.find((u) => 
        u.identifiant.trim().toLowerCase() === credentials.identifiant.trim().toLowerCase() &&
        u.motDePasse.trim() === credentials.motDePasse.trim()
    );    

    if (!user) {
        console.error("Identifiant ou mot de passe incorrect");
        return null;
    }

    console.log("Connexion réussie :", user);
    return {
        id: user.id,
        identifiant: user.identifiant,
        role: user.role,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
    };
}

// Fonction d'inscription en local (ajout dans comptes.js temporairement)
export function registerUser(newUser) {
    if (comptes.some((u) => u.identifiant === newUser.identifiant)) {
        console.error("L'utilisateur existe déjà");
        return null;
    }

    const newId = comptes.length ? comptes[comptes.length - 1].id + 1 : 1;
    const user = { id: newId, ...newUser };
    comptes.push(user); // ⚠️ Ceci ne persiste pas les données, un backend est recommandé.

    return user;
}
