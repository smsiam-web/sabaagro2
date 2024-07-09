import React, { useState, useEffect } from "react";
import { AppTextArea, FormDropdown, FormInput } from "../../shared/Form";
import { PTYPE, TCATEGORY } from "@/admin/configs";
import FileUpload from "../../shared/FileUP";
import { useSelector } from "react-redux";
import { selectCategory } from "@/app/redux/slices/categorySlice";
import { selectChildCategory } from "@/app/redux/slices/childCategorySlice";

const ProductDetailsFrom = ({ id, urls }) => {
  const [childCategory, setChildCategory] = useState();
  const Category = useSelector(selectCategory);
  const ChildCategory = useSelector(selectChildCategory);

  useEffect(() => {
    setChildCategory(ChildCategory);
  }, [ChildCategory]);

  const CATEGORY = [];
  Category.map((i) => {
    const cat = {
      uid: i?.category_uid,
      name: i?.category_title,
      id: i?.category_title,
      path: i?.category_path,
    };

    i.isPublished && CATEGORY.push(cat);
  });

  return (
    <div className="max-h-full">
      <div>
        <label className="block text-gray-500 font-medium text-sm leading-none mb-2">
          Photo
        </label>
        <FileUpload urls={urls} fileLocation={"products"} passUrl />
      </div>
      <div>
        <span>Product SKU</span>
        <FormInput name="sku" placeholder="Product SKU" />
      </div>
      <div>
        <span>Product Title/Name</span>
        <FormInput name="product_name" placeholder="Product title" />
      </div>
      <div>
        <span>Product Slug</span>
        <FormInput name="slug" placeholder="(২০০-৩০০) গ্রাম" />
      </div>
      <div>
        <span>Product Description</span>
        <AppTextArea name="product_description" placeholder="Product details" />
      </div>
      <div>
        <span>Parent Category</span>
        <FormDropdown
          name="parent_category"
          placeholder="Select parent category"
          items={CATEGORY}
        />
      </div>
      <div>
        <span>Child Category</span>
        <FormDropdown
          name="child_category"
          placeholder="Select child category"
          items={childCategory}
        />
      </div>
      <div>
        <span>Product Type</span>
        <FormDropdown
          name="product_type"
          placeholder="Select type"
          items={PTYPE}
        />
      </div>

      <div>
        <span>Unit (kg/pc/lb/ml/g...etc)</span>
        <FormInput name="unit" placeholder="Unit" />
      </div>
      <div>
        <span>Stock</span>
        <FormInput name="stock" placeholder="Quantity" />
      </div>
      <div>
        <span>Product Price</span>
        <FormInput name="price" placeholder="Price" />
      </div>
      <div>
        <span>Sale Price</span>
        <FormInput name="sale_price" placeholder="Sale price" />
      </div>
      <div className="">
        <span>Product Tag</span>
        <FormInput
          name="product_tag"
          placeholder="Product Tag (Write then press enter to add another new tag)"
        />
      </div>
    </div>
  );
};

export default ProductDetailsFrom;
