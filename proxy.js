export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const proxyKey = req.headers["x-proxy-key"];
  if (proxyKey !== process.env.PROXY_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const authHeader = req.headers["x-unipay-auth"];

  try {
    const response = await fetch("https://api.unipaybr.com/api/user/transactions", {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
        "User-Agent": "DiaLOG/1.0",
        "Accept": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.text();
    res.status(response.status).setHeader("Content-Type", "application/json").send(data);
  } catch (err) {
    res.status(502).json({ error: "Proxy error", message: err.message });
  }
}
