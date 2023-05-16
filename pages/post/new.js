import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

export default function NewPost(props) {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [postContent, setPostContent] = useState("")
  const [loading, setIsLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch("/api/generatePost", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ topic, keywords })
      })
      const data = await response.json()
      setPostContent(data.post)
      if(data?.postId) {
        router.push(`/post/${data.postId}`)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  return (
    <div className="h-full overflow-hidden">
      {!!loading && (
      <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
        <FontAwesomeIcon icon={faBrain} />
        <h6>Generating...</h6>
      </div>
      )}
      {!loading && (
      <div className="w-full h-full flex flex-col overflow-auto">
        <form onSubmit={handleSubmit} className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
        <div>
          <label>
            <strong>
              Generate a LinkedIn Post on the topic of:
            </strong>
          </label>
          <textarea 
          className="resize-none border-slate-500 w-full block my-2 px-4 px-2 rounded-sm"
          value={topic} 
          onChange={(e) => setTopic(e.target.value)}
          maxLength={150}
          />
        </div>
        <div>
        <label>
            <strong>
              Targeting the following keywords:
            </strong>
          </label>
          <textarea
          className="resize-none border-slate-500 w-full block my-2 px-4 px-2 rounded-sm" 
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          maxLength={150}
          />
          <small className="block mb-2">
            separate keywords with commas
          </small>
        </div>
      <button type="submit" 
      className="btn"
      disabled={!topic.trim() || !keywords.trim()}
      >
        Generate</button>
      </form>
      </div>
      )}
    </div>
  )
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired ({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
})