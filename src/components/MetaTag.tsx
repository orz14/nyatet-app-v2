import Head from "next/head";

type MetaTagProps = {
  title?: string;
};

export default function MetaTag(props: MetaTagProps) {
  return (
    <Head>
      <title>{props.title ?? "Hah.. Kosong?"}</title>
    </Head>
  );
}
