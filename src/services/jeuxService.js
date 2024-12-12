import { jeux } from '@/datasource/jeux';

export function getAllJeux() {
    return { error: 0, data: jeux };
}