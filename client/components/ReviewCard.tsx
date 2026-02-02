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
      className="border border-border rounded-lg p-6 hover:bg-secondary/20 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-foreground">{review.name}</h4>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={`${
                  star <= review.overallRating
                    ? "fill-primary text-primary"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-primary">
            {review.overallRating}
          </div>
          <div className="text-xs text-muted-foreground">/ 5</div>
        </div>
      </div>

      {review.comment && (
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {review.comment}
        </p>
      )}

      {review.detailedRating && (
        <div className="border-t border-border pt-4 mt-4">
          <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
            Detailed Ratings
          </p>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(review.detailedRating).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-muted-foreground mb-1 capitalize">
                  {key}
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
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
