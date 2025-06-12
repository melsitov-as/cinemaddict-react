import { TextEncoder, TextDecoder } from 'util';

Object.defineProperty(global, 'TextEncoder', {
  writable: true,
  value: TextEncoder,
});

Object.defineProperty(global, 'TextDecoder', {
  writable: true,
  value: TextDecoder,
});
