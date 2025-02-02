import CustomBreadcrumb from "./CustomBreadcrumb";

type BreadcrumbType = {
  isLink: boolean;
  url: string | null;
  label: string;
};

type HeaderType = {
  title: string;
  Icon?: any;
  breadcrumb?: BreadcrumbType[];
};

export default function Header({ title, Icon, breadcrumb }: HeaderType) {
  return (
    <div className="w-full bg-indigo-950/20 border border-indigo-950/80 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-x-1 sm:gap-x-2">
          {Icon && <Icon />}
          <h1 className="text-base sm:text-xl font-bold tracking-wider first-letter:text-indigo-400">{title}</h1>
        </div>
        {breadcrumb && <CustomBreadcrumb list={breadcrumb} />}
      </div>
    </div>
  );
}
