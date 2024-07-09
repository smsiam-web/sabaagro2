import { updateAddId } from "@/app/redux/slices/filterId";
import { useFormikContext } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./FormDropdown.module.css";
import { ScrollArea, Collapse } from "@mantine/core";
import { updateChildCategory } from "@/app/redux/slices/childCategorySlice";
import { db } from "@/app/utils/firebase";

function FormDropdown({
  items,
  name,
  placeholder,
  key = "name",
  label = "name",
}) {
  const { setFieldTouched, setFieldValue, errors, touched, values } =
    useFormikContext();
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(values[name]);

  const toggleDropdown = () => setOpen(!isOpen);
  const dispatch = useDispatch();

  const updateChild = async (uid) => {
    await db
      .collection("category")
      .doc("childCategory")
      .collection(uid)
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
  };

  const handleItemClick = (id, v, uid) => {
    switch (name) {
      case "state":
        dispatch(updateAddId({ name: "division", id: id }));
        break;
      case "parent_category":
        updateChild(uid);
        break;
      case "city":
        dispatch(updateAddId({ name: "city", id: id }));
        break;
      case "upazila":
        dispatch(updateAddId({ name: "upazila", id: id }));
        break;
      default:
        dispatch(updateAddId([]));
    }
    setFieldTouched(name);
    selectedItem === id ? setSelectedItem(null) : setSelectedItem(id);
    toggleDropdown();
    setFieldValue(name, id);
  };

  return (
    <>
      <div className={`${styles.formDropdown} mt-2 mb-5 `}>
        <div className={`${styles.dropdown} relative`}>
          <div className={styles.dropdown_header} onClick={toggleDropdown}>
            {selectedItem
              ? items?.find((item) => item.id === selectedItem)?.[label]
              : placeholder}

            <img
              className={`${styles.icon} ${isOpen && styles.open}`}
              src="/sabaagro_logo.jpg"
              loading="lazy"
              alt=""
              width={13}
            />
          </div>
          <Collapse
            in={isOpen}
            className="absolute bg-white border z-50 w-full text-slate-500"
          >
            {items && (
              <ScrollArea h={220} type="scroll" offsetScrollbars>
                <div>
                  {items &&
                    items?.map((item) => (
                      <div
                        key={item.id}
                        className="justify-between py-2 pl-4 transition-colors duration-150 hover:bg-gray-100 text-gray-500 hover:text-green-500 "
                        onClick={() =>
                          handleItemClick(item.id, item?.value, item?.uid)
                        }
                        id={item[key]}
                      >
                        <span
                          className={`${styles.dropdown_item_dot} ${
                            item[key] === selectedItem && styles.selected
                          }`}
                        >
                          •{" "}
                        </span>
                        {item[label]}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            )}
          </Collapse>
        </div>
      </div>
      {touched[name] && (
        <span className="text-red-400 text-sm">{errors[name]}</span>
      )}
    </>
  );
}

export default FormDropdown;
