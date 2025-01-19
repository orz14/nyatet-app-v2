import { Children } from "react";

export default function EachUtils({ of, render }: { of: any[]; render: any }) {
  if (of?.length == 0) {
    console.log("Empty data");
    return null;
  }

  if (typeof render !== "function") {
    console.log("render is not a function");
    return null;
  }

  return Children.toArray(of?.map((item: any, index: number) => render(item, index)));
}
