import type { Photo } from './photos';

export interface CollectionMeta {
    id: number;
    name: string;
    note?: string | null;
    description?: string | null;
    hidden?: boolean;
}

export interface CollectionFull {
    meta: CollectionMeta;
    photos: Photo[];
}

export async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
    return res.json();
}

export async function fetchRandomPhotos(apiBase: string): Promise<Photo[]> {
    return fetchJSON<Photo[]>(`${apiBase}/images/random`);
}

export async function fetchCollections(apiBase: string): Promise<CollectionMeta[]> {
    return fetchJSON<CollectionMeta[]>(`${apiBase}/collections`);
}

export async function fetchCollectionBySlug(apiBase: string, slug: string): Promise<CollectionFull> {
    return fetchJSON<CollectionFull>(`${apiBase}/collections/${slug}`);
}
