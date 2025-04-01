import { API_URL } from "@/config";

export async function getAllJeux() {
    try {
        const response = await fetch(`${API_URL}/jeux`);
        if (!response.ok) throw new Error("Erreur récupération jeux");
        return await response.json();
    } catch (error) {
        console.error("Erreur API Jeux:", error);
        return [];
    }
}
