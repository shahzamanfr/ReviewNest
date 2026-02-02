import { Star, Edit2, Trash2, MessageSquare } from "lucide-react";
import { ReviewData } from "./ReviewForm";
import { sessionId } from "../lib/supabase";
import ReplySection from "./ReplySection";

interface ReviewCardProps {
  review: ReviewData;
  index: number;
  onEdit?: (review: ReviewData) => void;
  onDelete?: (id: string) => void;
}

export default function ReviewCard({
  review,
  index,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getBackgroundColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-indigo-500",
      "bg-cyan-500",
      "bg-teal-500",
      "bg-emerald-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      key={index}
      className="border border-border rounded-lg p-6 md:p-8 hover:shadow-md transition-all duration-200 bg-card group/card"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 flex gap-4">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-sm ${getBackgroundColor(
                review.name,
              )}`}
              style={{ fontFamily: '"Sora", sans-serif' }}
            >
              {getInitials(review.name)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4
                className="font-medium text-foreground text-base md:text-lg"
                style={{ fontFamily: '"Sora", sans-serif', fontWeight: 400 }}
              >
                {review.name}
              </h4>
              {review.created_at && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground opacity-60">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${star <= review.overallRating
                    ? "fill-primary text-primary"
                    : "text-muted"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <div
              className="text-2xl md:text-3xl font-medium text-primary"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {review.overallRating}
            </div>
            <div
              className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tighter"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              out of 5
            </div>
          </div>
          <div className="flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
            {review.user_id !== sessionId && (
              <button
                onClick={() => {
                  const element = document.getElementById(`reply-section-${review.id}`);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-1.5 rounded-full hover:bg-secondary/20 text-muted-foreground hover:text-primary transition-colors"
                title="Reply to thread"
              >
                <MessageSquare size={14} />
              </button>
            )}
            {onEdit && review.user_id === sessionId && (
              <button
                onClick={() => onEdit(review)}
                className="p-1.5 rounded-full hover:bg-secondary/20 text-muted-foreground hover:text-primary transition-colors"
                title="Edit review"
              >
                <Edit2 size={14} />
              </button>
            )}
            {onDelete && review.id && review.user_id === sessionId && (
              <button
                onClick={() => onDelete(review.id!)}
                className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Delete review"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {review.comment && (
        <div className="pl-16">
          <p
            className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 border-b border-border/30 pb-6"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 400 }}
          >
            {review.comment}
          </p>
        </div>
      )}

      {/* Threaded Replies Section */}
      {review.id && (
        <ReplySection reviewId={review.id} reviewAuthorId={review.user_id || ""} />
      )}

      {review.detailedRating && (
        <div className="ml-16 pt-6">
          <p
            className="text-[10px] font-bold text-foreground mb-4 uppercase tracking-[0.2em]"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Technical Breakdown
          </p>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(review.detailedRating).map(([key, value]) => (
              <div key={key}>
                <p
                  className="text-[11px] text-muted-foreground mb-2 capitalize font-medium tracking-tight"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  {key}
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className={`${star <= value
                        ? "fill-primary/60 text-primary/60"
                        : "text-muted"
                        }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
