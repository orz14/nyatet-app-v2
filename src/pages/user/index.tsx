import Layout from "@/components/layouts/dashboard/layout";
import MetaTag from "@/components/MetaTag";

export default function UserIndexPage() {
  return (
    <>
      <MetaTag title={"User"} />

      <Layout>
        <div className="">Hello World</div>
      </Layout>
    </>
  );
}
