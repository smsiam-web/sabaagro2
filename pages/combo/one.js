import React, { useState } from "react";
import Image from "next/image";
import Button from "@/admin/components/shared/Button";
import ImageGallery from "react-image-gallery";
import AccordionDepthPanel from "./AccordionDepth";
import { setBackgroundImage } from "@/app/utils/helpers";
import { Details, FandQ, images } from "./data";
import Order from "./Order";
import ProductCard from "./Card";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

const One = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <main
        className="container bg-slate-200 rounded-xl py-2 my-2 flex items-center flex-col"
        style={setBackgroundImage("/images/homepage-bg.jpg")}
      >
        <Modal
          opened={opened}
          onClose={close}
          title="Authentication"
          className="z-50"
        >
          ok
        </Modal>
        <div>
          <h1 className="font-bold text-xl sm:text-2xl lg:text-4xl  text-center bg-white my-4 px-4 py-2 rounded-2xl">
            <span className="text-primary text-2xl sm:text-3xl lg:text-5xl">
              পাঁচটির প্যাকেজে
            </span>{" "}
            যে যে বিদেশী বড় সাইজের আমের মাতৃগাছ পাচ্ছেন তা হলো...
          </h1>
        </div>
        <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-4xl mb-6 shadow-md">
          <ImageGallery
            slideDuration={650}
            showFullscreenButton={false}
            autoPlay={true}
            showPlayButton={false}
            disableSwipe={true}
            items={images}
          />
        </div>
        <div className="mb-8">
          <Button
            onClick={open}
            title="অর্ডার করুন"
            className="bg-green-500 hover:bg-green-600 active:scale-95 active:shadow-md hover:shadow-lg transition-all duration-300 text-white shadow-xl text-lg"
          />
        </div>
        <div className="mb-8">
          <h1 className="font-bold text-xl text-center bg-purple-200 my-4 px-4 py-2 rounded-2xl">
            চারা গাছগুলোর সম্পর্কে আরও বিস্তারিত জানুনঃ
          </h1>
          <AccordionDepthPanel data={Details} />
        </div>
        <div>
          <ProductCard />
        </div>
        <div className="w-full flex items-center flex-col mb-6">
          <h1 className="bg-slate-50 text-center w-fit px-6 py-2 rounded-2xl mb-2 font-bold text-lg">
            ১. বিদেশী কামরাঙা চারা
          </h1>
          <Image
            className="rounded-xl shadow-lg"
            // loader={myLoader}
            src="/pl.jpg"
            alt="Picture of the author"
            width={500}
            height={500}
          />
        </div>
        <div className="mb-8">
          <Button
            onClick={open}
            title="অর্ডার করুন"
            className="bg-green-500 hover:bg-green-600 active:scale-95 active:shadow-md hover:shadow-lg transition-all duration-300 text-white shadow-xl text-lg"
          />
        </div>
        <div className="mb-8">
          <h1 className="font-bold text-xl text-center bg-purple-200 my-4 px-4 py-2 rounded-2xl ">
            আপনাদের কিছু প্রশ্ন এবং তার উত্তর :
          </h1>
          <AccordionDepthPanel data={FandQ} />
        </div>
        <div className="w-full">
          <Order />
        </div>
      </main>
    </>
  );
};

export default One;
