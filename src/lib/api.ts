import type { Photo, RawPhoto } from './photos';
import { normalizePhoto } from './photos';

export interface CollectionMeta {
    id: number;
    slug: string;
    title: string;
    note?: string | null;
    description?: string | null;
    coverPhotoID?: number | null;
}

export interface CollectionFull extends CollectionMeta {
    photos: Photo[];
}

export async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
    return res.json();
}

export async function fetchRandomPhotos(apiBase: string): Promise<Photo[]> {
    const raw = await fetchJSON<RawPhoto[]>(`${apiBase}/images/random`);
    return raw.map(normalizePhoto);
}

export async function fetchCollections(apiBase: string): Promise<CollectionMeta[]> {
    return fetchJSON<CollectionMeta[]>(`${apiBase}/collections`);
}

export async function fetchCollectionBySlug(apiBase: string, slug: string): Promise<CollectionFull> {
    const data = await fetchJSON<{ meta: CollectionMeta; photos: RawPhoto[] }>(`${apiBase}/collections/${slug}`);
    return { ...data.meta, photos: data.photos.map(normalizePhoto) };
}
