import FingerprintJS from '@fingerprintjs/fingerprintjs';

let cached: string | null = null;
let pending: Promise<string> | null = null;

export function getDeviceId(): Promise<string> {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => {
        cached = result.visitorId;
        return cached;
      })
      .catch(() => {
        pending = null;
        return 'unknown';
      });
  }
  return pending;
}

getDeviceId();
