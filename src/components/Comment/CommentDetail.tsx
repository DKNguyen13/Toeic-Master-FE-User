import "dayjs/locale/vi";
import dayjs from "dayjs";
import { FcLike } from "react-icons/fc";
import { Comment } from '../Comment/types';
import { FaRegHeart } from "react-icons/fa";
import { showToast } from '../../utils/toast';
import React, { useEffect, useState } from 'react';
import relativeTime from "dayjs/plugin/relativeTime";
import avatar from '../../assets/images/default_avatar.jpg';
import { createReplyComment, deleteComment, editComment, getChildrenComment } from '../../service/commentService';

interface CommentDetailProps {
  comment: Comment;
  isChild?: boolean;
  onLike?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => Promise<Comment | void>;
  onDelete?: (commentId: string) => Promise<void>;
}

dayjs.extend(relativeTime);
dayjs.locale("vi");

function timeAgo(dateString: string) {
  return dayjs(dateString).fromNow();
}

const CommentDetail: React.FC<CommentDetailProps> = ({
  comment,
  isChild = false,
  onLike,
  onEdit,
  onDelete,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReplies, setTotalReplies] = useState(comment.noOfChildren);
  const [hasMore, setHasMore] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLike);
  const [likeCount, setLikeCount] = useState(comment.noOfLikes || 0);

  const fetchReplies = async (page: number) => {
    const isFirstLoad = page === 1;
    if (isFirstLoad) {
      setLoadingReplies(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await getChildrenComment(comment._id, { page });
      const newReplies = res.data || [];

      if (isFirstLoad) {
        setReplies(newReplies);
      } else {
        setReplies((prev) => [...prev, ...newReplies]);
      }

      setTotalReplies(res.pagination.totalComments);
      setHasMore(res.pagination.hasNext);
      setCurrentPage(page);
    } catch (err) {
      //console.error("Error loading replies:", err);
      showToast("Không tải được trả lời", "error", {autoClose: 500});
    } finally {
      if (isFirstLoad) {
        setLoadingReplies(false);
      }
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (showReplies && replies.length === 0) {
      fetchReplies(1);
    }
  }, [showReplies, comment._id]);

  useEffect(() => {
    setIsLiked(comment.isLike);
    setLikeCount(comment.noOfLikes || 0);
  }, [comment.isLike, comment.noOfLikes]);

  const handleReply = async () => {
    const trimmed = replyContent.trim();
    if (!trimmed) {
      showToast("Vui lòng nhập nội dung bình luận", "warn", {autoClose: 500});
      return;
    }

    try {
      const newReply = await createReplyComment(comment._id, replyContent);

      setReplies((prev) => [newReply, ...prev]);
      comment.noOfChildren += 1;
      setTotalReplies((prev) => prev + 1);

      setReplyContent('');
      setIsReplying(false);
      setShowReplies(true);

      showToast("Trả lời đã được đăng!", "success", {autoClose: 500});
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Có lỗi xảy ra khi trả lời!",
        "error", {autoClose: 500}
      );
    }
  };

  const handleLoadMore = () => {
    fetchReplies(currentPage + 1);
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      showToast("Nội dung không được để trống", "warn", {autoClose: 500});
      return;
    }

    try {
      if (onEdit) {
        await onEdit(comment._id, editContent);
        comment.content = editContent;
      } else {
        await editComment(comment._id, editContent);
      }
      setIsEditing(false);
      showToast("Cập nhật bình luận thành công!", "success", {autoClose: 500});
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Không thể cập nhật bình luận",
        "error", {autoClose: 500}
      );
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      await deleteComment(replyId);
      setReplies((prev) => prev.filter((r) => r._id !== replyId));
      comment.noOfChildren -= 1;
      setTotalReplies((prev) => prev - 1);
      showToast("Đã xoá trả lời", "success", {autoClose: 500});
    } catch (error) {
      showToast("Không thể xoá trả lời", "error", {autoClose: 500});
    }
  };

  const handleEditReply = async (replyId: string, newContent: string) => {
    try {
      const updated = await editComment(replyId, newContent);
      setReplies((prev) =>
        prev.map((r) => (r._id === replyId ? updated : r))
      );
      showToast("Cập nhật trả lời thành công!", "success", {autoClose: 500});
    } catch (error) {
      showToast("Không thể sửa trả lời", "error", {autoClose: 500});
    }
  };

  const renderContent = (content: string, replyTo?: string | null) => {
    if (!replyTo) {
      return <span className="text-gray-800">{content}</span>;
    }

    const prefix = `@${replyTo} `;
    if (content.startsWith(prefix)) {
      const rest = content.substring(prefix.length);
      return (
        <>
          <span className="text-blue-600 font-medium">{prefix}</span>
          <span className="text-gray-800">{rest}</span>
        </>
      );
    }
    return <span className="text-gray-800">{content}</span>;
  };

  const containerStyle = isChild
    ? "bg-white p-4 mb-3 ml-8 border-l-4 border-gray-200"
    : "bg-white border border-gray-200 rounded-lg p-5 mb-5 shadow-sm";

  return (
    <div className={containerStyle}>
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <img
            src={comment.author.avatarUrl || avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-gray-900">
              {comment.author.fullname}
            </div>
            <div className="text-gray-500 text-sm">
              {timeAgo(comment.createdAt)}
            </div>
          </div>
        </div>

        {comment.isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-500 hover:text-gray-800"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-32">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sửa
                </button>
                <button
                  onClick={() => {
                    onDelete?.(comment._id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Xoá
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Huỷ
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800 leading-relaxed">
            {renderContent(comment.content, comment.replyTo)}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-6 text-sm text-gray-600">
        <button
          onClick={async () => {
            const previousLiked = isLiked;
            const previousCount = likeCount;

            setIsLiked(!previousLiked);
            setLikeCount(previousCount + (previousLiked ? -1 : 1));

            if (isChild) {
              setReplies([...replies]);
            }

            try {
              if (onLike) {
                await onLike(comment._id);
              }
            } catch (error) {
              setIsLiked(previousLiked);
              setLikeCount(previousCount);
              if (isChild) {
                setReplies([...replies]);
              }
              showToast("Có lỗi khi thích bình luận", "error", {autoClose : 500});
            }
          }}
          className="flex items-center space-x-1 hover:text-blue-600 transition">
          {isLiked ? <FcLike size={18} /> : <FaRegHeart size={16} />}
          <span>
            {likeCount > 0 ? likeCount : ''}
          </span>
        </button>

        <button
          onClick={() => {
            setIsReplying(true);
            setReplyContent(`@${comment.author.fullname} `);
          }}
          className="hover:text-blue-600 transition">
          Trả lời
        </button>
      </div>

      {isReplying && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Viết câu trả lời của bạn..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            autoFocus
          />
          <div className="flex justify-end space-x-3 mt-3">
            <button
              onClick={() => {
                setIsReplying(false);
                setReplyContent('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Huỷ
            </button>
            <button
              onClick={handleReply}
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Trả lời
            </button>
          </div>
        </div>
      )}

      {comment.noOfChildren > 0 && (
        <div className="mt-5">
          <button onClick={() => setShowReplies(!showReplies)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            {showReplies ? "Ẩn" : "Xem"} {totalReplies} trả lời
          </button>

          {showReplies && (
            <div className="mt-4 space-y-4">
              {loadingReplies ? (
                <div className="text-sm text-gray-500 py-4">Đang tải trả lời...</div>
              ) : (
                <>
                  {replies.map((reply) => (
                    <CommentDetail
                      key={reply._id}
                      comment={reply}
                      isChild={true}
                      onLike={onLike}
                      onEdit={handleEditReply}
                      onDelete={handleDeleteReply}
                    />
                  ))}

                  {hasMore && (
                    <div className="mt-6 text-center">
                      <button onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loadingMore ? (
                          <>Đang tải...</>
                        ) : (
                          <>Xem thêm {Math.min(5, totalReplies - replies.length)} trả lời</>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentDetail;