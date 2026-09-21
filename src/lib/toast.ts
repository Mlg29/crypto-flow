type Tone = 'success' | 'info' | 'warning' | 'danger';
type PushFn = (tone: Tone, message: string) => void;

let _push: PushFn | null = null;

export const toast = {
  register(fn: PushFn) {
    _push = fn;
  },
  success(message: string) {
    _push?.('success', message);
  },
  info(message: string) {
    _push?.('info', message);
  },
  warning(message: string) {
    _push?.('warning', message);
  },
  danger(message: string) {
    _push?.('danger', message);
  },
};
