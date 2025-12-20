import "dayjs/locale/vi";
import dayjs from "dayjs";
import { FcLike } from "react-icons/fc";
import { Comment } from '../Comment/types'
import { FaRegHeart } from "react-icons/fa";
import { showToast } from '../../utils/toast';
import CommentChildren from './CommentChildren';
import React, { useEffect, useState } from 'react';
import relativeTime from "dayjs/plugin/relativeTime";
import avatar from '../../assets/images/default_avatar.jpg';
import { createReplyComment, deleteComment, editComment, getChildrenComment } from '../../service/commentService';

interface CommentDetailProps {
  comment: Comment;
  isChild: boolean;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
}
dayjs.extend(relativeTime);
dayjs.locale("vi");
function timeAgo(dateString: string) {
  return dayjs(dateString).fromNow();
}

const CommentDetail: React.FC<CommentDetailProps> = ({
  comment,
  isChild,
  onReply,
  onEdit,
  onLike,
  onDelete
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const [showChildren, setShowChildren] = useState(false); // State để hiển thị children
  const [commentChildren, setCommentChildren] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const handleReply = async () => {
    const trimmed = replyContent.trim();
    const prefix = `@${comment.author.fullname}`;

    if (trimmed === prefix || trimmed === `${prefix} `) {
      showToast("Vui lòng nhập nội dung bình luận", "warn", { autoClose: 500 })
      return;
    }

    if(!replyContent.trim()) {
      showToast("Vui lòng nhập nội dung bình luận", "warn", { autoClose: 500 })
      return;
    }

    try {
      const response = await createReplyComment(comment._id, replyContent);
      setCommentChildren([response, ...commentChildren]);
      comment.noOfChildren += 1;
      setReplyContent('');
      setIsReplying(false);
      showToast("Trả lời đã được đăng!", "success", { autoClose: 500 });
    } catch (error: any) {
      console.error("Error posting reply:", error);
      setReplyContent('');
      if (error.response && error.response.data?.message) {
        showToast(error.response.data.message, "error", { autoClose: 500 });
      } else {
        showToast("Có lỗi xảy ra! Vui lòng thử lại.", "error", { autoClose: 500 });
      }
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim() || !onEdit) return;
    try {
      const response = await onEdit(comment._id, editContent);
      setIsEditing(false);
      showToast("Cập nhật bình luận thành công!", "success", { autoClose: 500 });
    } catch (error: any) {
      console.error("Error editing comment:", error);
      showToast(
        error.response?.data?.message || "Có lỗi xảy ra! Không thể cập nhật bình luận.",
        "error",
        { autoClose: 500 }
      );
    }
  };

  const onDeleteChild = async (commentId: string) => {
    await deleteComment(commentId)
    setCommentChildren((prevComments) => prevComments.filter((comment) => comment._id !== commentId)
    );
    comment.noOfChildren -= 1;
  }

  const onEditChild = async (commentId: string, content: string) => {
    const response = await editComment(commentId, content);
    setCommentChildren((prevComments) =>
      prevComments.map((comment) =>
      comment._id === commentId ? response : comment
    ));
  };

  useEffect(() => {
    const fetchChildrenComments = async () => {
      if (showChildren){
        const response = await getChildrenComment(comment._id);
        setCommentChildren(response.data);
      }
    }
    fetchChildrenComments();
  }, [showChildren])
  const divStyle = isChild ? "bg-white p-3 mb-3 ": "bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm";

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

  return (
    <div className={divStyle}>
      <div className="flex justify-between">
        {/* user information */}
        <div className="flex items-center space-x-2">
          <img
            src={comment.author.avatarUrl || avatar}
            alt={avatar}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-gray-900">{comment.author.fullname}</span>
          <span className="text-gray-500 text-sm">
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        
        {/* menu action */}
        <div className='ml-auto'>
          {comment.isOwner && (
            <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-600 hover:text-gray-800 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
          </button>
         
          {showMenu && (
            <div className="absolute right-0 top-full bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[80px]">
              <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
              Sửa
              </button>
              <button
              onClick={() => {
                onDelete?.(comment._id);
                setShowMenu(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
              Xoá
              </button>
            </div>
          )}
            </div>
          )}
        </div>
      </div>
      <div className="mb-3">
        {isEditing ? (
          <div className="space-y-3 mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Huỷ
              </button>
            </div>
          </div>
        ) : (
          <p className="leading-relaxed">
            {renderContent(comment.content, comment.replyTo)}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <button
        onClick={() => {
          // console.log("like comment", comment._id);
          onLike?.(comment._id)
        }}
        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
        <span>
          {comment.isLike ? <FcLike size={18}/> : <FaRegHeart size={16}/>}
        </span>
        <span>{(comment.noOfLikes && comment.noOfLikes > 0) ? comment.noOfLikes : ''}</span>
          </button>
          <button
            onClick={() => {
              setIsReplying(true);
              setReplyTo(comment.author.fullname);
              setReplyContent(`@${comment.author.fullname} `);
            }}
            className="text-gray-600 hover:text-blue-600"
          >
            Trả lời
          </button>
        </div>
      </div>
      {isReplying && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Để lại câu trả lời của bạn..."
            className="text-sm w-full p-3 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleReply}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Trả lời
            </button>
            <button
              onClick={() => setIsReplying(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
            >
              Huỷ
            </button>
          </div>
        </div>
      )}
      {comment.noOfChildren > 0 && (
        <div className="mt-4 space-y-3">
          <button
            onClick={() => setShowChildren(!showChildren)}
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
          >
            {!showChildren ? "Xem" : "Ẩn"} {comment.noOfChildren} bình luận
          </button>
          {showChildren && (
            <CommentChildren
              parentCommentId={comment._id}
              commentChildren={commentChildren}
              onLike={onLike}
              onReply={onReply}
              onEdit={onEditChild}
              onDelete={onDeleteChild}
            />
          )}
        </div>
       
      )}
    </div>
  );
};
export default CommentDetail;