export interface Photo {
    id: number;
    basename: string;
    width: number;
    height: number;
    availableSizes: string; // JSON array string
    year?: number | null;
    month?: number | null;
    day?: number | null;
    sequence?: number | null;
    rotation?: number | null; // 0=normal, 1=90°, 2=180°, 3=270°
    hidden?: boolean;
    description?: string | null;
}

/** Convert rotation enum to CSS transform degrees */
export function rotationToDegrees(rotation: number | null | undefined): number {
    switch (rotation) {
        case 1: return 90;
        case 2: return 180;
        case 3: return 270;
        default: return 0;
    }
}

export function parseSizes(raw: string | undefined): string[] {
    try {
        const arr = JSON.parse(raw || '[]');
        return Array.isArray(arr) && arr.length ? arr : ['480w', '960w', '1600w', '2560w'];
    } catch { return ['480w', '960w', '1600w', '2560w']; }
}

export function buildSrcset(baseURL: string, basename: string, ext: string, sizes: string[]): string {
    return sizes.map(size => `${baseURL}${basename}_${size}.${ext} ${size}`).join(', ');
}

export function selectBestSize(sizes: string[], viewport?: { w: number; h: number; dpr: number }): string {
    if (!sizes.length) return '960w';
    const numbers = sizes.map(s => parseInt(s.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n));
    if (!numbers.length) return sizes[0];
    const vpW = viewport?.w ?? window?.innerWidth ?? 1024;
    const vpH = viewport?.h ?? window?.innerHeight ?? 768;
    const dpr = viewport?.dpr ?? (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    const target = Math.max(vpW, vpH) * dpr;
    let picked = numbers[0];
    for (const n of numbers) { if (n >= target) { picked = n; break; } picked = n; }
    return sizes.find(s => s.startsWith(String(picked))) || sizes[sizes.length - 1];
}

export function formatPhotoDate(p: Photo): string {
    const y = p.year ?? null;
    const m = p.month ?? null;
    const d = p.day ?? null;
    if (!y) return 'Date unknown';
    if (y && m && d) return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    if (y && m) return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    return String(y);
}
