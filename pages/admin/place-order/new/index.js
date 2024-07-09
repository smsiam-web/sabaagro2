import React from "react";
import AdminLayout from "@/admin/AdminLayout";
import AddOrder from "@/admin/components/placeOrder/add_order";
import Link from "next/link";
import { BsArrowLeftShort } from "react-icons/bs";

const Products = () => {
  return (
    <AdminLayout>
      <Link href={"/admin/place-order"}>
        <div className="flex items-center justify-start text-sub-title">
          <BsArrowLeftShort size={22} />
          <span>Back</span>
        </div>
      </Link>
      <AddOrder />
    </AdminLayout>
  );
};

export default Products;
