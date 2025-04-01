import { API_URL } from "@/config";

export async function getAllRestaurants() {
    try {
        const response = await fetch(`${API_URL}/restaurants`);
        if (!response.ok) throw new Error("Erreur récupération restaurants");
        return await response.json();
    } catch (error) {
        console.error("Erreur API Restaurants:", error);
        return [];
    }
}
