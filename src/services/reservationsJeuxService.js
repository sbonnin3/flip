import { API_URL } from "@/config";

export async function getAllReservationsJeux() {
    try {
        const response = await fetch(`${API_URL}/reservationsJeux`);
        if (!response.ok) throw new Error("Erreur récupération réservations jeux");
        return await response.json();
    } catch (error) {
        console.error("Erreur API Réservations Jeux:", error);
        return [];
    }
}
