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
