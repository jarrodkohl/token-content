import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";

export default function Post(props) {
  console.log(props)
  return (
    <div>
      <h1>This is a post page</h1>
    </div>
  )
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(async (context) => {
    const userSession = await getSession(context.req, context.res)
    const client = await clientPromise
    const db = await client.db("ContentAgent")
    const userProfile = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    })
    const post = await db.collection("posts").findOne({
      _id: ObjectId(context.params.postId),
      userId: userProfile._id,  // should this be userId: user._id
    })

    if(!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
      }
    }
  }
  return {
    props: {
      postContent: post.postContent,
      title: post.title,
      keywords: post.keywords,
      metaDescription: post.metaDescription,
    }
  }
  }
})


