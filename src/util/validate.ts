import { equal, min, max, minLength, maxLength, required } from './helper.js';
import { method, extensibleObj } from '../model/types.js';
import { Valid } from '../model/valid.js';

type strict = { [methodName: string]: [string, ...string[]] };

const strictlyNumber: strict = {
  min: ['value', 'self'],
  max: ['value', 'self'],
  equal: ['value', 'self'],
  required: ['value', ''],
};
const strictlyString: strict = {
  minLength: ['value', 'self'],
  maxLength: ['value', 'self'],
  equal: ['value', 'self'],
  required: ['value'],
  badWords: ['value'],
};

function getValidatorKeys(allow: Valid) {
  const valueType =
    typeof allow.value === 'string' ? strictlyString : strictlyNumber;
  return [valueType, Object.keys(allow).filter((key) => key in valueType)];
}

function getMethodsFrom<T extends method>(objLike: T, keys: string[]) {
  return keys.map((key) => ({
    fn: typeof objLike['$' + key] === 'function' ? objLike['$' + key] : null,
    type: key,
  }));
}

//validator
export function validate(allow: Valid & extensibleObj) {
  const [valueType, keys] = <[strict, string[]]>getValidatorKeys(allow);
  const attachMethods = getMethodsFrom(<any>validate, keys);
  const allowedFns = attachMethods.filter((method) => method.fn);

  return allowedFns.every((predicateObject) => {
    let { fn, type } = predicateObject;
    if (fn) {
      const passThroughProps = valueType[type];
      return fn(
        ...passThroughProps
          .map((prop) =>
            prop === 'self' ? allow[type] : prop === '' ? null : allow[prop]
          )
          .filter((v: any) => v !== null)
      );
    } else {
      return true;
    }
  });
}

validate.$min = min;
validate.$max = max;
validate.$equal = equal;
validate.$required = required;
validate.$minLength = minLength;
validate.$maxLength = maxLength;
