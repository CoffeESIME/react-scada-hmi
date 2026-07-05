'use server';

import fs from 'fs/promises';
import path from 'path';

export async function getAvailableImages(): Promise<string[]> {
    try {
        const imagesDir = path.join(process.cwd(), 'public', 'images');
        const files = await fs.readdir(imagesDir);
        // Filtramos solo archivos con extensiones de imagen comunes
        const imageFiles = files.filter(file => /\.(png|jpe?g|svg|gif|webp)$/i.test(file));
        return imageFiles;
    } catch (error) {
        console.error('Error reading public/images directory:', error);
        return [];
    }
}
