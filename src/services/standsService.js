import { stands } from '../datasource/data.js';

export function getAllStands() {
    return { error: 0, data: stands };
}