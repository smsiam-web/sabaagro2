import React, { useEffect, useState } from "react";
import OrderDetailsForm from "./OrderDetailsForm";
import * as Yup from "yup";
import { AppForm, FormBtn } from "../../shared/Form";
import { db, timestamp } from "@/app/utils/firebase";
import Button from "../../shared/Button";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/app/redux/slices/authSlice";
import { ToDateTimeString, Today } from "@/admin/utils/helpers";
import { selectConfig } from "@/app/redux/slices/configSlice";
import axios from "axios";
import Link from "next/link";
import {
  selectSelectedProduct,
  updateSelectedProduct,
} from "@/app/redux/slices/selectedProductForPlaceOrderSlice";

const validationSchema = Yup.object().shape({
  delivery_type: Yup.boolean().required().label("Delivery type"),
  phone_number: Yup.string()
    .matches(/^[0-9]{11}$/, "Must be exactly 11 digits")
    .required()
    .label("Phone number"),
  customer_name: Yup.string().max(50).required().label("Name"),
  customer_address: Yup.string().max(300).required().label("Address"),
  salePrice: Yup.number().required().label("Sale Price"),
  deliveryCharge: Yup.number().required().label("Delivery Charge"),
  paidAmount: Yup.number().required().label("Paid Amount"),
  courier: Yup.string().required().label("Note"),
  note: Yup.string().max(500).label("Note"),
});

const AddOrder = ({ onClick }) => {
  const [config, setConfig] = useState(useSelector(selectConfig) || null);
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const router = useRouter();
  const [uid, setInvoiceID] = useState(null);
  const dispatch = useDispatch();

  // // Function to place an order
  // const placeOrderStf = async (orderData) => {
  //   try {
  //     // Set your API key and secret key
  //     const apiKey = config[0]?.values.sfc_api_key;
  //     const secretKey = config[0]?.values.sfc_secret_key;

  //     // Prepare headers for the request
  //     const headers = new Headers();
  //     headers.append("Api-Key", apiKey);
  //     headers.append("Secret-Key", secretKey);
  //     headers.append("Content-Type", "application/json");

  //     // Make the POST request
  //     const response = await fetch('https://portal.steadfast.com.bd/api/v1/create_order', {
  //       method: 'POST',
  //       headers: headers,
  //       body: JSON.stringify(orderData),
  //     });

  //     // Handle the response
  //     const data = await response.json();
  //     return(data);

  //     // You can update the state or perform other actions based on the response
  //     // For example, if using React with state:
  //     // setOrderResponse(data);
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //   }
  // };

  // Get products from firebase database
  useEffect(() => {
    const unSub = db.collection("orderID").onSnapshot((snap) => {
      snap.docs.map((doc) => {
        setInvoiceID(doc.data());
      });
    });

    return () => {
      unSub();
    };
  }, []);
  const order = useSelector(selectSelectedProduct);

  // place product handler on submit
  const placeOrder = async (values) => {
    setLoading(true);
    const invoice_id = Number(uid?.invoice_id) + 1;
    const invoice_str = `SA0${invoice_id}`;
    const cusetomer_id = `SAC0${invoice_id}`;
    await updateInvoiceID(invoice_id);

    let totalPrice = 0;
    let quantity = 0;

    order &&
      order.map((p) => {
        quantity += p.quantity;
        totalPrice += p.total_price;
      });

    const deliveryCrg = values?.deliveryCharge;

    const discount = totalPrice - values.salePrice;

    const dueAmount = values?.salePrice + deliveryCrg - values?.paidAmount;

    const date = ToDateTimeString();

    console.log(values);

    // try {
    //   // Set your API key and secret key
    //   const apiKey = config[0]?.values.sfc_api_key;
    //   const secretKey = config[0]?.values.sfc_secret_key;

    //   // Prepare headers for the request
    //   const headers = new Headers();
    //   headers.append("Api-Key", apiKey);
    //   headers.append("Secret-Key", secretKey);
    //   headers.append("Content-Type", "application/json");

    //   const orderData = {
    //     cod_amount: `${values.salePrice}`,
    //     invoice: `${invoice_str}`,
    //     note: `${values.note}`,
    //     recipient_address: `${values.customer_address}`,
    //     recipient_name: `${values.customer_name}`,
    //     recipient_phone: `${values.phone_number}`,
    //   };

    //   // Make the POST request
    //   const response = await fetch(
    //     "https://portal.steadfast.com.bd/api/v1/create_order",
    //     {
    //       method: "POST",
    //       headers: headers,
    //       body: JSON.stringify(orderData),
    //     }
    //   );

    //   // Handle the response
    //   const data = await response.json();
    //   console.log(data);
    //   await placeOrderHandler(
    //     data,
    //     deliveryCrg,
    //     weight,
    //     values,
    //     discount,
    //     totalPrice,
    //     date,
    //     order,
    //     invoice_str,
    //     timestamp
    //   );
    //   await sendConfirmationMsg(
    //     values,
    //     invoice_str,
    //     data?.consignment.tracking_code,
    //   );

    //   // You can update the state or perform other actions based on the response
    //   // For example, if using React with state:
    // } catch (error) {

    await isFailedPlaceOrderHandler(
      dueAmount,
      deliveryCrg,
      quantity,
      values,
      discount,
      totalPrice,
      date,
      order,
      invoice_str,
      timestamp
    );
    await sendConfirmationMsg(values, invoice_str, dueAmount);

    //   console.error("Error placing order:", error);
    // }

    await createCustomer(values, date, cusetomer_id, timestamp);

    router.push("/admin/place-order/id=" + invoice_str);
    setLoading(false);
    dispatch(updateSelectedProduct([]));
  };

  const sendConfirmationMsg = async (
    values,
    invoice_str,
    dueAmount,
    tracking_code = ""
  ) => {
    const customer_name = values?.customer_name || "Customer";
    const company_name = config[0]?.values.company_name;
    const company_contact = config[0]?.values.company_contact;

    const url = "https://api.sms.net.bd/sendsms";
    const apiKey = config[0]?.values.bulk_auth;
    const message = `Dear ${customer_name}, Your order has been successfully placed at ${company_name}. Invoice No: ${invoice_str}. Please keep BDT: ${dueAmount}tk ready while receiving the parcel.${
      tracking_code &&
      ` Track your Parcel here: https://steadfast.com.bd/t/${tracking_code}`
    } Hotline: +88${company_contact}. Thanks for being with us.`;
    const to = values?.phone_number;

    const formData = new FormData();
    formData.append("api_key", apiKey);
    formData.append("msg", message);
    formData.append("to", to);

    axios
      .post(url, formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
  // create Customer on firebase database
  const createCustomer = async (values, date, cusetomer_id, timestamp) => {
    await db.collection("createCustomer").doc(values.phone_number).set({
      cus_name: values.customer_name,
      cus_contact: values.phone_number,
      cus_address: values.customer_address,
      date,
      cusetomer_id,
      timestamp,
    });
  };

  // save order details on firebase database
  const placeOrderHandler = async (
    data,
    deliveryCrg,
    quantity,
    values,
    discount,
    totalPrice,
    date,
    order,
    invoice_str,
    timestamp
  ) => {
    await db.collection("placeOrder").doc(invoice_str).set({
      consignment_id: data?.consignment.consignment_id,
      tracking_code: data?.consignment.tracking_code,
      deliveryCrg,
      quantity,
      customer_details: values,
      discount,
      totalPrice,
      date,
      order,
      timestamp,
      placeBy: user.name,
      placeById: user.staff_id,
      status: "Pending",
    });
  };

  const isFailedPlaceOrderHandler = async (
    dueAmount,
    deliveryCrg,
    quantity,
    values,
    discount,
    totalPrice,
    date,
    order,
    invoice_str,
    timestamp
  ) => {
    console.log({
      dueAmount,
      deliveryCrg,
      quantity,
      customer_details: values,
      discount,
      totalPrice,
      date,
      order,
      timestamp,
      placeBy: user.name,
      placeById: user.staff_id,
      status: "Pending",
    });

    await db.collection("placeOrder").doc(invoice_str).set({
      dueAmount,
      deliveryCrg,
      quantity,
      customer_details: values,
      discount,
      totalPrice,
      date,
      order,
      timestamp,
      placeBy: user.name,
      placeById: user.staff_id,
      status: "Pending",
    });
  };

  const updateInvoiceID = async (invoice_id) => {
    await db
      .collection("orderID")
      .doc("LiJLS9p0IzqIB18zPTJm")
      .set({ invoice_id });
  };

  return (
    <main>
      <div>
        <h1 className="mb-3 text-lg font-bold text-gray-700 ">Add Order</h1>
        <AppForm
          initialValues={{
            delivery_type: true || "",
            phone_number: "",
            customer_name: "",
            customer_address: "",
            salePrice: "",
            deliveryCharge: "",
            paidAmount: "",
            courier: "Sundorbon" || "",
            note: "",
          }}
          onSubmit={placeOrder}
          validationSchema={validationSchema}
        >
          <div className="bg-white rounded-lg">
            <div className="w-full py-3 px-6 md:px-4 mb-4">
              <OrderDetailsForm />
              <div className="w-full flex justify-end">
                <div className="grid w-full sm:w-2/3 grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Link href={"/admin/place-order"}>
                      <Button
                        title="Cancel"
                        className="bg-orange-400 w-full hover:bg-orange-500 hover:shadow-lg text-white transition-all duration-300"
                      />
                    </Link>
                  </div>
                  <div className="col-span-1">
                    <FormBtn
                      loading={loading}
                      onClick={placeOrder}
                      title="Submit"
                      className="bg-blue-400 w-full hover:bg-blue-500 hover:shadow-lg text-white transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppForm>
      </div>
    </main>
  );
};

export default AddOrder;
