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
const NAVER_CALLBACK_URL = process.env.NAVER_CALLBACK_URL || "https://oraem.cafe24app.com/api/auth/naver/callback";

// Kakao OAuth configuration
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
const KAKAO_CALLBACK_URL = process.env.KAKAO_CALLBACK_URL || "https://oraem.cafe24app.com/api/auth/kakao/callback";

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "https://oraem.cafe24app.com/api/auth/google/callback";

function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      if (req.oauthUser) {
        const user = await authStorage.getUser(req.oauthUser.id);
        return res.json(user);
      }
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
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
      return res.status(500).json({ message: "네이버 OAuth가 설정되지 않았습니다." });
    }
    const state = generateState();
    (req.session as any).oauthState = state;
    (req.session as any).oauthProvider = 'naver';
    req.session.save(() => {
      const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_CALLBACK_URL)}&state=${state}`;
      res.redirect(url);
    });
  });

  // Naver OAuth - Callback handler
  app.get("/api/auth/naver/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      const sessionState = (req.session as any).oauthState;

      if (!code || !NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
        return res.redirect("/auth/callback?error=naver_auth_failed");
      }
      if (!state || typeof state !== 'string' || state !== sessionState) {
        console.error("State mismatch. Got:", state, "Expected:", sessionState);
        return res.redirect("/auth/callback?error=invalid_state");
      }

      delete (req.session as any).oauthState;
      delete (req.session as any).oauthProvider;

      const tokenResponse = await fetch(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(NAVER_CALLBACK_URL)}&code=${code}&state=${state}`);
      const tokenData = await tokenResponse.json() as any;

      if (!tokenData.access_token) {
        console.error("Naver token error:", tokenData);
        return res.redirect("/auth/callback?error=naver_token_failed");
      }

      const profileResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const profileData = await profileResponse.json() as any;

      if (profileData.resultcode !== "00") {
        console.error("Naver profile error:", profileData);
        return res.redirect("/auth/callback?error=naver_profile_failed");
      }

      const naverUser = profileData.response;
      const user = await authStorage.upsertUser({
        id: `naver_${naverUser.id}`,
        email: naverUser.email,
        firstName: naverUser.name || naverUser.nickname,
        phone: naverUser.mobile,
        profileImageUrl: naverUser.profile_image,
      });

      (req.session as any).userId = user.id;
      (req.session as any).provider = 'naver';

      req.session.save((err) => {
        if (err) console.error("Session save error:", err);
        console.log("Naver login successful for user:", user.id);
        res.redirect("/auth/callback?login=success");
      });
    } catch (error) {
      console.error("Naver OAuth callback error:", error);
      res.redirect("/auth/callback?error=naver_auth_error");
    }
  });

  // Kakao OAuth - Start login flow
  app.get("/api/auth/kakao", (req, res) => {
    if (!KAKAO_CLIENT_ID) {
      return res.status(500).json({ message: "카카오 OAuth가 설정되지 않았습니다." });
    }
    const state = generateState();
    (req.session as any).oauthState = state;
    (req.session as any).oauthProvider = 'kakao';
    req.session.save(() => {
      const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(KAKAO_CALLBACK_URL)}&state=${state}`;
      res.redirect(url);
    });
  });

  // Kakao OAuth - Callback handler
  app.get("/api/auth/kakao/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      const sessionState = (req.session as any).oauthState;

      if (!code || !KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET) {
        return res.redirect("/auth/callback?error=kakao_auth_failed");
      }
      if (!state || typeof state !== 'string' || state !== sessionState) {
        console.error("State mismatch. Got:", state, "Expected:", sessionState);
        return res.redirect("/auth/callback?error=invalid_state");
      }

      delete (req.session as any).oauthState;
      delete (req.session as any).oauthProvider;

      const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: KAKAO_CLIENT_ID,
          client_secret: KAKAO_CLIENT_SECRET!,
          redirect_uri: KAKAO_CALLBACK_URL,
          code: code as string,
        }),
      });
      const tokenData = await tokenResponse.json() as any;

      if (!tokenData.access_token) {
        console.error("Kakao token error:", tokenData);
        return res.redirect("/auth/callback?error=kakao_token_failed");
      }

      const profileResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const profileData = await profileResponse.json() as any;

      const kakaoAccount = profileData.kakao_account || {};
      const profile = kakaoAccount.profile || {};

      const user = await authStorage.upsertUser({
        id: `kakao_${profileData.id}`,
        email: kakaoAccount.email,
        firstName: profile.nickname,
        phone: kakaoAccount.phone_number,
        profileImageUrl: profile.profile_image_url,
      });

      (req.session as any).userId = user.id;
      (req.session as any).provider = 'kakao';

      req.session.save((err) => {
        if (err) console.error("Session save error:", err);
        console.log("Kakao login successful for user:", user.id);
        res.redirect("/auth/callback?login=success");
      });
    } catch (error) {
      console.error("Kakao OAuth callback error:", error);
      res.redirect("/auth/callback?error=kakao_auth_error");
    }
  });

  // Google OAuth - Start login flow
  app.get("/api/auth/google", (req, res) => {
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "구글 OAuth가 설정되지 않았습니다." });
    }
    const state = generateState();
    (req.session as any).oauthState = state;
    (req.session as any).oauthProvider = 'google';
    req.session.save(() => {
      const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_CALLBACK_URL)}&state=${state}&scope=openid%20email%20profile`;
      res.redirect(url);
    });
  });

  // Google OAuth - Callback handler
  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const { code, state } = req.query;
      const sessionState = (req.session as any).oauthState;

      if (!code || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        return res.redirect("/auth/callback?error=google_auth_failed");
      }
      if (!state || typeof state !== 'string' || state !== sessionState) {
        console.error("State mismatch. Got:", state, "Expected:", sessionState);
        return res.redirect("/auth/callback?error=invalid_state");
      }

      delete (req.session as any).oauthState;
      delete (req.session as any).oauthProvider;

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET!,
          redirect_uri: GOOGLE_CALLBACK_URL,
          code: code as string,
        }),
      });
      const tokenData = await tokenResponse.json() as any;

      if (!tokenData.access_token) {
        console.error("Google token error:", tokenData);
        return res.redirect("/auth/callback?error=google_token_failed");
      }

      const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const profileData = await profileResponse.json() as any;

      const user = await authStorage.upsertUser({
        id: `google_${profileData.id}`,
        email: profileData.email,
        firstName: profileData.given_name || profileData.name,
        lastName: profileData.family_name,
        profileImageUrl: profileData.picture,
      });

      (req.session as any).userId = user.id;
      (req.session as any).provider = 'google';

      req.session.save((err) => {
        if (err) console.error("Session save error:", err);
        console.log("Google login successful for user:", user.id);
        res.redirect("/auth/callback?login=success");
      });
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.redirect("/auth/callback?error=google_auth_error");
    }
  });

  // Local email/password login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "이메일과 비밀번호를 입력해주세요." });
      }
      const user = await authStorage.verifyLocalPassword(email, password);
      if (!user) {
        return res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
      }
      (req.session as any).userId = user.id;
      (req.session as any).provider = 'local';
      req.session.save((err) => {
        if (err) console.error("Session save error:", err);
        console.log("Local login successful for user:", user.id);
        res.json({ success: true, user });
      });
    } catch (error) {
      console.error("Local login error:", error);
      res.status(500).json({ message: "로그인 처리 중 오류가 발생했습니다." });
    }
  });

  // Local email/password register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, phone } = req.body;
      if (!email || !password || !firstName) {
        return res.status(400).json({ message: "이름, 이메일, 비밀번호를 모두 입력해주세요." });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "비밀번호는 6자 이상이어야 합니다." });
      }
      const existing = await authStorage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "이미 가입된 이메일입니다." });
      }
      const user = await authStorage.createLocalUser(email, password, firstName, phone);
      (req.session as any).userId = user.id;
      (req.session as any).provider = 'local';
      req.session.save((err) => {
        if (err) console.error("Session save error:", err);
        console.log("Local register successful for user:", user.id);
        res.json({ success: true, user });
      });
    } catch (error) {
      console.error("Local register error:", error);
      res.status(500).json({ message: "회원가입 처리 중 오류가 발생했습니다." });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) console.error("Session destroy error:", err);
      res.json({ success: true });
    });
  });

  // OAuth signup with name, phone and email
  app.post("/api/auth/oauth-signup", async (req, res) => {
    try {
      const validatedData = oauthSignupSchema.parse(req.body);
      const { provider, name, phone, email } = validatedData;

      const existingUser = await authStorage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "이미 가입된 이메일입니다." });
      }

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
