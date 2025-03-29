import { API_URL } from "@/config";

export async function getAllStands() {
    try {
        const response = await fetch(`${API_URL}/stands`);
        if (!response.ok) throw new Error("Erreur récupération stands");
        return await response.json();
    } catch (error) {
        console.error("Erreur API Stands:", error);
        return [];
    }
}
