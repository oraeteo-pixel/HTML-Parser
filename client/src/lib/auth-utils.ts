export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

// Show login modal by dispatching a global event
export function redirectToLogin(toast?: (options: { title: string; description: string; variant: string }) => void) {
  if (toast) {
    toast({
      title: "로그인 필요",
      description: "로그인이 필요한 기능입니다.",
      variant: "destructive",
    });
  }
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('showLoginModal'));
  }, 300);
}
