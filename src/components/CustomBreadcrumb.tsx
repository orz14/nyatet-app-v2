"use client";

import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import EachUtils from "@/utils/EachUtils";
import { Fragment } from "react";

export default function CustomBreadcrumb({ list }: { list?: any }) {
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
