export type RecursivePartial<T> = {
  [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

export function deepMergeProps<T> (defaultProps: T, props: RecursivePartial<T>) {
  const isObject = (obj: any) => obj && typeof obj === 'object';
  const objects = [defaultProps, props];
  
  return objects.reduce((prev: any, obj: any) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];
      
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      }
      else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = deepMergeProps(pVal, oVal);
      }
      else {
        prev[key] = oVal;
      }
    });
    
    return prev;
  }, {}) as T;
}

export function enterViewportLengthFromBottom<T> (element: T extends HTMLElement ? T : any) {
  const rect = element.getBoundingClientRect();
  return window.innerHeight - rect.top;
}

export function throttle(fn: (...args: any[]) => void, wait: number) {
  let timer: any = null;

  return function foo(this: any) {
    if(timer !== null) return;
    const args = Array.prototype.slice.call(arguments);

    timer = setTimeout(() => {
      fn.apply(this, args);

      clearTimeout(timer);
      timer = null;
    }, wait);
  }
}

export function debounce(fn: (...args: any[]) => void, wait: number) {
  let timer: any = null;

  return function foo(this: any) {
    const args = Array.prototype.slice.call(arguments);

    if(timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(this, args);

      clearTimeout(timer);
      timer = null;
    }, wait);
  }
}

export const limitNumBetweenRange = (num: number, start: number, end: number) => {
  if(num < start) return start;
  if(num > end) return end;
  return num;
};

export const cubicEaseOut = (start: number, end: number, t: number) => {
  return (end - start) * t * (2 - t) + start;
}