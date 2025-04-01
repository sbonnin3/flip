import { API_URL } from "@/config";

export async function getAllComptes() {
    try {
        const response = await fetch(`${API_URL}/comptes`);
        if (!response.ok) throw new Error("Erreur récupération comptes");
        return await response.json();
    } catch (error) {
        console.error("Erreur API Comptes:", error);
        return [];
    }
}
