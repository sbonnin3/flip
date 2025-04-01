import { souvenirs } from "../datasource/data.js";

export function getAllSouvenirs() {
    return { error: 0, data: souvenirs };
}