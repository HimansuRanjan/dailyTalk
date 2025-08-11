import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { clearAllPostErrors, likePost } from "../../store/slices/postSlice";
import { toast } from "react-toastify";
import LoadingButton from "./LoadingButton";
import ShareMenu from "./ShareMenu";

interface PostContentBlock {
  type: "text" | "image" | "code" | "link";
  data: any;
}

interface Author {
  id: string;
  username: string;
  avatarUrl?: string;
}

interface Post {
  id: string;
  title: string;
  content: PostContentBlock[];
  createdAt: string;
  likes: number;
  comCount: number;
  author: Author;
}

interface PostsResponse {
  success: boolean;
  posts: Post[];
}

const LIMIT = 5;

const Blogs: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigateTo = useNavigate();

  const { message, loading, postError } = useSelector(
    (state: RootState) => state.post,
  );

  // Fetch posts from backend (paginated)
  const fetchPosts = useCallback(async (pageToLoad: number) => {
    try {
      const { data } = await axios.get<PostsResponse>(
        `http://localhost:4000/v.1/api/post/get/all`,
        {
          params: { page: pageToLoad, limit: LIMIT },
          withCredentials: true,
        },
      );

      if (!data || !Array.isArray(data.posts)) {
        throw new Error("Invalid response format");
      }

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = data.posts.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });

      if (data.posts.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to load posts",
      );
    }
  }, []);

  // Load first page on mount
  useEffect(() => {
    fetchPosts(page);

    if (error) {
      toast.error(error);
      dispatch(clearAllPostErrors());
    }
    if (message) {
      toast.success(message);
    }
  }, [page, fetchPosts, dispatch, message, postError]);

  // Infinite scroll handler
  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

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
            className="mx-auto my-3 max-h-96 max-w-full rounded-lg object-cover"
            loading="lazy"
          />
        );
      // case "code":

      //   return (
      //     <pre
      //       key={index}
      //       className="my-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-gray-100"
      //     >
      //       <code>{block.data.code}</code>
      //     </pre>
      //   );
      case "code": {
        // Ensure each line ends with a semicolon and render line-by-line
        const processedLines = block.data.code.split(";").map((line: string) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.endsWith(";")) {
            return `${trimmed};`;
          }
          return trimmed;
        });

        return (
          <pre
            key={index}
            className="my-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-gray-100"
          >
            <code>
              {processedLines.map((line: string, i: number) => (
                <div key={i}>{line}</div>
              ))}
            </code>
          </pre>
        );
      }
      case "link":
        return (
          <a
            key={index}
            href={block.data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="my-3 inline-block text-blue-600 hover:underline dark:text-blue-400"
          >
            {block.data.text || block.data.url}
          </a>
        );
      default:
        return null;
    }
  };

  const handlePostLike = (id: string) => {
    dispatch(likePost(id));
  };

  const handleAddComment = (id: string) => {
    navigateTo(`/view/post/${id}`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-2 py-4 sm:px-4">
      {error && <p className="text-center text-red-500">{error}</p>}

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<p className="text-center text-gray-500">Loading...</p>}
        endMessage={<p className="text-center text-gray-500">No more posts</p>}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            className="mx-auto mb-6 w-[95%] max-w-[600px] rounded-lg bg-white p-3 shadow dark:bg-neutral-900 sm:p-4"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <img
                    src={
                      post.author.avatarUrl || "/images/avatar-placeholder.png"
                    }
                    alt={post.author.username}
                    className="h-10 w-10 rounded-full object-cover"
                    loading="lazy"
                  />
                </Link>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {post.author.username}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              {/* <Button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <MoreHorizontal size={18} />
              </Button> */}
            </div>

            {/* Title */}
            <h2 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-100">
              {post.title}
            </h2>

            {/* Content */}
            <div>{post.content.map(renderContentBlock)}</div>

            {/* Footer actions */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
              {loading ? (
                <LoadingButton content={"Liking Post"} />
              ) : (
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-500 dark:text-gray-300"
                  onClick={() => handlePostLike(post.id)}
                >
                  <ThumbsUp size={18} /> {post.likes}
                </button>
              )}
              <button
                className="flex items-center gap-1 text-gray-600 hover:text-green-500 dark:text-gray-300"
                onClick={() => handleAddComment(post.id)}
              >
                <MessageCircle size={18} /> {post.comCount}
              </button>
              {/* <Button className="flex items-center gap-1 text-gray-600 hover:text-purple-500 dark:text-gray-300"> */}
              <ShareMenu
                url={`${window.location.origin}/view/post/${post.id}`}
                title={`Blog: ${post.title}`}
              />
              {/* </Button> */}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Blogs;
