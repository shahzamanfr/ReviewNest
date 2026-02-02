import { useState } from "react";
import { Star } from "lucide-react";

export interface ReviewData {
  id?: string;
  project_id?: string;
  user_id?: string;
  name: string;
  overallRating: number;
  comment: string;
  detailedRating?: {
    idea: number;
    ui: number;
    website: number;
    usefulness: number;
  };
  reply?: string;
  detailedComment?: string;
  created_at?: string;
}

interface ReviewFormProps {
  projectName: string;
  onSubmit: (review: ReviewData) => void;
  editingReview?: ReviewData;
  onCancel?: () => void;
}

export default function ReviewForm({
  projectName,
  onSubmit,
  editingReview,
  onCancel,
}: ReviewFormProps) {
  const [step, setStep] = useState<"basic" | "detailed">("basic");
  const [name, setName] = useState(editingReview?.name || "");
  const [comment, setComment] = useState(editingReview?.comment || "");
  const [overallRating, setOverallRating] = useState(
    editingReview?.overallRating || 0,
  );
  const [hoveredRating, setHoveredRating] = useState(0);

  const [detailedRating, setDetailedRating] = useState(
    editingReview?.detailedRating || {
      idea: 0,
      ui: 0,
      website: 0,
      usefulness: 0,
    },
  );
  const [detailedComment, setDetailedComment] = useState(
    editingReview?.detailedComment || "",
  );
  const [hoveredDetailed, setHoveredDetailed] = useState<string | null>(null);

  const handleBasicSubmit = (includeDetailed: boolean) => {
    if (!name.trim() || overallRating === 0) {
      alert("Please enter your name and rating");
      return;
    }

    if (includeDetailed) {
      setStep("detailed");
    } else {
      onSubmit({
        ...(editingReview?.id ? { id: editingReview.id } : {}),
        name,
        overallRating,
        comment,
      });
      if (!editingReview) resetForm();
    }
  };

  const handleDetailedSubmit = () => {
    const allRated = Object.values(detailedRating).every((r) => r > 0);
    if (!allRated) {
      alert("Please rate all categories");
      return;
    }

    onSubmit({
      ...(editingReview?.id ? { id: editingReview.id } : {}),
      name,
      overallRating,
      comment,
      detailedRating,
      detailedComment,
    });
    if (!editingReview) resetForm();
  };

  const resetForm = () => {
    setName("");
    setComment("");
    setOverallRating(0);
    setDetailedRating({ idea: 0, ui: 0, website: 0, usefulness: 0 });
    setDetailedComment("");
    setStep("basic");
  };

  if (step === "detailed") {
    return (
      <div className="space-y-7">
        <h4
          className="font-medium text-foreground"
          style={{ fontFamily: '"Sora", sans-serif', fontWeight: 400 }}
        >
          Detailed Ratings
        </h4>

        {(["idea", "ui", "website", "usefulness"] as const).map((category) => (
          <div key={category}>
            <div className="flex justify-between items-center mb-2.5">
              <label
                className="block text-xs text-muted-foreground uppercase tracking-wider font-medium capitalize"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                {category}
              </label>
              <span className="text-[10px] text-muted-foreground/50 italic">
                {category === 'idea' && 'Originality & Concept'}
                {category === 'ui' && 'Visual Polish'}
                {category === 'website' && 'Tech Stack & Performance'}
                {category === 'usefulness' && 'Problem Solving'}
              </span>
            </div>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setDetailedRating({ ...detailedRating, [category]: star })
                  }
                  onMouseEnter={() => setHoveredDetailed(category)}
                  onMouseLeave={() => setHoveredDetailed(null)}
                  className="transition-transform duration-150 hover:scale-125"
                >
                  <Star
                    size={18}
                    className={`transition-colors ${star <=
                      (hoveredDetailed === category
                        ? hoveredRating
                        : detailedRating[category])
                      ? "fill-accent text-accent"
                      : "text-muted"
                      }`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <label
            className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Technical Thoughts
          </label>
          <textarea
            value={detailedComment}
            onChange={(e) => setDetailedComment(e.target.value)}
            placeholder="What's the technical 'why' behind these ratings? (e.g. Code quality, UX polish, etc.)"
            rows={3}
            className="w-full px-3 py-2 rounded bg-secondary/30 border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all resize-none text-sm placeholder:text-muted-foreground/50"
            style={{ fontFamily: '"Inter", sans-serif' }}
          />
        </div>

        <div className="flex gap-2.5 pt-4">
          <button
            onClick={() => setStep("basic")}
            className="flex-1 px-4 py-2.5 rounded border border-border/40 hover:bg-secondary/20 transition-all duration-200 font-medium text-sm"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Back
          </button>
          <button
            onClick={handleDetailedSubmit}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-medium text-sm"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            {editingReview ? "Save Changes" : "Confirm"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label
          className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2 rounded bg-secondary/30 border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm placeholder:text-muted-foreground/50"
          style={{ fontFamily: '"Inter", sans-serif' }}
        />
      </div>

      <div>
        <label
          className="block text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          Rate It
        </label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setOverallRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform duration-150 hover:scale-125"
            >
              <Star
                size={20}
                className={`transition-colors ${star <= (hoveredRating || overallRating)
                  ? "fill-primary text-primary"
                  : "text-muted"
                  }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          Thoughts
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your feedback..."
          rows={3}
          className="w-full px-3 py-2 rounded bg-secondary/30 border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all resize-none text-sm placeholder:text-muted-foreground/50"
          style={{ fontFamily: '"Inter", sans-serif' }}
        />
      </div>

      <div className="pt-3 space-y-2.5">
        <button
          onClick={() => handleBasicSubmit(false)}
          className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 hover:bg-primary/90 text-sm active:scale-95"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          {editingReview ? "Save Changes" : "Submit"}
        </button>
        {!editingReview && (
          <button
            onClick={() => handleBasicSubmit(true)}
            className="w-full px-4 py-2.5 rounded-lg border border-border/40 hover:bg-secondary/20 transition-all duration-200 font-medium text-sm"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            More Details
          </button>
        )}
        {editingReview && onCancel && (
          <button
            onClick={onCancel}
            className="w-full px-4 py-2.5 rounded-lg border border-border/40 hover:bg-secondary/20 transition-all duration-200 font-medium text-sm"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
