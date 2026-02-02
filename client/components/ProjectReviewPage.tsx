import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReviewForm, { ReviewData } from "./ReviewForm";
import ReviewCard from "./ReviewCard";

interface ProjectReviewPageProps {
  projectName: string;
  projectTitle: string;
  description: string;
}

export default function ProjectReviewPage({
  projectName,
  projectTitle,
  description,
}: ProjectReviewPageProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitReview = (review: ReviewData) => {
    setReviews([review, ...reviews]);
    setShowForm(false);
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 md:px-6 py-4 max-w-6xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {projectTitle}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
                {reviews.length > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Average Rating
                    </div>
                    <div className="text-2xl font-semibold text-primary">
                      {averageRating} / 5
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="border border-border rounded-lg p-8 md:p-12 text-center">
                <p className="text-muted-foreground">
                  No reviews yet. Be the first to share your feedback.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <ReviewCard key={idx} review={review} index={idx} />
                ))}
              </div>
            )}
          </div>

          {/* Form Section */}
          <div>
            <div className="border border-border rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Share Your Review
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Help others understand what {projectName} is about.
              </p>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Write a Review
                </button>
              ) : (
                <>
                  <ReviewForm
                    projectName={projectName}
                    onSubmit={handleSubmitReview}
                  />
                  <button
                    onClick={() => setShowForm(false)}
                    className="w-full mt-4 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary/30 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
