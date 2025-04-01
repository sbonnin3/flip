import { API_URL } from "@/config";

export async function getAllSouvenirs() {
    try {
        const response = await fetch(`${API_URL}/souvenirs`);
        if (!response.ok) throw new Error("Erreur récupération souvenirs");
        return await response.json();
    } catch (error) {
        console.error("Erreur API Souvenirs:", error);
        return [];
    }
}
