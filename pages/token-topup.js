import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";

export default function TokenTopup() {
  const handleClick = async () => {
    const response = await fetch('/api/addTokens', {
      method: 'POST',
    })
    // const data = await response.json()
    // console.log("data", data);
  }


    // const data = await response.json()
    // console.log("data", data.post.postContent);
  return (
    <div>
      <h1>This is the Token Top Up page</h1>
      <button className="btn" onClick={handleClick}>Add Tokens</button>
    </div>
  )
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired (() => {
  return {
    props: {},
  };
})