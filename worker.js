// ============================================================
// Cloudflare Worker - Bot Control Proxy
// يحل مشكلة CORS ويوصل طلبات البانل
// ============================================================

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// السيرفرات وبياناتها (مخزنة في الـ Worker آمنة)
const SERVERS = {
  "0": {
    panel: "https://control.bot-hosting.net",
    serverId: "769756f0-616d-4420-9ada-e83cb5b451d5",
    apiKey: "ptlc_8WoTxKr4VWm27yzC0CpZfukFFUltQdNiJ3xl07TN2B9"
  },
  "1": {
    panel: "https://panel.orihost.com",
    serverId: "35c9751e-8599-4b9f-92a3-82981a197f25",
    apiKey: "ptlc_YePOKcQnXPt7cOcvHx7lINf4KmBFTrcIlYHmDTDYLi9"
  },
  "2": {
    panel: "https://panel.orihost.com",
    serverId: "3831b06c-5f3c-4702-9b48-39068e41dcb2",
    apiKey: "ptlc_K8rTSvja96RYclU7v88y4zhMk7Z0GG2lNvrPs2PEzdd"
  }
};

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  // GET /status/:id  - جيب حالة سيرفر
  // POST /power/:id  - أرسل أمر تشغيل/إيقاف/رستارت
  const statusMatch = path.match(/^\/status\/(\d+)$/);
  const powerMatch  = path.match(/^\/power\/(\d+)$/);

  if (statusMatch) {
    const id = statusMatch[1];
    const server = SERVERS[id];
    if (!server) return jsonResponse({ error: "Server not found" }, 404);
    return await getStatus(server);
  }

  if (powerMatch && request.method === "POST") {
    const id = powerMatch[1];
    const server = SERVERS[id];
    if (!server) return jsonResponse({ error: "Server not found" }, 404);
    const body = await request.json().catch(() => ({}));
    return await sendPower(server, body.signal);
  }

  return jsonResponse({ error: "Not found" }, 404);
}

async function getStatus(server) {
  try {
    const res = await fetch(
      `${server.panel}/api/client/servers/${server.serverId}/resources`,
      {
        headers: {
          "Authorization": `Bearer ${server.apiKey}`,
          "Accept": "application/json"
        }
      }
    );
    const data = await res.json();
    const state = data?.attributes?.current_state || "unknown";
    return jsonResponse({ state });
  } catch (e) {
    return jsonResponse({ state: "error", message: e.message }, 500);
  }
}

async function sendPower(server, signal) {
  try {
    const res = await fetch(
      `${server.panel}/api/client/servers/${server.serverId}/power`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${server.apiKey}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ signal })
      }
    );
    if (res.status === 204 || res.ok) {
      return jsonResponse({ ok: true });
    }
    return jsonResponse({ ok: false, status: res.status }, res.status);
  } catch (e) {
    return jsonResponse({ ok: false, message: e.message }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
  });
}
