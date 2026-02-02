import { Star } from "lucide-react";
import { ReviewData } from "./ReviewForm";

interface ReviewCardProps {
  review: ReviewData;
  index: number;
}

export default function ReviewCard({ review, index }: ReviewCardProps) {
  return (
    <div
      key={index}
      className="border border-border rounded-lg p-6 md:p-8 hover:shadow-md transition-all duration-200 bg-card"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h4
            className="font-medium text-foreground text-lg"
            style={{ fontFamily: '"Sora", sans-serif', fontWeight: 400 }}
          >
            {review.name}
          </h4>
          <div className="flex gap-2 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={`${
                  star <= review.overallRating
                    ? "fill-primary text-primary"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-right pl-4">
          <div
            className="text-3xl font-medium text-primary"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            {review.overallRating}
          </div>
          <div
            className="text-xs text-muted-foreground mt-1"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            out of 5
          </div>
        </div>
      </div>

      {review.comment && (
        <p
          className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6"
          style={{ fontFamily: '"Inter", sans-serif', fontWeight: 400 }}
        >
          {review.comment}
        </p>
      )}

      {review.detailedRating && (
        <div className="border-t border-border pt-6 mt-6">
          <p
            className="text-xs font-medium text-foreground mb-4 uppercase tracking-widest"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Detailed Ratings
          </p>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(review.detailedRating).map(([key, value]) => (
              <div key={key}>
                <p
                  className="text-xs text-muted-foreground mb-2 capitalize font-medium"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  {key}
                </p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={`${
                        star <= value
                          ? "fill-secondary text-secondary"
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
