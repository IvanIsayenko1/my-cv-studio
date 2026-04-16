export const ROUTES = {
  // HOME
  HOME: "/",
  // RELATED WITH CV
  CV_LIST: "/cv-list",
  CV_BUILD: "/build/:id",
  CHECKER: "/checker",

  // AUTH
  SIGN_UP: "/signup",
  SIGN_IN: "/login",
  SSO_CALLBACK: "/sso-callback",
  FORGOT_PASSWORD: "/forgot-password",
} as const;
