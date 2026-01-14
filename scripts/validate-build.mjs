#!/usr/bin/env node
/*
 * Simple post-build validation script to catch production issues early.
 * Run with: npm run build:validate
 * Fails (exit 1) if critical checks fail; prints warnings for non-critical ones.
 */
import fs from 'node:fs';
import path from 'node:path';

// Load .env if present so PUBLIC_* variables are available (mirrors build environment)
try {
    const dotenvPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(dotenvPath)) {
        await import('dotenv').then(m => m.config());
    }
} catch (e) {
    console.warn('[validate-build] Could not load dotenv:', e?.message);
}

const errors = [];
const warnings = [];

function requireEnv(name, { mustEndWithSlash = false } = {}) {
    const val = process.env[name];
    if (!val) {
        errors.push(`Missing required environment variable ${name}`);
        return;
    }
    if (mustEndWithSlash && !val.endsWith('/')) {
        warnings.push(`${name} should end with a trailing slash (currently: ${val})`);
    }
}

// Critical envs for this project
requireEnv('PUBLIC_IMAGE_BASE_URL');
requireEnv('PUBLIC_API_BASE_URL');

// Check that build output exists
const distDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
    errors.push('dist/ directory does not exist. Did the build step run?');
} else {
    // Basic HTML presence checks
    const indexPath = path.join(distDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
        errors.push('dist/index.html is missing.');
    } else {
        const html = fs.readFileSync(indexPath, 'utf8');
        if (!/id=("|')lightbox("|')/.test(html)) {
            errors.push('Lightbox markup (#lightbox) not found in index.html.');
        }
        // Ensure gallery images have onclick to open lightbox (smoke test)
        if (!/onclick=\"openLightbox\(/.test(html)) {
            warnings.push('No gallery image onclick="openLightbox(...)" found in index.html.');
        }
    }
}

// API reachability test (non-fatal): fetch collections
const apiBase = process.env.PUBLIC_API_BASE_URL;
if (apiBase) {
    try {
        const res = await fetch(apiBase.replace(/\/$/, '') + '/collections', { method: 'GET' });
        if (res.status === 404) {
            warnings.push(`Collections endpoint returned 404 (${apiBase}/collections). Static generation will skip collection pages.`);
        } else if (!res.ok) {
            warnings.push(`Collections endpoint returned status ${res.status}.`);
        } else {
            const data = await res.json().catch(() => null);
            if (Array.isArray(data) && data.length === 0) {
                warnings.push('Collections endpoint returned an empty array. No collection pages will be generated.');
            }
        }
    } catch (e) {
        warnings.push(`Collections endpoint fetch failed: ${(e && e.message) || e}`);
    }
}

// Report
function formatList(arr, label, color) {
    if (!arr.length) return '';
    return `\n${label}:\n` + arr.map(i => `  - ${i}`).join('\n');
}

const report = [
    '[validate-build] Validation complete.',
    formatList(errors, 'Errors', 'red'),
    formatList(warnings, 'Warnings', 'yellow')
].join('');

console.log(report + '\n');

if (errors.length) {
    process.exitCode = 1;
}