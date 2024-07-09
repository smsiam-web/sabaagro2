import React, { useEffect, useState } from "react";
import ProductDetailsFrom from "./ProductDetailsFrom";
import * as Yup from "yup";
import { AppForm, FormBtn } from "../../shared/Form";
import { uuid } from "../../../utils/helpers";
import FormHeader from "../../shared/FormHeader";
import { db, timestamp } from "@/app/utils/firebase";
import Button from "../../shared/Button";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectProductImg,
  updateProductImg,
} from "@/app/redux/slices/updateProductImg";
import { updateChildCategory } from "@/app/redux/slices/childCategorySlice";
import { selectCategory } from "@/app/redux/slices/categorySlice";
import { updateProductId } from "@/app/redux/slices/updateProductId";

const validationSchema = Yup.object().shape({
  sku: Yup.string().required().label("Product SKU"),
  product_name: Yup.string().max(200).required().label("Product Title"),
  slug: Yup.string().required().label("২০০-৩০০"),
  product_description: Yup.string().required().label("Product details"),
  parent_category: Yup.string().required().label("Select parent category"),
  child_category: Yup.string().required().label("Select child category"),
  product_type: Yup.string().required().label("Select type"),
  unit: Yup.string().required().label("Unit"),
  stock: Yup.number().required().label("Quantity"),
  price: Yup.number().required().label("Price"),
  sale_price: Yup.number().label("Sale price"),
  product_tag: Yup.string().required().label("Product Tag"),
});

const AddProduts = ({ onClick, item }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const productImg = useSelector(selectProductImg);
  const category = useSelector(selectCategory);

  const placeHandeler = async (values) => {
    setLoading(true);
    // offer calC
    const price = parseInt(values.price);
    const sale_price = parseInt(values.sale_price);
    const off = ((price - sale_price) / price) * 100;
    const off_price = Math.round(off);
    const id = !!item ? item?.id : uuid();
    const img = !!productImg?.length ? productImg[0] : item?.productImg;

    !!item
      ? await updateProductHandler(values, id, off_price, img)
      : placeProductHandler(values, id, off_price, img);
    dispatch(updateProductImg([]));
    dispatch(updateProductId([]));
    router.push("/admin/products/id=" + id);
    setLoading(false);
  };

  // save order details on firebase database
  const updateProductHandler = async (values, id, off_price, img) => {
    await db.collection("products").doc(id).set({
      productImg: img,
      product_details: values,
      isPublished: false,
      off_price,
      last_update: timestamp,
      timestamp: item?.timestamp,
    });
  };
  // save order details on firebase database
  const placeProductHandler = async (values, id, off_price, img) => {
    await db.collection("products").doc(id).set({
      productImg: img,
      product_details: values,
      isPublished: false,
      off_price,
      timestamp,
    });
  };

  const uid = category?.filter((i) => {
    if (i.category_title !== item?.product_details?.parent_category) return;
    return i.id;
  });

  console.log(uid[0]?.id);

  useEffect(() => {
    uid[0]?.id &&
      db
        .collection("category")
        .doc("childCategory")
        .collection(uid[0]?.id)
        .orderBy("timestamp", "asc")
        .onSnapshot((snap) => {
          const childCategory = [];
          snap.docs.map((doc) => {
            doc.data().isPublished &&
              childCategory.push({
                ...doc.data(),
              });
          });
          dispatch(updateChildCategory(childCategory));
        });
  }, [uid]);

  return (
    <main>
      <div>
        <AppForm
          initialValues={{
            sku: item?.product_details?.sku || "",
            product_name: item?.product_details?.product_name || "",
            slug: item?.product_details?.slug || "",
            product_description:
              item?.product_details?.product_description || "",
            parent_category: item?.product_details?.parent_category || "",
            child_category: item?.product_details?.child_category || "",
            product_type: item?.product_details?.product_type || "",
            unit: item?.product_details?.unit || "",
            stock: item?.product_details?.stock || "",
            price: item?.product_details?.price || "",
            sale_price: item?.product_details?.sale_price || "",
            product_tag: item?.product_details?.product_tag || "",
          }}
          onSubmit={placeHandeler}
          validationSchema={validationSchema}
        >
          <div className="h-screen relative">
            <div className="w-full">
              <FormHeader
                onClick={onClick}
                title={!!item ? "Update Product" : "Add Product"}
                sub_title={`${
                  !!item ? "Update" : "Add"
                } your product and necessary information from here.`}
              />
            </div>

            <div className="w-full h-[75%] md:h-[80%] overflow-y-scroll py-3 px-6 md:px-4 mb-4">
              <ProductDetailsFrom
                urls={!!item && item?.productImg}
                id={!!item && item?.id}
              />
            </div>

            <div className="fixed bottom-0 right-0 w-full bg-gray-50">
              <div className="py-5 px-6 md:px-4 max-h-full grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Button
                    onClick={onClick}
                    title="Cancel"
                    className="bg-red-100 hover:bg-red-200 hover:shadow-lg text-red-600 transition-all duration-300 w-full"
                  />
                </div>
                <div className="col-span-2">
                  <FormBtn
                    loading={loading}
                    onClick={placeHandeler}
                    title={!!item ? "Update" : "Add Product"}
                    className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg text-white transition-all duration-300 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </AppForm>
      </div>
    </main>
  );
};

export default AddProduts;
