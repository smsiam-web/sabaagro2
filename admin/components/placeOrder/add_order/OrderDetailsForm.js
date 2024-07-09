import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { useDispatch } from "react-redux";

import {
  AppTextArea,
  FormDropdown,
  FormInput,
  FormRadio,
} from "../../shared/Form";
import { COURIER } from "@/admin/configs";
import { selectProduct } from "@/app/redux/slices/productSlice";
import { useSelector } from "react-redux";
import Button from "../../shared/Button";
import { updateSelectedProduct } from "@/app/redux/slices/selectedProductForPlaceOrderSlice";

const OrderDetailsForm = () => {
  const [products, setProducts] = useState(null);
  const [searchP, setSearchP] = useState(null);
  const [value, setValue] = useState(null);
  const [confirmVal, setConfirmVal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const p = useSelector(selectProduct);
  const dispatch = useDispatch();

  useEffect(() => {
    const Arr = [];
    p?.map((i) => {
      Arr.push({
        sku: i.product_details.sku,
        sale_price: i.product_details.sale_price,
        product_name: i.product_details.product_name,
        unit: i.product_details.unit,
        child_category: i.product_details.child_category,
        id: i.id,
        timestamp: i.timestamp,
        quantity: 1,
      });
    });
    setProducts(Arr);
  }, []);

  function customFilter(objList, text) {
    if (undefined === text || text === "") return objList;
    return objList.filter((product) => {
      let flag;
      for (let prop in product) {
        flag = false;
        flag = product[prop]?.toString().indexOf(text) > -1;
        console.log(product[prop]);
        if (flag) break;
      }
      console.log(flag);
      return flag;
    });
  }

  const removeItem = (i) => {
    const f = [];
    let x = selectedProduct.filter((item) => {
      if (item.id === i.id) return;
      f.push(item);
    });
    setSelectedProduct(f);
    dispatch(updateSelectedProduct(f));
    if (!f.length) setIsActive(true);
  };
  const handelChangeQ = (e) => {
    setQuantity(e.target.value);
  };
  const handelChange = (e) => {
    console.log(e.target.value);
    setValue(e.target.value);
    if (!e.target.value) return setSearchP(null);
    setSearchP(customFilter(products, e.target.value));
  };
  const handelSelect = (i) => {
    open();
    setConfirmVal(i);
  };
  const handelConfirm = () => {
    setValue("");
    let arr = [];
    !!selectedProduct.length && arr.push(...selectedProduct);
    arr.push({
      ...confirmVal,
      quantity: quantity || 1,
      total_price: confirmVal.sale_price * quantity,
    });
    setSelectedProduct(arr);
    dispatch(updateSelectedProduct(arr));
    arr = [];
    setSearchP(null);
    setIsActive(false);
    close();
    setConfirmVal(null);
    setQuantity(1);
  };

  return (
    <div className="max-h-full max-w-4xl">
      <Modal
        opened={opened}
        onClose={close}
        centered={true}
        title="পণ্যর পরিমান নির্বাচন করুন"
      >
        <input
          type="number"
          defaultValue={1}
          placeholder="Quantity"
          className="outline-none border-[1px] py-3 text-sm appearance-none opacity-75 text-title px-5 rounded-md w-full border-gray-200 focus:outline-none
            focus:border-primary transition duration-200
            focus:ring-0 ease-in-out"
          onChange={(e) => handelChangeQ(e)}
        />
        <div className="w-full flex justify-end gap-2 py-4">
          <Button
            title="Cancel"
            onClick={() => close()}
            className="bg-orange-400 w-fit hover:bg-orange-500 hover:shadow-lg text-white transition-all duration-300"
          />
          <Button
            title="Submit"
            onClick={() => handelConfirm()}
            className="bg-blue-400 w-fit hover:bg-blue-500 hover:shadow-lg text-white transition-all duration-300"
          />
        </div>
      </Modal>
      <div className="pb-4">
        <label>Delivery Type:</label>
        <FormRadio
          type="text"
          name="delivery_type"
          forTrue="Point"
          forFalse="Home"
        />
      </div>
      <div>
        <label>Phone Number</label>
        <label className="text-sub-title text-sm block pb-1">
          (Must be Eng. Digit)
        </label>
        <FormInput type="text" max={11} name="phone_number" placeholder="01" />
      </div>
      <div>
        <label>Name</label>
        <FormInput name="customer_name" placeholder="Full Name" />
      </div>
      <div>
        <label>Address</label>
        <label className="text-sub-title text-sm block">
          (maximum 300 characters)
        </label>
        <AppTextArea
          name="customer_address"
          placeholder="Ex: H#12, R#04, Sec# 4, Mirpur Dhaka."
        />
      </div>

      <div className="mt-3">
        <label>Product</label>
        <div className="w-full flex flex-col justify-between">
          {!!selectedProduct?.length && (
            <table className="w-full mb-3 whitespace-nowrap table-auto border">
              <thead className="text-base font-semibold tracking-wide text-left  uppercase bg-slate-800 border-slate-800 border-2 text-slate-50">
                <tr>
                  <th className="px-4 py-1 ">SL</th>
                  <th className="px-4 py-1 ">Item</th>
                  <th className="px-4 py-1 ">Quantity</th>
                  <th className="px-4 py-1 ">Price</th>
                  <th className="px-4 py-1 ">Total</th>
                  <th className="px-4 py-1 ">Remove</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 ">
                {selectedProduct &&
                  selectedProduct?.map((i, index) => (
                    <tr key={index}>
                      <td className="px-4 py-1 font-bold">
                        <span className="text-base">
                          {index + 1 <= 9 ? `0${index + 1}` : index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-1 font-medium">
                        <span className="text-base">{i?.product_name}</span>
                      </td>

                      <td className="px-10 py-1">
                        <span className="text-base font-semibold ">
                          {i?.quantity}
                          {i?.unit}
                        </span>
                      </td>
                      <td className="px-4 py-1">
                        <span className="text-base font-semibold ">
                          {i.sale_price}
                        </span>
                      </td>
                      <td className="px-4 py-1">
                        <span className="text-base font-semibold ">
                          {i.total_price}/-
                        </span>
                      </td>
                      <td className="px-11 py-1">
                        <span
                          className="text-base cursor-pointer hover:text-red-600 font-semibold"
                          onClick={() => removeItem(i)}
                        >
                          X
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          <div>
            {isActive && (
              <input
                type="text"
                id="search"
                value={value}
                className="outline-none border-[1px] py-3 text-sm appearance-none opacity-75 text-title px-5 rounded-md w-full border-gray-200 focus:outline-none
            focus:border-primary transition duration-200
            focus:ring-0 ease-in-out"
                placeholder="Search Product"
                onChange={(e) => handelChange(e)}
              />
            )}
          </div>
        </div>
        {!!searchP && (
          <ul className="origin-top-right absolute right-100 z-50 mt-2 max-w-2/3 rounded-md shadow-lg bg-white p-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {searchP?.map((i) => (
              <li
                key={i?.id}
                className="justify-between cursor-pointer font-serif font-medium py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-green-500 border-b-2 last:border-none"
                onClick={() => handelSelect(i)}
              >
                <span className="flex items-center gap-3 text-sm">
                  <span className="text-black">{i.product_name}</span>
                  <span className="text-primary">( ক্যাটাগরিঃ </span>
                  <span className="text-slate-600">{i.child_category} )</span>
                  <span className="text-primary">দামঃ </span>
                  <span className="text-slate-600 font-sans font-bold">
                    {i.sale_price}/-
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        {!isActive && (
          <div className="flex justify-end py-2">
            <Button
              onClick={() => setIsActive(true)}
              title="Add +"
              className="bg-blue-400 w-fit hover:bg-blue-500 hover:shadow-lg text-white transition-all duration-300"
            />
          </div>
        )}
      </div>

      <div className="mt-3">
        <label>Amount</label>
        <FormInput type="number" name="salePrice" placeholder="Amount" />
      </div>
      <div className="mt-3">
        <label>Delivery Charge</label>
        <FormInput
          type="number"
          name="deliveryCharge"
          placeholder="Delivery Charge"
        />
      </div>
      <div className="mt-3">
        <label>Paid Amount</label>
        <FormInput type="number" name="paidAmount" placeholder="Paid Amount" />
      </div>
      <div>
        <label>Courier Service</label>
        <FormDropdown
          name="courier"
          placeholder="Select Courier Service"
          items={COURIER}
        />
      </div>
      <div>
        <label>Note</label>
        <label className="text-sub-title text-sm block">
          (maximum 500 characters)
        </label>
        <AppTextArea name="note" placeholder="Note..." />
      </div>
    </div>
  );
};

export default OrderDetailsForm;
