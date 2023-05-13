// 

import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { AppLayout } from '../../components/AppLayout'

export default function Post() {
  const router = useRouter()
  const { postId } = router.query
  const [post, setPost] = useState(null)

  useEffect(() => {
    if (postId) {
      fetch(`/api/post/${postId}`)
        .then((res) => res.json())
        .then((json) => setPost(json.post))
        .catch((err) => console.log(err))
    }
  }, [postId])

  if (!post) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Post {postId}</h1>
      <p>{post.postContent}</p>
    </div>
  )
  
}
Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired (() => {
  return {
    props: {},
  };
})
