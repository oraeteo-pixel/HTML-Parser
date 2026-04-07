import { useEffect } from "react";

export default function OAuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const login = params.get("login");
    const error = params.get("error");

    if (window.opener) {
      window.opener.postMessage(
        { type: "oauth_callback", login, error },
        window.location.origin
      );
      window.close();
    } else {
      // 팝업이 아닌 경우 (직접 접근 등) - 캘린더 페이지로
      if (login === "success") {
        window.location.href = "/calendar?login=success";
      } else {
        window.location.href = "/calendar" + (error ? `?error=${error}` : "");
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">로그인 처리 중...</p>
      </div>
    </div>
  );
}
