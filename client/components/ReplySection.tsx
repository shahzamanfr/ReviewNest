import { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2, Trash2, Edit2 } from "lucide-react";
import { supabase, sessionId, getStoredUserName, setStoredUserName } from "../lib/supabase";
import { toast } from "sonner";

interface Reply {
    id: string;
    user_id: string;
    user_name: string;
    content: string;
    created_at: string;
}

interface ReplySectionProps {
    reviewId: string;
    reviewAuthorId: string;
}

export default function ReplySection({ reviewId, reviewAuthorId }: ReplySectionProps) {
    const [replies, setReplies] = useState<Reply[]>([]);
    const [newReply, setNewReply] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        fetchReplies();
    }, [reviewId]);

    const fetchReplies = async () => {
        try {
            const { data, error } = await supabase
                .from("replies")
                .select("*")
                .eq("review_id", reviewId)
                .order("created_at", { ascending: true });

            if (error) throw error;
            setReplies(data || []);
        } catch (error: any) {
            console.error("Error fetching replies:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReply.trim()) return;

        let userName = getStoredUserName();
        if (!userName) {
            const name = prompt("Please enter your name to reply:");
            if (!name || !name.trim()) return;
            userName = name.trim();
            setStoredUserName(userName);
        }

        try {
            setSubmitting(true);
            const { error } = await supabase.from("replies").insert([
                {
                    review_id: reviewId,
                    user_id: sessionId,
                    user_name: userName,
                    content: newReply.trim(),
                },
            ]);

            if (error) throw error;

            setNewReply("");
            setIsReplying(false);
            fetchReplies();
            toast.success("Reply posted!");
        } catch (error: any) {
            toast.error("Error posting reply: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReply = async (id: string) => {
        if (!confirm("Delete this reply?")) return;
        try {
            const { error } = await supabase.from("replies").delete().eq("id", id);
            if (error) throw error;
            toast.success("Reply deleted");
            fetchReplies();
        } catch (error: any) {
            toast.error("Error deleting reply: " + error.message);
        }
    };

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
            "bg-blue-400",
            "bg-purple-400",
            "bg-indigo-400",
            "bg-cyan-400",
            "bg-teal-400",
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    if (loading && replies.length === 0) {
        return null;
    }

    return (
        <div id={`reply-section-${reviewId}`} className="mt-6 ml-4 md:ml-16 space-y-4">
            {/* Replies List */}
            {replies.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border/50">
                    {replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3 group/reply animate-in slide-in-from-left-2 duration-300">
                            <div
                                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold ${getBackgroundColor(
                                    reply.user_name,
                                )}`}
                            >
                                {getInitials(reply.user_name)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[11px] font-semibold text-foreground">
                                        {reply.user_name}
                                    </span>
                                    {reply.user_id === reviewAuthorId && (
                                        <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                                            Author
                                        </span>
                                    )}
                                    <span className="text-[9px] text-muted-foreground opacity-50">
                                        {new Date(reply.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {reply.content}
                                </p>
                            </div>
                            <div className="opacity-0 group-hover/reply:opacity-100 transition-opacity">
                                {reply.user_id === sessionId && (
                                    <button
                                        onClick={() => handleDeleteReply(reply.id)}
                                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                                        title="Delete reply"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Action */}
            {!isReplying && reviewAuthorId !== sessionId ? (
                <button
                    onClick={() => setIsReplying(true)}
                    className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors py-1 uppercase tracking-widest"
                >
                    <MessageSquare size={12} />
                    Reply to this thread
                </button>
            ) : isReplying ? (
                <form onSubmit={handleSubmitReply} className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative group">
                        <textarea
                            autoFocus
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="What are your thoughts?"
                            className="w-full bg-secondary/20 border border-border rounded-lg p-3 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[80px] resize-none"
                        />
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setIsReplying(false)}
                                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                title="Cancel"
                            >
                                <span className="text-[10px] uppercase font-bold tracking-widest">Cancel</span>
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !newReply.trim()}
                                className="p-1.5 rounded-md bg-primary text-primary-foreground hover:shadow-md transition-all disabled:opacity-50"
                            >
                                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            </button>
                        </div>
                    </div>
                </form>
            ) : null}
        </div>
    );
}
