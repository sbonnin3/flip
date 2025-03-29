import { API_URL } from "@/config";

export async function getAllCommandes() {
    try {
        const response = await fetch(`${API_URL}/commandes`);
        if (!response.ok) throw new Error("Erreur récupération commandes");
        return await response.json();
    } catch (error) {
        console.error("Erreur API Commandes:", error);
        return [];
    }
}
