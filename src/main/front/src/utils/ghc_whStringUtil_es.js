

export const isEmpty = (value) => {
    // 1. boolean → false면 빈값(true), true면 값있음(false)
    if (typeof value === 'boolean') return !value;

    // 2. string → null, undefined, '', '   ' → 빈값
    if (typeof value === 'string') {
        return value.trim().length === 0;
    }

    // 3. number → NaN은 빈값, 0 포함해서 값 있으면 false
    if (typeof value === 'number') {
        return isNaN(value);
    }

    // 4. array → null/undefined/길이 0 → 빈값
    if (Array.isArray(value)) {
        return !value || value.length === 0;
    }

    // 5. object → null/undefined/빈객체 → 빈값
    if (typeof value === 'object') {
        return value === null || Object.keys(value).length === 0;
    }

    // 6. 그 외 타입 → null 또는 undefined면 빈값
    return value === null || value === undefined;
}


/**
 * 문자열/숫자 입력을 받아 문자열로 변환한 뒤,
 * search(문자 그대로)를 모두 replacement로 치환합니다.
 * - search 또는 replacement가 undefined/null이면 원본 반환
 * - Number(0 등)도 값으로 취급 (NaN은 "NaN" 문자열로 변환됨)
 */
export function replaceAll(input, search, replacement) {
    if (search == null || replacement == null) {
        // search/replacement가 비어 있으면 원본 그대로
        return input?.toString?.() ?? String(input);
    }

    const value = (input ?? '').toString();
    const s = String(search);
    const r = String(replacement);

    if (s === '') return value; // 빈 문자열 치환은 그대로 반환(무한 분할 방지)

    return value.split(s).join(r);
}

export function addParam(url, key, value) {
    // key/value가 비어 있으면 원본 그대로
    if (key == null || value == null) {
        return url?.toString?.() ?? String(url);
    }

    const input = url?.toString?.() ?? String(url);
    const isAbsolute = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(input); // scheme 존재 여부 (http:, https:, etc.)

    try {
        const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
        const u = new URL(input, isAbsolute ? undefined : base);

        // 쿼리 파라미터 set(있으면 갱신, 없으면 추가)
        u.searchParams.set(String(key), String(value));

        // 원본이 상대경로였다면 상대 형태로 되돌려서 반환
        if (!isAbsolute) {
            return `${u.pathname}${u.search}${u.hash}`;
        }
        return u.toString();
    } catch {
        // URL 생성이 실패할 경우(매우 드묾) 수동 처리 (해시 유지)
        const str = input;
        const [pathAndQuery, hashPart = ''] = str.split('#');
        const hash = hashPart ? `#${hashPart}` : '';

        const qIndex = pathAndQuery.indexOf('?');
        const path = qIndex >= 0 ? pathAndQuery.slice(0, qIndex) : pathAndQuery;
        const qs = qIndex >= 0 ? pathAndQuery.slice(qIndex + 1) : '';

        const params = new URLSearchParams(qs);
        params.set(String(key), String(value));

        const query = params.toString();
        return `${path}${query ? `?${query}` : ''}${hash}`;
    }
}

export function logColoredLine(color = 'blue', text = '', length = 50) {
    const line = text
        ? ` ${text} `.padStart((length + text.length) / 2, '═').padEnd(length, '═')
        : '═'.repeat(length);

    console.log(`%c${line}`, `color: ${color}; font-weight: bold;`);
}

// 콤마 추가: 12345.67  -> "12,345.67"
//           "-12345"   -> "-12,345"
// 문자열/숫자 모두 허용, 소수/음수 지원
export function comma(value) {
    if (value === null || value === undefined) return '';
    const original = String(value);
    const normalized = original.replace(/,/g, ''); // 기존 콤마 제거

    // 입력 중간 상태 허용 (입력 컨트롤용)
    if (normalized === '' || normalized === '-' || normalized === '.' || normalized === '-.')
        return normalized;

    const sign = normalized.startsWith('-') ? '-' : '';
    const unsigned = sign ? normalized.slice(1) : normalized;

    const [intPart, ...rest] = unsigned.split('.');
    const fracPart = rest.join(''); // 점이 여러 개면 뒤를 모두 합침

    const intWithCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return sign + intWithCommas + (rest.length ? '.' + fracPart : '');
}

// 콤마 제거: "12,345.67" -> "12345.67"
export function removeCommas(value) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/,/g, '');
}

export const utf8ToB64 = (str) => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    let binary = '';
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
};

export const b64ToUtf8 = (b64) => {
    const binary = window.atob(b64);
    const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
};

export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}