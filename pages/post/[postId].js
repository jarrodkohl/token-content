// 

import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { AppLayout } from '../../components/AppLayout'
import { getAppProps } from '../../utils/getAppProps'

export default function Post() {
  const router = useRouter()
  const { postId } = router.query
  const [post, setPost] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/deletePost`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      })
      const json = await response.json()
      if (json.success) {
        router.replace('/post/new')
      }
    } catch (error) {
      console.log(error)
    }
  }

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
      <h1>Post</h1>
      <div>
      <p>{post.postContent}</p>
      </div>
      <div className='my-4'>
        {!showDeleteConfirmation && (
          
        <button className='btn bg-red-600 hover:bg-red-300' onClick={() => setShowDeleteConfirmation(true)}>
          Delete Post
        </button>
        )}
        {!!showDeleteConfirmation && (
          <div>
          <p className='p-2 bg-red-200 text-center'>
            Are you sure you want to delete this post? The action is irreversible.
          </p>
          <div className='grid grid-cols-2 gap-2'>
            <button onClick={() => setShowDeleteConfirmation(false)}
            className='btn bg-stone-600 hover:bg-stone-300'> cancel</button>
            <button 
            onClick={() => {handleDeleteConfirm()}}
            className='btn bg-red-600 hover:bg-red-300'> confirm delete</button>
          </div>
          </div>
        )}

      </div>
    </div>
  )
  
}
Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired ({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  }
})
