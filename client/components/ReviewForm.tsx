import { useState } from "react";
import { Star } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

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
  const { user } = useUser();
  const [step, setStep] = useState<"basic" | "detailed">("basic");
  const [tempName, setTempName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

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
  const [hoveredDetailed, setHoveredDetailed] = useState<string | null>(null);

  const fullName = user?.fullName || editingReview?.name || "";

  const handleUpdateName = async () => {
    if (!tempName.trim()) return;
    setIsUpdatingName(true);
    try {
      const parts = tempName.trim().split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");
      await user?.update({
        firstName,
        lastName: lastName || "",
      });
    } catch (error: any) {
      alert("Error updating name: " + error.message);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleBasicSubmit = (includeDetailed: boolean) => {
    if (overallRating === 0) {
      alert("Please enter a rating");
      return;
    }

    if (includeDetailed) {
      setStep("detailed");
    } else {
      onSubmit({
        ...(editingReview?.id ? { id: editingReview.id } : {}),
        name: fullName,
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
      name: fullName,
      overallRating,
      comment,
      detailedRating,
    });
    if (!editingReview) resetForm();
  };

  const resetForm = () => {
    setComment("");
    setOverallRating(0);
    setDetailedRating({ idea: 0, ui: 0, website: 0, usefulness: 0 });
    setStep("basic");
  };

  if (!user?.fullName && !editingReview) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <label className="block text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            One-time Profile Setup
          </label>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Please set a permanent display name for your account. This name will be used for all your reviews.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Your Full Name (e.g. John Doe)"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
              style={{ fontFamily: '"Inter", sans-serif' }}
            />
            <button
              onClick={handleUpdateName}
              disabled={isUpdatingName || !tempName.trim()}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {isUpdatingName ? "Saving..." : "Save Name & Continue"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "detailed") {
    return (
      <div className="space-y-7">
        <h4 className="font-medium text-foreground" style={{ fontFamily: '"Sora", sans-serif', fontWeight: 400 }}>
          Detailed Ratings
        </h4>
        {(["idea", "ui", "website", "usefulness"] as const).map((category) => (
          <div key={category}>
            <label className="block text-xs text-muted-foreground mb-2.5 uppercase tracking-wider font-medium capitalize" style={{ fontFamily: '"Inter", sans-serif' }}>
              {category}
            </label>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setDetailedRating({ ...detailedRating, [category]: star })}
                  onMouseEnter={() => setHoveredDetailed(category)}
                  onMouseLeave={() => setHoveredDetailed(null)}
                  className="transition-transform duration-150 hover:scale-125"
                >
                  <Star
                    size={18}
                    className={`transition-colors ${star <= (hoveredDetailed === category ? hoveredRating : detailedRating[category]) ? "fill-accent text-accent" : "text-muted"}`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="flex gap-2.5 pt-4">
          <button onClick={() => setStep("basic")} className="flex-1 px-4 py-2.5 rounded border border-border/40 hover:bg-secondary/20 transition-all duration-200 font-medium text-sm">Back</button>
          <button onClick={handleDetailedSubmit} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 font-medium text-sm">
            {editingReview ? "Save Changes" : "Confirm"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2 p-3 rounded-xl bg-secondary/20 border border-border/10">
        <img src={user?.imageUrl} alt="" className="w-8 h-8 rounded-full ring-2 ring-primary/20" />
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Reviewing as</span>
          <span className="text-sm font-semibold text-foreground leading-tight">{fullName}</span>
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>
          Rate It
        </label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setOverallRating(star)} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} className="transition-transform duration-150 hover:scale-125">
              <Star size={20} className={`transition-colors ${star <= (hoveredRating || overallRating) ? "fill-primary text-primary" : "text-muted"}`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>
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
        <button onClick={() => handleBasicSubmit(false)} className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-200 hover:bg-primary/90 text-sm active:scale-95 shadow-lg shadow-primary/10">
          {editingReview ? "Save Changes" : "Submit"}
        </button>
        {!editingReview && <button onClick={() => handleBasicSubmit(true)} className="w-full px-4 py-2.5 rounded-lg border border-border/40 hover:bg-secondary/20 transition-all duration-200 font-medium text-sm">More Details</button>}
        {editingReview && onCancel && <button onClick={onCancel} className="w-full px-4 py-2.5 rounded-lg border border-border/40 hover:bg-secondary/20 transition-all duration-200 font-medium text-sm">Cancel</button>}
      </div>
    </div>
  );
}
