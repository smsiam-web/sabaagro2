import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useBarcode } from "next-barcode";
import GenerateStick from "@/admin/utils/GenerateSticker";
import Image from "next/image";
import ReactToPrint from "react-to-print";
import Button from "../../shared/Button";
import { db } from "@/app/utils/firebase";
import Link from "next/link";

const GeneratePDF = dynamic(() => import("../../../utils/GeneratePDF"), {
  ssr: false,
});

// Create Document Component

const OrderDetails = ({ onClick }) => {
  const ref = useRef();
  const [id, setId] = useState(usePathname()?.split("=")[1]);
  const [singleOrder, setSingleOrder] = useState(null);
  const [toLocalTime, setToLocalTime] = useState(null);

  useEffect(() => {
    db.collection("placeOrder")
      .doc(id)
      .get()
      .then((doc) => {
        setSingleOrder(doc.data());
      });
    const time =
      singleOrder && singleOrder?.timestamp.toDate().toLocaleTimeString();
    setToLocalTime(time);
  }, [id]);

  const { inputRef } = useBarcode({
    value: id,
    options: {
      background: "#C1DEC6",
      displayValue: true,
      width: 2,
      height: 45,
      fontSize: 20,
    },
  });

  console.log(singleOrder);

  return (
    <>
      <div className="flex items-center justify-end gap-4 pb-4">
        <Link href={"/admin/place-order/new"}>
          <Button
            title="Place order"
            className="bg-primary hover:bg-green-900 hover:shadow-lg transition-all duration-300 text-white"
            type="primary"
          />
        </Link>
        <GeneratePDF
          html={ref}
          // disabled={disabled}
          onClick={() => jsxToPng(null)}
        />
        <ReactToPrint
          bodyClass="print-agreement"
          content={() => ref.current}
          trigger={() => (
            <Button
              title="Print Invoice"
              className="bg-primary hover:bg-green-900 hover:shadow-lg transition-all duration-300 text-white"
              type="primary"
            />
          )}
        />
        <GenerateStick html={ref} />
      </div>
      <div className="" ref={ref}>
        <div
          className={`bg-white max-w-[1240px] max-h-[1754px] relative`}
          ref={ref}
        >
          <div className="flex flex-col">
            <img
              src="/invoice/saba_head.jpg"
              alt=""
              className="w-3/5 px-10 py-5"
            />
            <img
              src="/invoice/saba_bar.png"
              alt=""
              className=" w-2/3 self-end"
            />
          </div>
          <div className="flex flex-col justify-between px-5 sm:px-10 h-auto font-mono">
            <div>
              <div className="flex justify-between items-center pb-2 pt-1">
                <div className=" sm:pt-1 flex justify-center items-center">
                  <div>
                    <img id="bar_code" ref={inputRef} />
                    <span id="invoiceNo" className="hidden">
                      {id}
                    </span>
                  </div>
                </div>
                <div className="w-96 flex justify-end items-end text-end">
                  <div class="text-lg sm:text-xl font-semibold flex-column gap-1 mt-2">
                    <p>
                      Date:{" "}
                      <span className="font-medium">{singleOrder?.date}</span>
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-bold text-primary">
                        {singleOrder?.status}.
                      </span>
                    </p>
                    <p>
                      Received by:{" "}
                      <span className="font-medium" id="status">
                        {singleOrder?.placeBy}
                      </span>
                    </p>
                    <p>
                      Courier:{" "}
                      <span className="font-medium" id="status">
                        {singleOrder?.customer_details?.courier}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="sm:mb-4">
                <h1 className="text-title text-2xl md:text-2xl font-semibold border-b-2 pb-1">
                  Customer Details:
                </h1>
                <div class="text-lg sm:text-xl font-semibold flex-column gap-1 mt-2">
                  <p className="text-title">
                    Name :{" "}
                    <span className="font-medium">
                      {singleOrder?.customer_details.customer_name}
                    </span>
                  </p>
                  <p className="text-title">
                    Phone :{" "}
                    <span className="font-medium">
                      {singleOrder?.customer_details.phone_number}
                    </span>
                  </p>
                  <p className="text-title">
                    Address :{" "}
                    <span className="font-medium">
                      {singleOrder?.customer_details.customer_address}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h1 className="text-title text-lg sm:text-2xl md:text-4xl font-semibold border-b sm:border-b-2">
                  Order Details:
                </h1>
                <table className="w-full whitespace-nowrap table-auto border">
                  <thead className="text-base font-semibold tracking-wide text-left  uppercase bg-slate-800 border-slate-800 border-2 text-slate-50">
                    <tr>
                      <th className="px-4 py-1 ">SL</th>
                      <th className="px-4 py-1 ">Item</th>
                      <th className="px-4 py-1 ">Category</th>
                      <th className="px-4 py-1 ">Quantity</th>
                      <th className="px-4 py-1 ">Price</th>
                      <th className="px-4 py-1 ">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100 ">
                    <>
                      {singleOrder &&
                        singleOrder.order.map((item, i) => (
                          <tr
                            key={i}
                            className={`${(i + 1) % 2 == 0 && "bg-sub"} px-2`}
                          >
                            <td className="px-4 py-1 font-bold">
                              <span className="text-base">{`0${i + 1}.`}</span>
                            </td>
                            <td className="px-4 py-1 font-medium">
                              <span className="text-base">
                                {item.product_name}
                              </span>
                            </td>

                            <td className="px-4 py-1">
                              <span className="text-base ">
                                {item.child_category}
                              </span>
                            </td>

                            <td className="px-10 py-1">
                              <span className="text-base font-semibold ">
                                {item.quantity}
                                {item.unit}
                              </span>
                            </td>
                            <td className="px-4 py-1">
                              <span className="text-base font-semibold ">
                                {item.sale_price}
                              </span>
                            </td>
                            <td className="px-4 py-1">
                              <span className="text-base font-semibold ">
                                {item.total_price}/-
                              </span>
                            </td>
                          </tr>
                        ))}
                    </>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-between  w-full mt-8">
              <div className="text-slate-500">
                [<span className="text-base font-bold text-primary">Note:</span>{" "}
                <span className="text-slate-500 font-semibold">
                  {singleOrder?.customer_details?.note}]
                </span>
              </div>
              <div className="flex flex-col w-2/3 sm:w-1/2 border-t-2 text-sm">
                <div className="flex w-full px-4 justify-between">
                  <h1 className="text-sm sm:text-lg font-mono font-medium">
                    Sub-Total:
                  </h1>
                  <h1
                    id="subTotal"
                    className="text-sm sm:text-xl text-title font-mono"
                  >
                    {singleOrder?.totalPrice}/-
                  </h1>
                </div>
                <div className="flex w-full px-4  justify-between">
                  <h1 className="text-sm sm:text-xl font-mono ">Delivery: </h1>
                  <h1
                    id="shipping_type"
                    className="text-sm sm:text-lg md:text-xl text-title font-mono"
                  >
                    {singleOrder?.customer_details?.delivery_type
                      ? "Point"
                      : "Home"}
                  </h1>
                  <h1
                    id="shipping_cost"
                    className="text-sm sm:text-xl text-title font-mono"
                  >
                    {singleOrder?.deliveryCrg
                      ? singleOrder?.deliveryCrg
                      : "150"}
                    /-
                  </h1>
                </div>
                <div className="flex w-full px-4 justify-between">
                  <h1 className="text-sm sm:text-xl font-mono ">Discount: </h1>
                  <h1
                    id="discount"
                    className="text-sm sm:text-xl text-title font-mono"
                  >
                    -{singleOrder?.discount}/-
                  </h1>
                </div>
                <div className="flex w-full px-4 justify-between">
                  <h1 className="text-sm sm:text-xl font-mono ">Paid: </h1>
                  <h1
                    id="discount"
                    className="text-sm sm:text-xl text-title font-mono"
                  >
                    -{singleOrder?.customer_details?.paidAmount}/-
                  </h1>
                </div>
                <div className="flex w-full px-4 py-1 justify-between rounded-sm bg-sub">
                  <h1 className="text-sm sm:text-xl font-mono font-bold">
                    Total Due:{" "}
                  </h1>
                  <h1
                    id="total"
                    className="text-sm sm:text-xl font-bold text-primary font-mono"
                  >
                    {singleOrder?.dueAmount}.00/-
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img src="/invoice/saba_bottom.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
