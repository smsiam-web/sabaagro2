import React from "react";
import { Bars } from 'react-loader-spinner'

const Button = ({
  className = "",
  icon = null,
  title = "title",
  loading = false,
  ...rest
}) => {
  console.log(loading)
  return (
    <button className={`font-bold text-white px-5 py-4 rounded ${className}`} {...rest}>
      {loading ? (
        <span className="flex justify-center">
        <Bars
        
        height="29"
        width="29"
        color="#FFFFFF"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        /></span>
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
