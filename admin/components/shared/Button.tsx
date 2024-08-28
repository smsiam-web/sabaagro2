import { Loader } from "@mantine/core";
import React from "react";

const Button = ({
  className = "",
  icon = null,
  title = "title",
  loading = false,
  ...rest
}) => {
  return (
    <button className={`sm:font-bold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-4 rounded ${className}`} {...rest}>
      {loading ? (
        <Loader color="gray" size="sm" className="mx-auto" />
      ) : icon ? (
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {icon}
          {title}
        </div>
      ) : (
        title
      )}
    </button>
  );
};

export default Button;
