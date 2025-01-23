"use client";

import Link from "next/link";
import { Fragment } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import EachUtils from "@/utils/EachUtils";

type ListType = {
  isLink: boolean;
  url: string | null;
  label: string;
};

export default function CustomBreadcrumb({ list }: { list?: ListType[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/"}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {list && list?.length > 0 && (
          <EachUtils
            of={list}
            render={(item: any, index: number) =>
              item.isLink ? (
                <Fragment key={`breadcrumb-${index}`}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={item.url}>{item.label}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Fragment>
              ) : (
                <Fragment key={`breadcrumb-${index}`}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                </Fragment>
              )
            }
          />
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
