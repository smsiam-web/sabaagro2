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
import { FaPlusCircle } from "react-icons/fa";

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

  return (
    <div className="max-w-[1240px] max-h-[1754px]">
      <div className="flex gap-2 justify-end pb-2 sm:pb-4 pr-2 sm:pr-5">
        <Link href={"/admin/place-order/new"}>
          <Button
            icon={<FaPlusCircle />}
            title="Place"
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
              title="Print"
              className="bg-primary hover:bg-green-900 hover:shadow-lg transition-all duration-300 text-white"
              type="primary"
            />
          )}
        />
        {/* <GenerateStick html={ref} /> */}
      </div>
      <div className="w-full relative aspect-[1/1.414] bg-white" ref={ref}>
        <div>
          <div ref={ref}>
            <div className="flex flex-col w-full gap-2">
              <img
                src="/invoice/saba_head.jpg"
                alt=""
                className="w-3/5 pl-4 pt-2 sm:pl-8 sm:pt-6 sm:pb-2"
              />
              <img
                src="/invoice/saba_bar.png"
                alt=""
                className="w-2/3 self-end"
              />
            </div>
            <div className="px-4 sm:px-10 font-mono">
              <div>
                <div className="flex justify-between items-center pb-1 sm:pb-2 sm:pt-1">
                  <div className="w-1/2">
                    <img id="bar_code" className="w-full" ref={inputRef} />
                    <span id="invoiceNo" className="hidden">
                      {id}
                    </span>
                  </div>
                  <div className="w-full flex justify-end items-end text-end">
                    <div class="text-xs sm:text-xl lg:text-2xl font-semibold flex-column gap-1 mt-2">
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
                  <h1 className="text-title text-md md:text-2xl font-semibold border-b sm:border-b-2 sm:pb-1">
                    Customer Details:
                  </h1>
                  <div class="text-sm sm:text-xl md:text-2xl font-semibold flex-column sm:gap-1 sm:mt-2">
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
                  <h1 className="text-title text-md sm:text-2xl md:text-3xl font-semibold border-b sm:border-b-2">
                    Order Details:
                  </h1>
                  <table className="w-full whitespace-nowrap table-auto border border-gray-100">
                    <thead className="text-xs sm:text-base font-semibold tracking-wide text-left  uppercase bg-zinc-800 border-slate-800 border text-slate-50">
                      <tr>
                        <th className="px-2 sm:px-4 sm:py-1">SL</th>
                        <th className="px-2 sm:px-4 sm:py-1">Item</th>
                        <th className="px-2 sm:px-4 sm:py-1 capitalize">
                          Cate
                        </th>
                        <th className="px-2 sm:px-4 sm:py-1">QTY</th>
                        <th className="px-2 sm:px-4 sm:py-1">Price</th>
                        <th className="px-2 sm:px-4 sm:py-1">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      <>
                        {singleOrder &&
                          singleOrder.order.map((item, i) => (
                            <tr
                              key={i}
                              className={`${(i + 1) % 2 == 0 && "bg-sub"} px-2`}
                            >
                              <td className="px-2 sm:px-4 sm:py-1 font-medium">
                                <span className="text-xs sm:text-base">{`0${
                                  i + 1
                                }.`}</span>
                              </td>
                              <td className="px-2 sm:px-4 sm:py-1 font-medium">
                                <span className="text-xs sm:text-base">
                                  {item.product_name}
                                </span>
                              </td>

                              <td className="px-2 sm:px-4 sm:py-1 font-medium">
                                <span className="text-xs sm:text-base">
                                  {item.child_category}
                                </span>
                              </td>

                              <td className="px-2 sm:px-4 sm:py-1">
                                <span className="text-xs sm:text-base font-semibold">
                                  {item.quantity}
                                  {item.unit}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 sm:py-1">
                                <span className="text-xs sm:text-base font-semibold">
                                  {item.sale_price}
                                </span>
                              </td>
                              <td className="px-2 sm:px-4 sm:py-1">
                                <span className="text-xs sm:text-base font-semibold">
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
            </div>
          </div>
          <div className="absolute bottom-0 flex flex-col gap-5">
            <div className="flex justify-between px-4 sm:px-10 w-full mt-8">
              <div className="text-xs sm:text-xl lg:text-2xl  text-slate-500">
                [<span className="font-bold text-primary">Note:</span>{" "}
                <span className="text-slate-500 font-semibold">
                  {singleOrder?.customer_details?.note}]
                </span>
              </div>
              <div className="flex flex-col w-1/2 border-t sm:border-t-2 text-xs sm:text-xl lg:text-2xl">
                <div className="flex w-full px-4 justify-between">
                  <h1 className="font-mono font-medium">Sub-Total:</h1>
                  <h1 id="subTotal" className="text-title font-mono">
                    {singleOrder?.totalPrice}/-
                  </h1>
                </div>
                <div className="flex w-full px-4  justify-between">
                  <h1 className="font-mono ">Delivery: </h1>
                  <h1 id="shipping_type" className="text-title font-mono">
                    {singleOrder?.customer_details?.delivery_type
                      ? "Point"
                      : "Home"}
                  </h1>
                  <h1 id="shipping_cost" className="text-title font-mono">
                    {singleOrder?.deliveryCrg ? singleOrder?.deliveryCrg : "0"}
                    /-
                  </h1>
                </div>
                <div className="flex w-full px-4 justify-between">
                  <h1 className="text-sm sm:text-xl font-mono ">Discount: </h1>
                  <h1 id="discount" className="text-title font-mono">
                    -{singleOrder?.discount}/-
                  </h1>
                </div>
                <div className="flex w-full px-4 justify-between">
                  <h1 className="font-mono ">Paid: </h1>
                  <h1 id="discount" className=" text-title font-mono">
                    -{singleOrder?.customer_details?.paidAmount}/-
                  </h1>
                </div>
                <div className="flex w-full px-4 py-1 justify-between rounded-sm bg-sub">
                  <h1 className="font-mono font-bold">Total Due: </h1>
                  <h1 id="total" className="font-bold text-primary font-mono">
                    {singleOrder?.dueAmount}.00/-
                  </h1>
                </div>
              </div>
            </div>
            <div>
              <img src="/invoice/saba_bottom.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
