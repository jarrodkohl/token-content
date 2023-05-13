import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { Configuration, OpenAIApi } from "openai"
import clientPromise from "../../lib/mongodb"
import { getSession } from "@auth0/nextjs-auth0"

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res)
  const client = await clientPromise
  const db = client.db("ContentAgent")
  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub
  })

  if(!userProfile?.availableTokens) {
    res.status(403)
    // .json({error: "You do not have enough tokens to generate a post"})
    return
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(config)

  const { topic, keywords } = req.body
  console.log("topic", topic);
  console.log("keywords", keywords);

  // const topic = req.body.topic
  // const topic = "how to write a linkedin post"
  // const keywords = "linkedin, post, write, how to, guide, tips, tricks"

//   write a long and detailed SEO friendly blog post about ${topic} that targets the following comma separted keywords: ${keywords}
//  the content should be formatted in SEO-friendly HTML
  
  const postContentResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [{
      role: "system",
      content: "you are a blog post generator",
    },{
      role: "user",
      content: `write a long and detailed SEO friendly blog post about ${topic} that targets the following comma separted keywords: ${keywords}
      the content should be formatted in SEO-friendly HTML, 
      and should be limited to the following HTML tags: p, H1, H2, h3, h4, h5, h6, ul, ol, li, i.`
    }
  ]
  })

  const postContent = postContentResponse.data.choices[0]?.message?.content || ''

  const titleResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [{
      role: "system",
      content: "you are a blog post generator",
    },{
      role: "user",
      content: `write a long and detailed SEO friendly blog post about ${topic} that targets the following comma separted keywords: ${keywords}
      the content should be formatted in SEO-friendly HTML, 
      and should be limited to the following HTML tags: p, H1, H2, h3, h4, h5, h6, ul, ol, li, i.`
    },
    {
      role: "assistant",
      content: postContent,
    },
    {
      role: "user",
      content: "generate a seo friendly title of the above blog",
    }
  ]
  })
  const metaDescriptionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [{
      role: "system",
      content: "you are a blog post generator",
    },{
      role: "user",
      content: `write a long and detailed SEO friendly blog post about ${topic} that targets the following comma separted keywords: ${keywords}
      the content should be formatted in SEO-friendly HTML, 
      and should be limited to the following HTML tags: p, H1, H2, h3, h4, h5, h6, ul, ol, li, i.`
    },
    {
      role: "assistant",
      content: postContent,
    },
    {
      role: "user",
      content: "generate SEO friendly meta description content for above blog",
    }
  ]
  })

  const title = titleResponse.data.choices[0]?.message?.content || ''
  const metaDescription = metaDescriptionResponse.data.choices[0]?.message?.content || ''

  
  await db.collection("users").updateOne({
    auth0Id: user.sub
  },{
    $inc: {
      availableTokens: -1
    }
  })

  const post = await db.collection("posts").insertOne({
    postContent: postContent,
    title: title,
    metaDescription: metaDescription,
    keywords: keywords,
    topic: topic,
    userId: userProfile._id,
    createdAt: new Date(),
  })
  console.log("post", post);

res.status(200).json({ 
  post: postContent,
  title: title,
  metaDescription: metaDescription,
  postId: post.insertedId,
})
})

