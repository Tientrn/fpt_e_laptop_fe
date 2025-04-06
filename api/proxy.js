export default async function handler(req, res) {
  const targetUrl = "http://fptsharelaptop.somee.com/api" + req.url;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ message: "Proxy error", detail: err.message });
  }
}
