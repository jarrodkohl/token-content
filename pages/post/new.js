import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";

export default function NewPost(props) {
  console.log("props", props);
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [postContent, setPostContent] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ topic, keywords })
    })
    const data = await response.json()
    console.log("data", data.post.postContent);
    setPostContent(data.post)
    console.log("postContent", postContent);
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
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
          />
        </div>

      <button type="submit" className="btn">
        Generate</button>

      </form>
      <p>Topic: {topic} </p>
      <p>Keywords: {keywords} </p>
      <p className="callout">Post Content: {postContent} </p>
    </div>
  )
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired (() => {
  return {
    props: {},
  };
})