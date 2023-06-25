import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { k1 } = req.body;
  console.log("k1", k1);

  let data;
  try {
    data = await kv.get(`k1:${k1}`);
  } catch (e) {
    data = {};
  }

  res.send(
    JSON.stringify({
      status: "OK",
      success: true,
      k1,
      ...data,
    })
  );
}
