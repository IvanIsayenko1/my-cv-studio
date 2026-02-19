import { useSignIn, useSignUp } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { ROUTES } from "@/config/routes";

export const ExternalLoginButtons = ({
  isSignupMode,
}: {
  isSignupMode: boolean;
}) => {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const handleGoogleAuth = async () => {
    if (!signIn || !signUp) return;

    try {
      const authMethod = isSignupMode ? signUp : signIn;
      await authMethod.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: ROUTES.SSO_CALLBACK,
        redirectUrlComplete: ROUTES.MAKER,
      });
    } catch (error) {
      console.error("Google OAuth error:", error);
    }
  };

  const handleAppleAuth = async () => {
    if (!signIn || !signUp) return;

    try {
      const authMethod = isSignupMode ? signUp : signIn;
      await authMethod.authenticateWithRedirect({
        strategy: "oauth_apple",
        redirectUrl: ROUTES.SSO_CALLBACK,
        redirectUrlComplete: ROUTES.MAKER,
      });
    } catch (error) {
      console.error("Apple OAuth error:", error);
    }
  };

  const handleGitHubAuth = async () => {
    if (!signIn || !signUp) return;

    try {
      const authMethod = isSignupMode ? signUp : signIn;
      await authMethod.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: ROUTES.SSO_CALLBACK,
        redirectUrlComplete: ROUTES.MAKER,
      });
    } catch (error) {
      console.error("GitHub OAuth error:", error);
    }
  };
  return (
    <>
      <Separator />
      <Button variant="outline" type="button" onClick={handleGoogleAuth}>
        Login with Google
      </Button>
      <Button variant="outline" type="button" onClick={handleGitHubAuth}>
        Login with GitHub
      </Button>
      <Button variant="outline" type="button" onClick={handleAppleAuth}>
        Login with Apple
      </Button>
    </>
  );
};
