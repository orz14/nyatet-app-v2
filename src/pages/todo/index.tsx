import Layout from "@/components/layouts/dashboard/layout";
import MetaTag from "@/components/MetaTag";

export default function TodoIndexPage() {
  return (
    <>
      <MetaTag title={"Todo"} />

      <Layout>
        <div className="">Hello World</div>
      </Layout>
    </>
  );
}
