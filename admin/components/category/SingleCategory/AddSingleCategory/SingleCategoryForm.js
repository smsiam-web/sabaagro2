import { FormInput } from "@/admin/components/shared/Form";
import React, { useState } from "react";

const SingleCategoryForm = ({ uid }) => {
  return (
    <div className="max-h-full">
      <div>
        <span className="lable">Parent Category Title</span>
        <FormInput
          disabled
          name="parent_category_title"
          placeholder="Parent Category"
        />
      </div>
      <div>
        <span className="lable">Child Category Title</span>
        <FormInput
          name="child_category_title"
          placeholder="Select child category"
        />
      </div>
      <div>
        <span className="lable">Child Category Path</span>
        <FormInput name="child_category_path" placeholder="link" />
      </div>
      <div>
        <span className="lable">Parent Uid</span>
        <FormInput
          name="parent_category_uid"
          disabled
          placeholder="Select type"
        />
      </div>
    </div>
  );
};

export default SingleCategoryForm;
