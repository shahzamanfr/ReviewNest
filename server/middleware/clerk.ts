import { createClerkClient } from "@clerk/clerk-sdk-node";
import { Request, Response, NextFunction } from "express";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const withAuth = async (req: Request, res: Response, Next: NextFunction) => {
    try {
        const sessionToken = req.headers.authorization?.split(" ")[1];
        if (!sessionToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { sub: userId } = await clerkClient.verifyToken(sessionToken);
        (req as any).auth = { userId };
        Next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
};
