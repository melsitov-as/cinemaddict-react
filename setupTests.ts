import '@testing-library/jest-dom';

if (typeof HTMLFormElement !== 'undefined') {
  HTMLFormElement.prototype.requestSubmit = jest.fn();
}
