import OrderDetailsForm from "@/admin/components/placeOrder/add_order/OrderDetailsForm";
import { ToDateTimeString } from "@/admin/utils/helpers";
import Button from "@/app/components/shared/Button";
import {
  AppForm,
  AppTextArea,
  FormBtn,
  FormInput,
} from "@/app/components/shared/Form";
import { db, timestamp } from "@/app/utils/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  customer_name: Yup.string().max(50).required().label("Name"),
  phone_number: Yup.string()
    .matches(
      /(^(\+8801|8801|01|008801))[1|3-9]{1}(\d){8}$/,
      "দয়া করে সঠিক নাম্বার দিবেন, ড্যাশ(-) অথবা নাম্বার এর মাঝে স্পেস দেওয়া যাবে না"
    )
    .required()
    .label("Phone number"),
  customer_address: Yup.string().max(300).required().label("Address"),
  note: Yup.string().max(500).label("Note"),
});

const Order = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isDisable, setDisable] = useState(false);
  const dispatch = useDispatch();
  const date = ToDateTimeString();

  const placeOrder = async (values) => {
    setDisable(true);
    setLoading(true);
    await createOrder(values, date, timestamp);
    await setTimeout(() => {
      setLoading(false);
      setDisable(false);
    }, 3000);
    router.push("/sucess");
  };

  // create Customer on firebase database
  const createOrder = async (values, date, timestamp) => {
    await db.collection("newOrder").doc(values.phone_number).set({
      cus_name: values.customer_name,
      cus_contact: values.phone_number,
      cus_address: values.customer_address,
      date,
      timestamp,
      isNew: true,
      orderDetails: "পাঁচটির প্যাকেজ",
    });
  };

  return (
    <main>
      <AppForm
        initialValues={{
          phone_number: "",
          customer_name: "",
          customer_address: "",
          note: "",
        }}
        onSubmit={placeOrder}
        validationSchema={validationSchema}
        className="w-full"
      >
        <div className="bg-white rounded-lg p-8 ">
          <h1 className="text-center font-bold text-black text-lg">
            অর্ডার করতে নিচের ফর্মে আপনার নাম, মোবাইল নং এবং পূর্ণ ঠিকানা লিখুন।
            তারপর নিচে{" "}
            <span className="bg-primary text-white px-3 py-2 text-base rounded-full">
              অর্ডার
            </span>{" "}
            করুন বাটনে ক্লিক করুন। আপনার অর্ডারটি সঠিকভাবে সম্পন্ন হবে।
          </h1>
          <div className="max-h-full max-w-4xl pb-6 ">
            <div>
              <label>Name</label>
              <FormInput name="customer_name" placeholder="আপনার নাম লিখুন " />
            </div>
            <div>
              <label>Phone Number</label>
              <label className="text-sub-title text-sm block pb-1">
                (ইংরেজিতে লিখবেন)
              </label>
              <FormInput
                type="text"
                max={11}
                name="phone_number"
                placeholder="আপনার ফোন নাম্বার লিখুন"
              />
            </div>

            <div>
              <label>Address</label>
              <label className="text-sub-title text-sm block">
                (maximum 300 characters)
              </label>
              <AppTextArea
                name="customer_address"
                placeholder="আপনার ঠিকানা লিখুন"
              />
            </div>
            <div>
              <label>Note</label>
              <label className="text-sub-title text-sm block">
                (maximum 500 characters)
              </label>
              <AppTextArea
                name="note"
                placeholder="আপনার মন্তব্য অথবা চাহিদা গুলো লিখুন"
              />
            </div>
          </div>
          <div className="w-full flex justify-end">
            <div className="grid w-full sm:w-2/3 grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Link href={"/combo/one"}>
                  <Button
                    title="আরও জানতে চাই"
                    className="bg-orange-400 text-lg w-full hover:bg-orange-500 hover:shadow-lg text-white transition-all duration-300"
                  />
                </Link>
              </div>
              <div className="col-span-1">
                <FormBtn
                  disabled={isDisable}
                  loading={loading}
                  onClick={placeOrder}
                  title="আর্ডার করুন"
                  className="hover:shadow-lg text-lg text-black transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </AppForm>
    </main>
  );
};

export default Order;
