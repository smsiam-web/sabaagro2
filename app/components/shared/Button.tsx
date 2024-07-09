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
    <button className={`font-bold text-white px-5 py-4 rounded ${className}`} {...rest}>
      {loading ? (
        <Loader color="gray" size="sm" className="mx-auto" />
      ) : icon ? (
        <div className="flex items-center justify-center gap-2">
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
