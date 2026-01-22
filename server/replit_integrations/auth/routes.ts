import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { z } from "zod";

const oauthSignupSchema = z.object({
  provider: z.enum(["naver", "kakao", "google"]),
  name: z.string().min(1, "이름을 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
  email: z.string().email("올바른 이메일 형식을 입력해주세요"),
});

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // OAuth signup with name, phone and email
  app.post("/api/auth/oauth-signup", async (req, res) => {
    try {
      const validatedData = oauthSignupSchema.parse(req.body);
      const { provider, name, phone, email } = validatedData;

      // Check if email already exists
      const existingUser = await authStorage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "이미 가입된 이메일입니다." });
      }

      // Create new user with OAuth provider info
      const user = await authStorage.upsertUser({
        email,
        phone,
        firstName: name,
      });

      res.json({ success: true, user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("OAuth signup error:", error);
      res.status(500).json({ message: "가입 처리 중 오류가 발생했습니다." });
    }
  });
}
