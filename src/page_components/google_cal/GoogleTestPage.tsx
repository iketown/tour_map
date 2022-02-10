import React from "react";
import Layout from "~/layout/Layout";
import GcLoginLogout from "./GC_login_logout";
import GCalHooksTest from "./GCalHooksTest";

const GoogleTestPage: React.FC = () => {
  return (
    <Layout>
      <h3>google test page</h3>
      <GCalHooksTest />
    </Layout>
  );
};

export default GoogleTestPage;
