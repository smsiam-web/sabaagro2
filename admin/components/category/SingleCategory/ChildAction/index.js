import React, { useState } from "react";
import * as Yup from "yup";
import FormHeader from "../../../shared/FormHeader";
import FormFooter from "../../../shared/FormFooter";
import { db } from "@/app/utils/firebase";
import { notifications } from "@mantine/notifications";
import { AppForm } from "@/admin/components/shared/Form";
import SingleCategoryForm from "../AddSingleCategory/SingleCategoryForm";

const validationSchema = Yup.object().shape({
  parent_category_title: Yup.string().required().label("Parent Category Title"),
  child_category_title: Yup.string().required().label("Child Category Title"),
  child_category_path: Yup.string().required().label("Child Category Path"),
  parent_category_uid: Yup.string().label("Select type"),
});

const ChildCategoryAction = ({ onClick, item }) => {
  const [loading, setLoading] = useState(false);
  // place product handler on submit
  const ChildCategoryUpdate = async (values) => {
    setLoading(true);
    const parent_uid = values?.parent_category_uid;
    const child_uid = item?.uid;
    console.log({
      ...item,
      ...values,
      isPublished: false,
    });
    await updateCategoryHandler(item, values, parent_uid, child_uid);
    setLoading(false);
    //for close the tab
    onClick();
    notifications.show({
      title: "Success",
      message: `Category ${values.category_title} Update seccessfully`,
      color: "blue",
      autoClose: 3000,
    });
  };
  // save order details on firebase database
  const updateCategoryHandler = async (item, values, parent_uid, child_uid) => {
    await db
      .collection("category")
      .doc("childCategory")
      .collection(parent_uid)
      .doc(child_uid)
      .set(
        {
          ...item,
          ...values,
          id: values.child_category_title,
          name: values.child_category_title,
          isPublished: false,
        },
        { merge: true }
      );
  };
  return (
    <div>
      {item && (
        <AppForm
          initialValues={{
            parent_category_title: (item && item?.parent_category_title) || "",
            child_category_title: (item && item?.name) || "",
            child_category_path: (item && item?.child_category_path) || "",
            parent_category_uid: (item && item?.parent_category_uid) || "",
          }}
          onSubmit={ChildCategoryUpdate}
          validationSchema={validationSchema}
        >
          {" "}
          <div className="h-screen relative">
            <div className="w-full">
              <FormHeader
                onClick={onClick}
                title="Update Category"
                sub_title={
                  "Update your category and necessary information from here"
                }
              />
            </div>

            <div className="w-full h-[75%] md:h-[80%] overflow-y-scroll py-3 px-6 md:px-4 mb-4">
              <SingleCategoryForm uid={item.category_uid} />
            </div>

            <div className="fixed bottom-0 right-0 w-full bg-gray-50">
              <FormFooter
                title={"Update"}
                onClick={onClick}
                loading={loading}
                acceptBtn={ChildCategoryUpdate}
              />
            </div>
          </div>
        </AppForm>
      )}
    </div>
  );
};

export default ChildCategoryAction;
