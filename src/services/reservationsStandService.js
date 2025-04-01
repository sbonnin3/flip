import { API_URL } from "@/config";

export async function getAllReservationsStand() {
    try {
        const response = await fetch(`${API_URL}/reservationsStand`);
        if (!response.ok) throw new Error("Erreur récupération réservations stand");
        return await response.json();
    } catch (error) {
        console.error("Erreur API Réservations Stand:", error);
        return [];
    }
}
