const BASE_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const TABLE_INDEX = 1;
const RANDOM_ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const I8 = 161;
const I9 = 30;
const I10 = 2;
const APP_ID = "com.korail.talk";
const OS_TYPE = "Android";
const SDK_VERSION = "v1.0.3";
const AS_VALUE = "[38ff229cb34c7dda8e28220a2d750cce]";
const DEVICE_MODEL = "SM-S928N";
const OS_VERSION = "15";

function primeTable(count = 100): number[] {
  const primes: number[] = [];
  let candidate = 2;
  while (primes.length < count + 1) {
    let isPrime = true;
    for (const prime of primes) {
      if (prime * prime > candidate) break;
      if (candidate % prime === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(candidate);
    candidate += 1;
  }
  return primes.slice(1);
}

const PRIMES = primeTable();

function sdkPermuteAlphabet(value: string, multiplier: number, step: number): string {
  const length = value.length;
  let blockSize = 1;
  for (const prime of PRIMES) {
    if (prime <= length) blockSize = prime;
    else break;
  }

  const counts = new Array<number>(blockSize).fill(0);
  const chars = new Array<string>(blockSize).fill("");
  let factor = 1;
  for (let idx = 0; idx < blockSize; idx++) {
    const target = ((factor % blockSize) * step) % blockSize;
    counts[target] += 1;
    if (counts[target] === 1) chars[idx] = value[target] ?? "";
    factor = (factor * multiplier) % blockSize;
  }

  const encoded: string[] = [];
  const missing: string[] = [];
  for (let idx = 0; idx < chars.length; idx++) {
    const ch = chars[idx];
    if (ch) {
      encoded.push(ch);
      continue;
    }
    for (let missingIdx = 0; missingIdx < blockSize; missingIdx++) {
      if (counts[missingIdx] === 0) {
        const replacement = value[missingIdx] ?? "";
        chars[idx] = replacement;
        missing.push(replacement);
        counts[missingIdx] = 1;
        break;
      }
    }
  }

  while (blockSize < length) {
    missing.push(value[blockSize] ?? "");
    blockSize += 1;
  }

  const missingText = missing.join("");
  if (missingText.length < (PRIMES[0] ?? 3)) {
    return encoded.join("") + missingText;
  }
  return encoded.join("") + sdkPermuteAlphabet(missingText, multiplier, step);
}

function encodingTable(index = TABLE_INDEX): string {
  const multiplier = PRIMES[index % 29] ?? 3;
  const step = PRIMES[Math.floor(index / 29) % 29] ?? 3;
  return sdkPermuteAlphabet(BASE_ALPHABET, multiplier, step);
}

function buildPrefix(table: string, tableIndex = TABLE_INDEX, i11 = 2, i12 = 30): string {
  return `${String.fromCharCode(tableIndex + 97)}${table[2]}${table[37]}${table[i11]}${table[i12 - 1]}`;
}

function stringToXa1s(data: string): number[] {
  const result: number[] = [];
  for (const ch of data) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp < 128) result.push(cp);
    else if (cp < 2048) {
      result.push(128 | ((cp >> 7) & 15));
      result.push(cp & 127);
    } else if (cp >= 262144) {
      result.push(160);
      result.push((cp >> 14) & 127);
      result.push((cp >> 7) & 127);
      result.push(cp & 127);
    } else if ((63488 & cp) !== 55296) {
      result.push(((cp >> 14) & 15) | 144);
      result.push((cp >> 7) & 127);
      result.push(cp & 127);
    }
  }
  return result;
}

function makeDynapathKey(key: string): bigint {
  let value = 0n;
  for (const ch of key) {
    const cp = ch.codePointAt(0) ?? 0;
    let bit = 32768;
    for (let i = 0; i < 16; i++) {
      if (bit & cp) break;
      bit >>= 1;
    }
    value = value * BigInt(bit << 1) + BigInt(cp);
  }
  return value;
}

function pickTableChar(baseTable: string, remainder: number, used: string): string {
  let count = 0;
  for (const ch of baseTable) {
    if (!used.includes(ch)) {
      if (count === remainder) return ch;
      count += 1;
    }
  }
  return " ";
}

function makeEncodeTable(num: bigint, encodeSize: number, baseTable: string): string {
  let result = "";
  let temp = num;
  for (let i = 0; i < encodeSize; i++) {
    const divisor = BigInt(encodeSize - i);
    const remainder = Number(temp % divisor);
    result += pickTableChar(baseTable, remainder, result);
    temp = temp / divisor;
  }
  return result;
}

function encodeNormalBe(data: string, table: string, i8 = I8, i9 = I9, i10 = I10): string {
  const bytesLike = stringToXa1s(data);
  const out: string[] = [];
  const arr = new Array<number>(i10 + 1).fill(0);
  let idx = 0;
  let remain = bytesLike.length % i10;
  const fullLen = bytesLike.length - remain;

  while (idx < fullLen) {
    let val = 0;
    for (let i = 0; i < i10; i++) {
      val = val * i8 + (bytesLike[idx] ?? 0);
      idx += 1;
    }
    for (let i = 0; i < i10 + 1; i++) {
      arr[i] = val % i9;
      val = Math.floor(val / i9);
    }
    for (let i = i10; i >= 0; i--) out.push(table[arr[i] ?? 0] ?? "");
  }

  if (remain > 0) {
    let val = 0;
    for (let i = 0; i < remain; i++) {
      val = val * i8 + (bytesLike[idx] ?? 0);
      idx += 1;
    }
    for (let i = 0; i < remain + 1; i++) {
      arr[i] = val % i9;
      val = Math.floor(val / i9);
    }
    while (remain >= 0) {
      out.push(table[arr[remain] ?? 0] ?? "");
      remain -= 1;
    }
  }

  return out.join("");
}

function javaUrlEncode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/[!'()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
    .replace(/%7E/gi, "%7E");
}

function javaFormEncode(fields: Array<[string, string]>): string {
  return fields.map(([k, v]) => `${javaUrlEncode(k)}=${javaUrlEncode(v)}`).join("&");
}

function randomText(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => RANDOM_ALPHABET[b % RANDOM_ALPHABET.length]).join("");
}

function randomDeviceId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export type DynapathIdentity = {
  deviceId: string;
  appStartTs: string;
};

export function createDynapathIdentity(): DynapathIdentity {
  return {
    deviceId: randomDeviceId(),
    appStartTs: String(Date.now() - 90_000),
  };
}

export function dynapathEncodingTable(): string {
  return encodingTable(TABLE_INDEX);
}

export function generateDynapathToken(
  identity: DynapathIdentity,
  opts?: { timestampMs?: number; randomText?: string },
): string {
  const table = encodingTable(TABLE_INDEX);
  const ts = opts?.timestampMs ?? Date.now();
  const rand = opts?.randomText ?? randomText();
  const fields: Array<[string, string]> = [
    ["ai", APP_ID],
    ["di", identity.deviceId],
    ["as", AS_VALUE],
    ["su", "false"],
    ["dbg", "false"],
    ["emu", "false"],
    ["hk", "false"],
    ["it", identity.appStartTs],
    ["ts", String(ts)],
    ["rt", "0"],
    ["os", OS_VERSION],
    ["dm", DEVICE_MODEL],
    ["st", OS_TYPE],
    ["sv", SDK_VERSION],
  ];
  const payload = javaFormEncode(fields);
  const dynKey = `${SDK_VERSION}+${rand}+${ts}`;
  const encodedKey = encodeNormalBe(dynKey, table);
  const customTable = makeEncodeTable(makeDynapathKey(dynKey), I9, table);
  const encodedBody = encodeNormalBe(payload, customTable);
  const prefix = buildPrefix(table, TABLE_INDEX, I10, I9);
  const marker = table[encodedKey.length] ?? table[encodedKey.length % table.length] ?? "A";
  return `${prefix}${marker}${encodedKey}${encodedBody}`;
}

export const KORAIL_USER_AGENT =
  "Dalvik/2.1.0 (Linux; U; Android 15; SM-S928N Build/AP3A.240905.015.A2)";
