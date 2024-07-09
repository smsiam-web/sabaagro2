import SingleCAtegory from "@/admin/components/category/SingleCategory";
import Link from "next/link";
import React from "react";
import { BsArrowLeftShort } from "react-icons/bs";

const singleCategory = () => {
  return (
    <div>
      <Link href={"/admin/category"}>
        <div className="flex items-center justify-start text-sub-title">
          <BsArrowLeftShort size={22} />
          <span>Back</span>
        </div>
      </Link>
      <SingleCAtegory />
    </div>
  );
};

export default singleCategory;
