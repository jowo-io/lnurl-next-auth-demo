import { verifyAuthorizationSignature } from "lnurl";
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { k1, key: pubkey, sig } = req.query;
  console.log({ k1, pubkey, sig });
  const authorize = await verifyAuthorizationSignature(sig, k1, pubkey);
  console.log({ authorize });

  if (!authorize) {
    return res.status(400).json({
      success: false,
      error: "Error in keys.",
    });
  }

  await kv.set(`k1:${k1}`, {
    k1: k1,
    pubkey: pubkey,
  });

  res.send(JSON.stringify({ status: "OK", success: true, k1 }));
}
