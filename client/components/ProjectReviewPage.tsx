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
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 max-w-6xl">
          <div className="max-w-3xl">
            <h1
              className="text-4xl md:text-5xl font-medium text-foreground mb-4 leading-tight"
              style={{
                fontFamily: '"Sora", sans-serif',
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              {projectTitle}
            </h1>
            <p
              className="text-base md:text-lg text-muted-foreground leading-relaxed"
              style={{ fontFamily: '"Inter", sans-serif', fontWeight: 400 }}
            >
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
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-3xl font-medium text-foreground"
                  style={{
                    fontFamily: '"Sora", sans-serif',
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Reviews
                </h2>
                {reviews.length > 0 && (
                  <div className="text-right">
                    <div
                      className="text-sm text-muted-foreground"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      Average Rating
                    </div>
                    <div
                      className="text-3xl font-medium text-primary"
                      style={{ fontFamily: '"Inter", sans-serif' }}
                    >
                      {averageRating} <span className="text-lg">/ 5</span>
                    </div>
                  </div>
                )}
              </div>
              <p
                className="text-sm text-muted-foreground"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="border border-border rounded-lg p-12 text-center">
                <p
                  className="text-muted-foreground text-base"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  No reviews yet. Be the first to share your feedback.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, idx) => (
                  <ReviewCard key={idx} review={review} index={idx} />
                ))}
              </div>
            )}
          </div>

          {/* Form Section */}
          <div>
            <div className="border border-border rounded-lg p-8 sticky top-24 bg-card">
              <h3
                className="text-xl font-medium text-foreground mb-3"
                style={{ fontFamily: '"Sora", sans-serif', fontWeight: 400 }}
              >
                Share Your Review
              </h3>
              <p
                className="text-sm text-muted-foreground mb-8"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                Help others understand what {projectName} is about.
              </p>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
                  style={{ fontFamily: '"Inter", sans-serif' }}
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
                    className="w-full mt-4 px-4 py-3 rounded-lg border border-border text-foreground hover:bg-secondary/20 transition-all duration-200"
                    style={{ fontFamily: '"Inter", sans-serif' }}
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
