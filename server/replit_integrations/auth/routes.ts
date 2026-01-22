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

// Naver OAuth configuration
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_CALLBACK_URL = process.env.NAVER_CALLBACK_URL || "https://orae.com/api/auth/naver/callback";

// Simple in-memory state store for OAuth CSRF protection
const oauthStates = new Map<string, { createdAt: number }>();

// Clean up old states (older than 10 minutes)
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(oauthStates.entries());
  entries.forEach(([state, data]) => {
    if (now - data.createdAt > 10 * 60 * 1000) {
      oauthStates.delete(state);
    }
  });
}, 60 * 1000);

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

  // Naver OAuth - Start login flow
  app.get("/api/auth/naver", (req, res) => {
    if (!NAVER_CLIENT_ID) {
      return res.status(500).json({ message: "네이버 OAuth가 설정되지 않았습니다. NAVER_CLIENT_ID를 설정해주세요." });
    }
    
    // Generate and store state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    oauthStates.set(state, { createdAt: Date.now() });
    
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_CALLBACK_URL)}&state=${state}`;
    
    res.redirect(naverAuthUrl);
  });

  // Naver OAuth - Callback handler
  app.get("/api/auth/naver/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      
      if (!code || !NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
        return res.redirect("/?error=naver_auth_failed");
      }

      // Validate state for CSRF protection
      if (!state || typeof state !== 'string' || !oauthStates.has(state)) {
        return res.redirect("/?error=invalid_state");
      }
      oauthStates.delete(state);
      
      // Exchange code for access token
      const tokenResponse = await fetch(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(NAVER_CALLBACK_URL)}&code=${code}&state=${state}`);
      const tokenData = await tokenResponse.json() as any;
      
      if (!tokenData.access_token) {
        console.error("Naver token error:", tokenData);
        return res.redirect("/?error=naver_token_failed");
      }

      // Get user profile from Naver
      const profileResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const profileData = await profileResponse.json() as any;
      
      if (profileData.resultcode !== "00") {
        console.error("Naver profile error:", profileData);
        return res.redirect("/?error=naver_profile_failed");
      }

      const naverUser = profileData.response;
      
      // Create or update user
      const user = await authStorage.upsertUser({
        id: `naver_${naverUser.id}`,
        email: naverUser.email,
        firstName: naverUser.name || naverUser.nickname,
        phone: naverUser.mobile,
        profileImageUrl: naverUser.profile_image,
      });

      // Set session cookie for the user
      (req.session as any).userId = user.id;
      (req.session as any).provider = 'naver';
      
      res.redirect("/calendar?login=success");
    } catch (error) {
      console.error("Naver OAuth callback error:", error);
      res.redirect("/?error=naver_auth_error");
    }
  });

  // Kakao OAuth - Start login flow (placeholder)
  app.get("/api/auth/kakao", (req, res) => {
    res.status(501).json({ message: "카카오 로그인은 준비 중입니다. KAKAO_CLIENT_ID와 KAKAO_CLIENT_SECRET이 필요합니다." });
  });

  // Google OAuth - Start login flow (placeholder)
  app.get("/api/auth/google", (req, res) => {
    res.status(501).json({ message: "구글 로그인은 준비 중입니다. GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET이 필요합니다." });
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
