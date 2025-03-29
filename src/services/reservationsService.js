import { API_URL } from "@/config";

export async function getAllReservations() {
    try {
        const response = await fetch(`${API_URL}/reservations`);
        if (!response.ok) throw new Error("Erreur récupération réservations");
        return await response.json();
    } catch (error) {
        console.error("Erreur API Réservations:", error);
        return [];
    }
}
