import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

export default function AuthButton() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="h-10 w-32 bg-secondary/20 animate-pulse rounded-lg" />
        );
    }

    return (
        <div className="flex items-center gap-2 md:gap-3">
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-2.5 bg-background border border-border/50 hover:border-primary/30 text-foreground text-sm font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group whitespace-nowrap">
                        Sign In
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-sm font-semibold text-foreground leading-tight">
                            {user?.fullName || user?.username || "Friend"}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70 font-medium">
                            Active Session
                        </span>
                    </div>
                    <UserButton afterSignOutUrl="/" appearance={{
                        elements: {
                            avatarBox: "w-8 h-8 md:w-10 md:h-10 border border-border/50 hover:border-primary/50 transition-all"
                        }
                    }} />
                </div>
            </SignedIn>
        </div>
    );
}
