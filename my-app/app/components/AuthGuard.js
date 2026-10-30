"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export const LOGIN_PATH = "/screens/login";

// Keeps logged-out users on the login page and logged-in users off it.
// Data is protected by RLS in Supabase; this only handles the redirects.
function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  // undefined = session not checked yet, null = logged out
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isLoginPage = pathname === LOGIN_PATH;
  const shouldRedirect =
    session !== undefined && (session ? isLoginPage : !isLoginPage);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace(session ? "/" : LOGIN_PATH);
    }
  }, [shouldRedirect, session, router]);

  // Render nothing until we know where the user belongs, so protected pages
  // don't flash or fire queries that RLS would reject.
  if (session === undefined || shouldRedirect) return null;

  return children;
}

export default AuthGuard;
