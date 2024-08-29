import { selectCategory } from "@/app/redux/slices/categorySlice";
import { usePathname } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Group,
  Switch,
  Tooltip,
  useMantineTheme,
  LoadingOverlay,
  Box,
  Modal,
  Drawer,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { CgCheck } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import SearchSingleCategory from "./SearchSingleCategory";
import { db } from "@/app/utils/firebase";
import { updateChildCategory } from "@/app/redux/slices/childCategorySlice";
import Button from "../../shared/Button";
import AddSingleCategory from "./AddSingleCategory";
import ChildCategoryAction from "./ChildAction";

const SingleCAtegory = () => {
  const theme = useMantineTheme();
  const [id, setId] = useState(usePathname()?.split("=")[1]);
  const [opened, { open, close }] = useDisclosure(false);
  const [singleCat, setSingleCat] = useState();
  const [parentCat, setParentCat] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [filterChildCategory, setFilterChildCategory] = useState();
  const Categorys = useSelector(selectCategory);
  const dispatch = useDispatch();

  useEffect(() => {
    Categorys?.map((i) => i.category_uid === id && setParentCat(i));
  }, []);

  const toggleDrawer = (item) => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
    setFilterChildCategory(item);
  };

  const deleteChildCategory = (item) => {
    open();
    setFilterChildCategory(item);
  };

  //after confirmaiton Delete category details from firebase
  const DeleteCategory = async (item) => {
    await db
      .collection("category")
      .doc("childCategory")
      .collection(item?.parent_category_uid)
      .doc(item?.uid)
      .delete()
      .then(() => {
        notifications.show({
          title: "Delete successfully",
          message: `${item.id}, ID: ${item.uid}`,
          color: "orange",
        });
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    close();
    setFilterChildCategory(null);
  };

  const toggleChecked = (id, uid, name) => {
    singleCat?.map((item) => {
      if (item.uid !== uid) return;
      else {
        item.isPublished
          ? UpdatePublishedState(id, uid, name, false)
          : UpdatePublishedState(id, uid, name, true);
      }
    });
  };

  // update published state
  const UpdatePublishedState = async (id, uid, name, values) => {
    const ref = db
      .collection("category")
      .doc("childCategory")
      .collection(id)
      .doc(uid);
    return ref
      .set(
        {
          isPublished: values,
        },
        { merge: true }
      )
      .then(() => {
        values
          ? notifications.show({
              title: "Published successfully",
              message: `${name}, ID: ${uid}`,
              autoClose: 4000,
            })
          : notifications.show({
              title: "Removed successfully",
              message: `${name}, ID: ${uid}`,
              color: "orange",
              autoClose: 4000,
            });
      })
      .catch((error) => {
        notifications.show({
          title: "Somthing went Wrong",
          message: { error },
          color: "red ",
          autoClose: 4000,
        });
        console.log(error);
      });
  };

  id &&
    useEffect(() => {
      const unSub = db
        .collection("category")
        .doc("childCategory")
        .collection(id)
        .orderBy("timestamp", "desc")
        .onSnapshot((snap) => {
          const childCategorys = [];
          snap.docs.map((doc) => {
            childCategorys.push({
              ...doc.data(),
            });
          });
          setSingleCat(childCategorys);
          dispatch(updateChildCategory(childCategorys));
        });
      return () => {
        unSub();
      };
    }, [id]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        zIndex={99999}
        withCloseButton={false}
        size="lg"
        padding={0}
      >
        <div className="px-16 py-12 pb-0 flex flex-col items-center text-center gap-3">
          <span className="text-red-500">
            <RiDeleteBinLine size={50} />
          </span>
          <h1 className="text-2xl text-title">
            Are You Sure! Want to{" "}
            <span className="text-red-500">Delete!!!</span>{" "}
            <span className="text-primary">{filterChildCategory?.name}</span>{" "}
          </h1>
          <p className="text-base pb-6">
            If you delete these records? Then you can't view this in your list
            anymore.!
          </p>
        </div>
        <div className="bg-gray-50 w-full flex items-center justify-center gap-5 py-5">
          <Button
            onClick={close}
            title="No, keep it!"
            className="bg-green-500 outline-none hover:shadow-xl transition-all duration-300 font-normal text-white"
          />
          <Button
            onClick={() => DeleteCategory(filterChildCategory)}
            title="Yes, Delete it!"
            className="text-gray-50 font-normal bg-red-400 hover:bg-red-500 hover:shadow-xl transition-all duration-300"
          />
        </div>
      </Modal>
      <Drawer
        opened={isOpen}
        onClose={close}
        zIndex={9999999}
        withCloseButton={false}
        position="right"
        size="lg"
        padding={0}
      >
        <ChildCategoryAction
          onClick={() => toggleDrawer()}
          item={filterChildCategory}
        />
      </Drawer>
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Single Category</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <Box pos="relative">
            <LoadingOverlay
              visible={!id}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
              loaderProps={{ color: "blue", type: "bars" }}
            />
            <div className="bg-slate-50 text-center px-10 py-6 rounded-2xl ">
              <h1 className="text-2xl font-bold border-b-2 border-gray-400 mb-2 col-start-2">
                {parentCat?.category_title
                  ? parentCat.category_title
                  : "Category Title"}
              </h1>
              <h1 className="text-xl from-slate-600 font-bold">
                {parentCat?.category_uid
                  ? `#${parentCat.category_uid}`
                  : "Category Uid"}
              </h1>
            </div>
          </Box>

          <Box pos="relative">
            <LoadingOverlay
              visible={!parentCat?.category_image}
              loaderProps={{ children: "Loading image..." }}
            />
            <div className="bg-slate-50 rounded-xl flex justify-center">
              {parentCat?.category_image && (
                <Image
                  src={parentCat?.category_image}
                  alt="Picture of the author"
                  width={300}
                  height={300}
                />
              )}
            </div>
          </Box>
        </div>
        <SearchSingleCategory item={parentCat ? parentCat : null} />

        <h1 className="text-xl text-slate-800 md:text-2xl font-bold">
          Child Category
        </h1>

        <div className="grid gap-4 w-full overflow-hidden">
          {/* <h1 className="text-title pb-4 text-2xl font-medium">Recent Order</h1> */}
          <div className="w-full overflow-x-scroll rounded-md">
            <table className="w-full whitespace-nowrap table-auto">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200  bg-gray-100">
                <tr>
                  <td className="px-4 py-3 ">Parent ID</td>
                  <td className="px-4 py-3 ">ID</td>
                  <td className="px-4 py-3 ">PARENT</td>
                  <td className="px-4 py-3 ">CHILDREN</td>
                  <td className="px-4 py-3 ">Product</td>
                  <td className="px-4 py-3 ">Published</td>
                  <td className="px-4 py-3 ">ACTIONS</td>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 ">
                {singleCat &&
                  singleCat?.map((i, index) => (
                    <tr key={index} className="px-4 py-3">
                      <td className="px-4 py-3 font-bold">
                        #
                        {i?.parent_category_uid
                          ? i.parent_category_uid
                          : "Category Title"}
                      </td>
                      <td className="px-4 py-3">#{i?.uid}</td>
                      <td className="px-4 py-3">{i?.parent_category_title}</td>
                      <td className="px-4 py-3">{i?.name}</td>
                      <td className="px-4 py-3">
                        <h1 className="text-base bg-violet-300 w-fit px-2 py-1 rounded-2xl font-bold text-violet-700">
                          23
                        </h1>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold">
                          <Group position="center">
                            <Switch
                              className="cursor-pointer"
                              checked={i.isPublished}
                              onChange={() =>
                                toggleChecked(
                                  i.parent_category_uid,
                                  i.uid,
                                  i.id
                                )
                              }
                              color="teal"
                              size="sm"
                              thumbIcon={
                                i.isPublished ? (
                                  <CgCheck
                                    size="0.8rem"
                                    color={theme.colors.red[6]}
                                    stroke={3}
                                  />
                                ) : (
                                  <RxCross2
                                    size="0.8rem"
                                    color={theme.colors.red[6]}
                                    stroke={3}
                                  />
                                )
                              }
                            />
                          </Group>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold flex justify-start gap-5 text-sub-title items-center">
                          <Tooltip label="Edit" color="blue" withArrow>
                            <span
                              onClick={() => toggleDrawer(i)}
                              className="cursor-pointer hover:text-blue-400"
                            >
                              <FiEdit size={16} />
                            </span>
                          </Tooltip>

                          <Tooltip label="Delete" color="red" withArrow>
                            <span
                              className="cursor-pointer"
                              onClick={() => deleteChildCategory(i)}
                            >
                              <RiDeleteBinLine size={17} />
                            </span>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleCAtegory;
