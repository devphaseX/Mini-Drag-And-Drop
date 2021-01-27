import { orderType } from '../model/types.js';

function order(type: orderType) {
  return function order(x: number, y: number) {
    switch (type) {
      case 'max':
        return y >= x;
      case 'min':
        return x >= y;
      default:
        return x === y;
    }
  };
}

function pluckTo(fn: Function, type: string) {
  return function through(...v: any[]): boolean {
    return fn(...v.map((v) => (typeof v !== 'number' ? v[type] : v)));
  };
}

export const min = order('min');
export const max = order('max');
export const equal = order('equal');
export const required = (value: number | string) =>
  value && typeof value === 'string'
    ? !!value.trim()
    : Number.isFinite(value) && value > 0;

export const minLength = pluckTo(min, 'length');
export const maxLength = pluckTo(max, 'length');
