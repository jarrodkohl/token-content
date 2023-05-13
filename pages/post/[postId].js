import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";

export default function Post(props) {
  console.log(props)
  console.log(props.postContent)
  console.log('post id', props.postId)
  
  

  
  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-slate-100 rounded-sm">
          Your Post Content
        </div>
        <div className="p-2 bg-slate-100 rounded-sm">
          {props.postContent}

        </div>

      </div>
      
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
      _id: ObjectId(context.query.postId),
      userId: userProfile._id,  // should this be userId: user._id
    })
    console.log('context', context.query)
    console.log('post', post)

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
        postId: context.params.postId,
      }
    }
})
