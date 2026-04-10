# Sentinel Journal

## 2025-04-10 - Preventing DoS via External API Resource Exhaustion
**Vulnerability:** The application made external network requests using `fetch` without any timeout configured.
**Learning:** By default, Node's `fetch` does not have a timeout. If the external service (`open-meteo.com` in this case) hangs, the request will block indefinitely. In high-throughput environments, this can lead to connection pool exhaustion and eventually cause a Denial of Service (DoS).
**Prevention:** Always use `AbortSignal.timeout(ms)` when making external network requests to fail fast and release resources if the external service is slow or unresponsive.
