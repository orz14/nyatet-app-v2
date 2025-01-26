import Head from "next/head";

type MetaTagProps = {
  title?: string;
};

export default function MetaTag(props: MetaTagProps) {
  return (
    <Head>
      <title>{`${props.title ? props.title + " · " : ""}${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
    </Head>
  );
}
