import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./sub-components/Navbar";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";

interface PostContentBlock {
  type: "text" | "image" | "code";
  data: any;
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  authorName: string;
}

interface Post {
  id: string;
  title: string;
  content: PostContentBlock[];
  createdAt: string;
  likes: number;
  comCount: number;
  author: {
    id: string;
    username: string;
    avatarUrl: string;
  };
}

interface User {
  username?: string;
  avatarUrl?: string;
  aboutMe?: string;
}

const ViewPostComment = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>({});

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  const firstLoad = useRef(true);

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/v.1/api/post/get/${id}`);
        setPost(res.data.post);
      } catch {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Fetch user profile
  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/v.1/api/user/details/me",
          { withCredentials: true }
        );
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };
    getMyProfile();
  }, []);

  // Fetch comments (pagination)
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/v.1/api/comment/get/all/${id}?page=${page}&limit=${limit}`
      );
      const newComments = res.data.comments;

      setComments((prev) => [...prev, ...newComments]);
      setHasMore(newComments.length === limit);
      setPage((prev) => prev + 1);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  // Initial load of comments (only once)
  useEffect(() => {
    if (firstLoad.current) {
      fetchComments();
      firstLoad.current = false;
    }
  }, []);

  const renderContentBlock = (block: PostContentBlock, index: number) => {
    switch (block.type) {
      case "text":
        return (
          <p key={index} className="mt-2 text-gray-800 dark:text-gray-200">
            {block.data}
          </p>
        );
      case "image":
        return (
          <img
            key={index}
            src={block.data.url}
            alt={block.data.alt}
            className="my-3 max-h-96 rounded-lg object-cover mx-auto"
          />
        );
      case "code":
        return (
          <pre
            key={index}
            className="my-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-gray-100"
          >
            <code>{block.data.code}</code>
          </pre>
        );
      default:
        return null;
    }
  };

  const handleAddComment = async (id:string) => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:4000/v.1/api/comment/add/${id}`,
        { text: newComment, authorName: commentAuthor },
        {
          withCredentials: true,
          headers: {"Content-Type": 'application/json'}
        }
      );

      setComments((prev) => [
        {
          id: res.data.comment.id,
          text: res.data.comment.text,
          createdAt: res.data.comment.createdAt,
          authorName: res.data.comment.authorName,
        },
        ...prev,
      ]);

      setNewComment("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-10">Loading...</div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-10">Post not found</div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar
        siteName="DailyTalk"
        userName={user.username}
        userImage={user.avatarUrl}
        btnText="Go Back"
      />
      <div className="max-w-4xl mx-auto p-4 pt-20">
        {/* Post Header */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src={post.author.avatarUrl}
            alt={post.author.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {post.author.username}
            </h2>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Post Title */}
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {post.title}
        </h1>

        {/* Post Content */}
        <div>{post.content.map(renderContentBlock)}</div>

        {/* Comments Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Comments
          </h3>

          <InfiniteScroll
            dataLength={comments.length}
            next={fetchComments}
            hasMore={hasMore}
            loader={<p className="text-center">Loading more...</p>}
            endMessage={<p className="text-center text-gray-500"></p>}
          >
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 shadow-sm"
              >
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {comment.text}
                </p>
                <p className="text-gray-700 dark:text-gray-300">{comment.authorName}</p>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
            ))}
          </InfiniteScroll>
        </div>

        {/* Add Comment */}
        <div className="mt-5 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-gray-100"
          />
          <input
            type="text"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            placeholder="Enter your Name"
            className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            onClick={() => handleAddComment(post.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPostComment;
