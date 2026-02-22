import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import ReviewForm, { ReviewData } from "./ReviewForm";
import ReviewCard from "./ReviewCard";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

interface ProjectReviewPageProps {
  projectName: string;
  projectTitle: string;
  description: string;
  projectLink?: string;
  extraDescription?: string;
}

export default function ProjectReviewPage({
  projectName,
  projectTitle,
  description,
  projectLink,
  extraDescription,
}: ProjectReviewPageProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<ReviewData | null>(null);
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    fetchReviews();
  }, [projectName]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("project_id", projectName)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform snake_case from DB to camelCase for ReviewData
      const transformedData: ReviewData[] = (data || []).map((r: any) => ({
        id: r.id,
        project_id: r.project_id,
        user_id: r.user_id,
        name: r.name,
        overallRating: r.overall_rating,
        comment: r.comment,
        detailedRating: r.detailed_rating,
        reply: r.reply,
        created_at: r.created_at,
      }));

      setReviews(transformedData);
    } catch (error: any) {
      toast.error("Failed to fetch reviews: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const radarData = useMemo(() => {
    const detailedReviews = reviews.filter((r) => r.detailedRating);
    if (detailedReviews.length === 0) return [];

    const sums = { idea: 0, ui: 0, website: 0, usefulness: 0 };
    detailedReviews.forEach((r) => {
      if (r.detailedRating) {
        sums.idea += r.detailedRating.idea;
        sums.ui += r.detailedRating.ui;
        sums.website += r.detailedRating.website;
        sums.usefulness += r.detailedRating.usefulness;
      }
    });

    const count = detailedReviews.length;
    return [
      { subject: "Idea", A: (sums.idea / count).toFixed(1), fullMark: 5 },
      { subject: "UI", A: (sums.ui / count).toFixed(1), fullMark: 5 },
      { subject: "Web", A: (sums.website / count).toFixed(1), fullMark: 5 },
      { subject: "Utility", A: (sums.usefulness / count).toFixed(1), fullMark: 5 },
    ];
  }, [reviews]);

  const handleSubmitReview = async (review: ReviewData) => {
    try {
      if (review.id) {
        // Update
        const { error } = await supabase
          .from("reviews")
          .update({
            name: review.name,
            overall_rating: review.overallRating,
            comment: review.comment,
            detailed_rating: review.detailedRating,
          })
          .eq("id", review.id);

        if (error) throw error;
        toast.success("Review updated successfully");
      } else {
        // Create
        const { error } = await supabase.from("reviews").insert([
          {
            project_id: projectName,
            user_id: user?.id || "anonymous",
            name: user?.fullName || review.name,
            overall_rating: review.overallRating,
            comment: review.comment,
            detailed_rating: review.detailedRating,
          },
        ]);

        if (error) throw error;
        toast.success("Review submitted successfully");
      }

      fetchReviews();
      setShowForm(false);
      setEditingReview(null);
    } catch (error: any) {
      toast.error("Error saving review: " + error.message);
    }
  };


  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) throw error;
      toast.success("Review deleted");
      fetchReviews();
    } catch (error: any) {
      toast.error("Error deleting review: " + error.message);
    }
  };

  const handleEditClick = (review: ReviewData) => {
    setEditingReview(review);
    setShowForm(true);
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
        <div className="container mx-auto px-4 py-3 md:py-4 max-w-6xl flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs md:text-sm"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" />
            <span>Back</span>
          </Link>
          <div
            className="text-[10px] md:text-sm font-semibold tracking-wider md:tracking-[0.2em] text-foreground flex items-center gap-1.5"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 500,
            }}
          >
            <span className="text-primary text-[10px] md:text-xs shrink-0">▲</span>
            <span className="flex items-baseline gap-1.5 md:gap-2">
              <span className="whitespace-nowrap">REVIEW NEST</span>
              <span className="text-muted-foreground font-normal text-[9px] md:text-xs opacity-80 uppercase shrink-0">SHAHZAMAN</span>
            </span>
          </div>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-destructive/10 border-b border-destructive/20 py-2">
          <div className="container mx-auto px-4 max-w-6xl flex items-center gap-2 text-destructive">
            <AlertCircle size={14} />
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-wider">
              Database Connection Required: Please configure Supabase variables in your environment.
            </span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-b from-card/30 to-background">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="max-w-3xl flex-1">
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
                className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6"
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: 400 }}
              >
                {description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                {projectLink && (
                  <a
                    href={projectLink.startsWith('http') ? projectLink : `https://${projectLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors border-b border-primary/30 hover:border-primary pb-0.5"
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    Visit Project →
                  </a>
                )}
                {extraDescription && (
                  <span className="text-xs px-2 py-1 rounded bg-secondary/30 text-muted-foreground uppercase tracking-widest font-bold">
                    {extraDescription}
                  </span>
                )}
              </div>
            </div>
            {radarData.length > 0 && (
              <div className="w-full md:w-64 h-64 bg-card rounded-2xl border border-border p-4 shadow-sm animate-in fade-in zoom-in duration-500">
                <div className="text-[10px] uppercase font-bold text-primary mb-2 tracking-widest text-center">
                  Project Pulse
                </div>
                <ResponsiveContainer width="100%" height="90%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#666", fontSize: 10 }}
                    />
                    <Radar
                      name="Rating"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
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

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-primary" size={32} />
                <p className="text-sm text-muted-foreground">
                  Loading reviews...
                </p>
              </div>
            ) : reviews.length === 0 ? (
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
                  <ReviewCard
                    key={review.id || idx}
                    review={review}
                    index={idx}
                    onEdit={
                      review.user_id === user?.id ? handleEditClick : undefined
                    }
                    onDelete={
                      review.user_id === user?.id
                        ? handleDeleteReview
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Form Section */}
          <div>
            <div className="border border-border rounded-lg p-8 sticky top-24 bg-card backdrop-blur-sm bg-card/80">
              <h3
                className="text-xl font-medium text-foreground mb-3"
                style={{ fontFamily: '"Sora", sans-serif', fontWeight: 400 }}
              >
                {editingReview ? "Update Your Review" : "Share Your Review"}
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
                  className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/20"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  Write a Review
                </button>
              ) : (
                <div className="space-y-4">
                  {!isSignedIn ? (
                    <div className="text-center space-y-4">
                      <p className="text-sm text-muted-foreground">Please sign in to leave a review.</p>
                      <SignInButton mode="modal">
                        <button className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-primary/20">
                          Sign In
                        </button>
                      </SignInButton>
                    </div>
                  ) : (
                    <>
                      <ReviewForm
                        projectName={projectName}
                        onSubmit={handleSubmitReview}
                        editingReview={editingReview || undefined}
                        onCancel={() => {
                          setShowForm(false);
                          setEditingReview(null);
                        }}
                      />
                      {!editingReview && (
                        <div className="flex gap-2 pt-2 justify-end">
                          <button
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-sm rounded hover:opacity-70 transition-all text-muted-foreground"
                            style={{ fontFamily: '"Inter", sans-serif' }}
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
