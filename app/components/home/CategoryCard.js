import React from "react";
import { motion } from "framer-motion";

const CategoryCard = ({ item }) => {
  return (
    <div className="bg-gray-100 p-10 min-w-[185px] h-[250px] items-stretch rounded-lg  px-5 flex flex-col justify-center text-center animate-duration cursor-pointer hover:card-shadow  hover:bg-gray-50 ">
      <div className="flex min-h-[150px] justify-center items-center">
        <motion.div
          className="w-[120px] drop-shadow-2xl"
          whileHover={{ scale: 1.2 }}
        >
          <img
            src={item?.category_image}
            alt={`${item?.category_title} icon`}
          />
        </motion.div>
      </div>
      <h4 className="text-title pb-4 text-lg font-semibold leading-6 mt-4">
        {item?.category_title}
      </h4>
    </div>
  );
};

export default CategoryCard;
