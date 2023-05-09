import { Configuration, OpenAIApi } from "openai"

export default async function handler(req, res) {
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

  console.log("post content::::::", postContent);
  console.log("title::::", title);
  console.log("meta description:::::", metaDescription);
  res.status(200).json({ 
    post: postContent,
    title: title,
    metaDescription: metaDescription,
  })
}