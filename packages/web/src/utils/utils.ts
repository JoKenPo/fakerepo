import React from "react";
import { useLocation } from "react-router-dom";

export const objectsEquals = (o1: any, o2: any): boolean =>
    !!(Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => o1[p] === o2[p]));

export const arraysEquals = (a1: any[], a2: any[]): boolean =>
    !!(a1.length === a2.length && a1.every((o, idx) => objectsEquals(o, a2[idx])));

export function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const useDidMountEffect = (func, deps) => {
  const didMount = React.useRef(false);

  React.useEffect(() => {
      if (didMount.current) {
          func();
      } else {
          didMount.current = true;
      }
  }, deps);
};