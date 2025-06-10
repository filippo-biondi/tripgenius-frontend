export default async function handler(req, res) {
  const baseUrl = process.env.BACKEND_URL
  const targetPath = req.url.replace(/^\/api\/proxy/, '')
  const targetUrl = `${baseUrl}${targetPath}`
  console.log(`req: ${req}`)

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'Content-Type': req.headers['content-type'] || 'application/json',
    },
    body:
      req.method !== 'GET' && req.method !== 'HEAD'
        ? req.body
        : undefined,
  })

  const data = await response.text()
  res.status(response.status).send(data)
}