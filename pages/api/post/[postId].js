import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const {
    query: { postId },
  } = req;

  const client = await clientPromise;
  const db = client.db('ContentAgent');

  const post = await db.collection('posts').findOne({
    _id: ObjectId(postId),
  });

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.status(200).json({ post });
}
