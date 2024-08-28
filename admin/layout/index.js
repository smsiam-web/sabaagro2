import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import styles from "./styles/Body.module.css";

const AdminWrapper = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(true);

  return (
    <div
      className={
        styles.body + " sm:ml-[20px] sm:mr-[20px] sm:mb-[20px] " + styles.light
      }
    >
      <Navbar setSidebarActive={setSidebarActive} />
      <div className={styles.content_wrapper}>
        {sidebarActive && <Sidebar setSidebarActive={setSidebarActive} />}
        <div className={styles.body_content}>
          <div className="w-full mx-auto md:p-5 p-3">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminWrapper;
