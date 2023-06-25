import { useState, useEffect } from "react";
import { getServerSession } from "next-auth/next";
import { getProviders, getCsrfToken, signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Lightning from "../components/lightning";

// export const getServerSideProps = async (ctx) => {
//   const session = await getServerSession(ctx.req, ctx.res, authOptions);

//   // If the user is already logged in, redirect.
//   // Note: Make sure not to redirect to the same page
//   // To avoid an infinite loop!
//   if (session) {
//     return { redirect: { destination: "/" } };
//   }

//   const csrfToken = await getCsrfToken(ctx); // TODO - add csrf token back in

//   return {
//     props: {csrfToken},
//   };
// };

const ping = async (k1, callbackUrl) => {
  const response = await fetch("/api/ping", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ k1 }),
    cache: "default",
  });

  const data = await response.json();
  console.log(data);
  if (!data.pubkey) return;

  await signIn("lightning", {
    pubkey: data.pubkey,
    k1,
    callbackUrl,
  });
};

export default function AuthPage({ providers }) {
  const session = useSession();
  const [lnAuth, setAuth] = useState();

  async function create() {
    const response = await fetch("/api/create");
    const data = await response.json();
    setAuth({
      lnurl: data.lnurl,
      k1: data.k1,
      callbackUrl: process.env.NEXT_PUBLIC_SITE_URL,
    });
  }

  // create the lnurl
  useEffect(() => {
    create();
  }, []);

  // poll to check for updated auth state
  useEffect(() => {
    if (
      !lnAuth ||
      !lnAuth.k1 ||
      !lnAuth.callbackUrl ||
      (session && session.data)
    )
      return;

    const intervalId = setInterval(
      () => ping(lnAuth.k1, lnAuth.callbackUrl),
      1000
    );

    return () => clearInterval(intervalId);
  }, [lnAuth, session]);

  // reset the QR code ever 2 minutes
  useEffect(() => {
    if (!lnAuth || !lnAuth.lnurl) return;

    let timer = setTimeout(() => create(), 2 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [lnAuth]);

  return (
    <div>
      <Lightning lnurl={lnAuth ? lnAuth.lnurl : undefined} />
    </div>
  );
}
