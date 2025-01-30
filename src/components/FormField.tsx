import React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FormFieldType = {
  label: string;
  type?: string;
  name: string;
  className?: string;
  required?: boolean;
  error?: any;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormField({ label, type = "text", name, className = "", required = false, error, ...props }: FormFieldType) {
  return (
    <div className="grid w-full items-center gap-1">
      <Label htmlFor={name} className="text-[11px] font-normal md:font-medium">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </Label>
      <Input type={type} id={name} name={name} className={`border-gray-900 ${className}`} {...props} />
      {error && error}
    </div>
  );
}
