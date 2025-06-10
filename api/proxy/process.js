export default async function handler(req, res) {
  const baseUrl = process.env.BACKEND_URL;
  // req.url will contain the full path, e.g., /api/proxy/some/other/path
  const targetPath = req.url.replace(/^\/api\/proxy/, '');
  const targetUrl = `${baseUrl}${targetPath}`;

  console.log(`Proxying request to: ${targetUrl}`);

  try {
    // Fix 1: The body received from Next.js is an OBJECT.
    // It must be stringified before being sent to the backend via fetch.
    const body =
      req.method !== 'GET' && req.method !== 'HEAD' && req.body
        ? JSON.stringify(req.body)
        : undefined;

    // Fix 2: Forward necessary headers. At a minimum, Content-Type is needed
    // for POST/PUT, and Authorization is common.
    const headers = {
      'Content-Type': 'application/json', // Your backend expects JSON
      'Authorization': req.headers.authorization || '', // Forward auth token if present
      // You can add any other headers you need to forward here
    };

    // Clean up empty headers to avoid sending them
    Object.keys(headers).forEach(key => {
      if (!headers[key]) {
        delete headers[key];
      }
    });

    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
    });

    // Pass the status, headers, and body from the backend response
    // back to the original client.
    res.status(backendResponse.status);
    backendResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const data = await backendResponse.text();
    res.send(data);

  } catch (error) {
    console.error('PROXY_ERROR:', error);
    res.status(500).json({ error: 'Proxy request failed.' });
  }
}