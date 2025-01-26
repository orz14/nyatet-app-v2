type TextSkeletonType = {
  width?: string;
  height?: string;
};

export default function TextSkeleton({ width, height }: TextSkeletonType) {
  return <span className={`block bg-gray-700/30 rounded animate-pulse ${width ?? ""} ${height ?? "h-4"}`} />;
}
