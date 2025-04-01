import { API_URL } from "@/config";

export async function getAllTournois() {
    try {
        const response = await fetch(`${API_URL}/tournois`);
        if (!response.ok) throw new Error("Erreur récupération tournois");
        return await response.json();
    } catch (error) {
        console.error("Erreur API Tournois:", error);
        return [];
    }
}
