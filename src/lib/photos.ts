export interface RawPhoto {
    ID: number;
    Basename: string;
    Width: number;
    Height: number;
    AvailableSizes: string; // JSON array string
    Year?: { Int64: number; Valid: boolean } | null;
    Month?: { Int64: number; Valid: boolean } | null;
    Day?: { Int64: number; Valid: boolean } | null;
}

export interface Photo extends RawPhoto {
    YearValue?: number | null;
    MonthValue?: number | null;
    DayValue?: number | null;
}

export function normalizePhoto(p: RawPhoto): Photo {
    return {
        ...p,
        YearValue: p.Year?.Valid ? p.Year.Int64 : null,
        MonthValue: p.Month?.Valid ? p.Month.Int64 : null,
        DayValue: p.Day?.Valid ? p.Day.Int64 : null,
    };
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
    const y = (p as any).Year?.Valid ? (p as any).Year.Int64 : (p as any).YearValue ?? null;
    const m = (p as any).Month?.Valid ? (p as any).Month.Int64 : (p as any).MonthValue ?? null;
    const d = (p as any).Day?.Valid ? (p as any).Day.Int64 : (p as any).DayValue ?? null;
    if (!y) return 'Date unknown';
    if (y && m && d) return new Date(y, m - 1, d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    if (y && m) return new Date(y, m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    return String(y);
}
