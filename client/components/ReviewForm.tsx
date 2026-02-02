import { useState } from "react";
import { Star } from "lucide-react";

interface ReviewFormProps {
  projectName: string;
  onSubmit: (review: ReviewData) => void;
}

export interface ReviewData {
  name: string;
  overallRating: number;
  comment: string;
  detailedRating?: {
    idea: number;
    ui: number;
    website: number;
    usefulness: number;
  };
}

export default function ReviewForm({ projectName, onSubmit }: ReviewFormProps) {
  const [step, setStep] = useState<"basic" | "detailed">("basic");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [overallRating, setOverallRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [detailedRating, setDetailedRating] = useState({
    idea: 0,
    ui: 0,
    website: 0,
    usefulness: 0,
  });
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
        name,
        overallRating,
        comment,
      });
      resetForm();
    }
  };

  const handleDetailedSubmit = () => {
    const allRated = Object.values(detailedRating).every((r) => r > 0);
    if (!allRated) {
      alert("Please rate all categories");
      return;
    }

    onSubmit({
      name,
      overallRating,
      comment,
      detailedRating,
    });
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setComment("");
    setOverallRating(0);
    setDetailedRating({ idea: 0, ui: 0, website: 0, usefulness: 0 });
    setStep("basic");
  };

  if (step === "detailed") {
    return (
      <div className="space-y-6">
        <h4 className="font-semibold text-foreground">Rate Specific Aspects</h4>

        {(["idea", "ui", "website", "usefulness"] as const).map((category) => (
          <div key={category}>
            <label className="block text-sm font-medium text-foreground mb-2 capitalize">
              {category}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setDetailedRating({ ...detailedRating, [category]: star })
                  }
                  onMouseEnter={() => setHoveredDetailed(category)}
                  onMouseLeave={() => setHoveredDetailed(null)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={24}
                    className={`transition-colors ${
                      star <=
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

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setStep("basic")}
            className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary/30 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={handleDetailedSubmit}
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setOverallRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                size={28}
                className={`transition-colors ${
                  star <= (hoveredRating || overallRating)
                    ? "fill-primary text-primary"
                    : "text-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think?"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => handleBasicSubmit(false)}
          className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        >
          Submit
        </button>
        <button
          onClick={() => handleBasicSubmit(true)}
          className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary/30 transition-colors font-medium"
        >
          + Detailed Ratings
        </button>
      </div>
    </div>
  );
}
