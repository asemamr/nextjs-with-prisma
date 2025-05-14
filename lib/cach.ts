import { cache as ReactCache} from "react";
import {unstable_cache as NextCache } from "next/cache"
type Callback = (...arg: any) => Promise<any>;
export function cache<T extends Callback>(cb: T, keyParts: string[], options: { revalidate?: number | false;  tags?: string[]}= {})  {
  return NextCache(ReactCache(cb), keyParts, options);
}
