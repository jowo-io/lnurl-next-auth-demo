import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const Home = () => {
  const session = useSession();

  return (
    <div>
      <h3>Auth session:</h3>
      <pre className="hero">{JSON.stringify(session, null, 2)}</pre>

      {session && session.data ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <Link href="/auth">Sign in</Link>
      )}

      <style jsx>{`
        .hero {
          maxwidth: 600px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default Home;
