import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import basketReducer from "./slices/basketSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import idReducer from "./slices/filterId";
import updateProfile from "./slices/updateProfile";
import updateProductImgReducer from "./slices/updateProductImg";
import updateProductId from "./slices/updateProductId";
import singleProduct from "./slices/singleProduct";
import staffReducer from "./slices/staffSlice";
import configReducer from "./slices/configSlice";
import tempImgReducer from "./slices/tempImgUrl";
import categoryReducer from "./slices/categorySlice";
import singleOrderReducer from "./slices/singleOrderSlice";
import childCategoryReducer from "./slices/childCategorySlice";
import selectedProductForPlaceOrderReducer from "./slices/selectedProductForPlaceOrderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    config: configReducer,
    basket: basketReducer,
    product: productReducer,
    orders: orderReducer,
    staff: staffReducer,
    id: idReducer,
    profile: updateProfile,
    productImg: updateProductImgReducer,
    productId: updateProductId,
    singleProduct,
    tempImgUrl: tempImgReducer,
    category: categoryReducer,
    singleOrder: singleOrderReducer,
    childCategory: childCategoryReducer,
    selectedProduct: selectedProductForPlaceOrderReducer,
  },

  middleware: (curryGetDefaultMiddleware) =>
    curryGetDefaultMiddleware({
      serializableCheck: false,
    }),
});
