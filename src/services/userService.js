// src/services/userService.js
import { comptes } from '@/datasource/comptes';

export default {
  // Authentification
  login(credentials) {
    const user = comptes.find(u => 
      u.identifiant === credentials.identifiant && 
      u.motDePasse === credentials.motDePasse
    );
    return user ? { ...user } : null;
  },

  register(newUser) {
    if (comptes.some(u => u.identifiant === newUser.identifiant)) {
      throw new Error("L'utilisateur existe déjà");
    }
    
    const newId = Math.max(...comptes.map(u => u.id)) + 1;
    const user = { id: newId, ...newUser };
    comptes.push(user);
    return { ...user };
  },

  // Gestion des comptes
  getAllComptes() {
    return [...comptes];
  },

  getCompteById(id) {
    return { ...comptes.find(u => u.id === id) };
  },

  updateCompte(updatedCompte) {
    const index = comptes.findIndex(u => u.id === updatedCompte.id);
    if (index !== -1) {
      comptes[index] = updatedCompte;
      return { ...updatedCompte };
    }
    throw new Error("Compte non trouvé");
  },

  deleteCompte(id) {
    const index = comptes.findIndex(u => u.id === id);
    if (index !== -1) {
      return comptes.splice(index, 1)[0];
    }
    throw new Error("Compte non trouvé");
  }
}