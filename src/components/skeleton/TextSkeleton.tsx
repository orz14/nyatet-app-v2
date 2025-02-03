import { cn } from "@/lib/utils";

type TextSkeletonType = {
  width?: string;
  height?: string;
  className?: string;
};

export default function TextSkeleton({ width = "", height = "h-4", className }: TextSkeletonType) {
  return <span className={cn("block bg-gray-700/30 rounded animate-pulse", width, height, className)} />;
}
