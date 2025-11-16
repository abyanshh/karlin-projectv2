"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import api from "@/lib/axios";

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const formatSegment = (segment: string) => {
  try {
    return decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch (e) {
    return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
};

export const BreadcrumbDemo = () => {
  const pathname = usePathname();
  const [names, setNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const segments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );

  useEffect(() => {
    const loadNames = async () => {
      setLoading(true);
      const newNames: Record<string, string> = {};

      const promises = segments.map(async (segment, index) => {
        if (!isUUID(segment)) return;

        // tentukan apakah ini projectId atau taskId
        const isProjectId = index === 2;
        const isTaskId = index === 3;

        try {
          if (isProjectId) {
            const res = await api.get(`/project/${segment}`);
            newNames[segment] = res.data.project.po;
          }

          if (isTaskId) {
            const projectId = segments[2];
            const res = await api.get(
              `/project/${projectId}/tasks/${segment}`
            );
            newNames[segment] = res.data.task.nama;
          }
        } catch {
          newNames[segment] = formatSegment(segment);
        }
      });

      await Promise.all(promises);

      setNames(newNames);
      setLoading(false);
    };

    loadNames();
  }, [pathname, segments]);

  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          {segments.length === 0 ? (
            <BreadcrumbPage>Home</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          const label = isUUID(segment)
            ? loading
              ? "..."
              : names[segment] || formatSegment(segment)
            : formatSegment(segment);

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
