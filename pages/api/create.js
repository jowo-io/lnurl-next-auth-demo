import lnurl from "lnurl";
import { randomBytes } from "crypto";

export default async function handler(req, res) {
  const k1 = randomBytes(32).toString("hex");
  console.log({ k1 });
  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/validate?k1=${k1}&tag=login`;
  console.log({ callbackUrl });
  const encoded = lnurl.encode(callbackUrl).toUpperCase();
  console.log({ encoded });

  res.send(
    JSON.stringify({
      status: "OK",
      success: true,
      k1,
      callbackUrl,
      lnurl: `lightning:${encoded}`,
    })
  );
}
