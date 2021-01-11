import React from "react";

const Layout = ({ sideMenu, children }) => {
  return (
    <>
      <aside>{sideMenu}</aside>
      <main>{children}</main>
    </>
  );
};

export default Layout;
