import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  themeId: string;
  themeTitle?: string;
  characterId?: string | null;
  characterName?: string | null;
  characterPhoto?: string | null; // data URL
  myPhoto?: string | null; // data URL
  concept?: string;
};

/** Split a `data:<mime>;base64,<data>` URL into its parts. */
function parseDataUrl(url?: string | null) {
  if (!url) return null;
  const m = /^data:(.+?);base64,(.*)$/s.exec(url);
  if (!m) return null;
  return { mimeType: m[1], data: m[2] };
}

/** Prompt that asks the model to realisticize the character while preserving the user's real face. */
function buildPrompt(b: Body) {
  const scene = b.concept?.trim()
    ? `Scene/concept: ${b.concept.trim()}.`
    : "Scene: a natural candid couple selfie.";
  return [
    `Create a single photorealistic photo for a "${b.themeTitle ?? b.themeId}" photo booth.`,
    `Two people are together in one frame.`,
    `Person A is the AI character${b.characterName ? ` "${b.characterName}"` : ""} — render them as a realistic, lifelike human.`,
    `Person B is the user: KEEP the user's real face and identity exactly as in their uploaded photo. Do not alter or beautify their face.`,
    scene,
    `Natural lighting, believable perspective, high quality, looks like a real phone photo.`,
  ].join(" ");
}

/** Google Gemini image generation (a.k.a. "nano-banana"). image+image -> image. */
async function generateWithGemini(b: Body): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const model = process.env.IMAGE_MODEL || "gemini-2.5-flash-image";
  const parts: unknown[] = [{ text: buildPrompt(b) }];

  for (const url of [b.characterPhoto, b.myPhoto]) {
    const p = parseDataUrl(url);
    if (p) parts.push({ inlineData: { mimeType: p.mimeType, data: p.data } });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { responseModalities: ["IMAGE"] },
      }),
    }
  );

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini ${res.status}: ${txt.slice(0, 300)}`);
  }

  const json = await res.json();
  const out = json?.candidates?.[0]?.content?.parts?.find(
    (p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData
  );
  if (!out?.inlineData?.data) {
    throw new Error("모델이 이미지를 반환하지 않았어요.");
  }
  return `data:${out.inlineData.mimeType};base64,${out.inlineData.data}`;
}

/** No-API-key fallback so the flow is demoable locally. Returns a labelled placeholder. */
function mockImage(b: Body): string {
  const concept = b.concept?.trim() || "커플 셀카";
  const name = b.characterName || "캐릭터";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffd1e3"/>
      <stop offset="1" stop-color="#ff6fa8"/>
    </linearGradient>
  </defs>
  <rect width="720" height="900" fill="url(#g)"/>
  <text x="360" y="380" font-size="120" text-anchor="middle">📸</text>
  <text x="360" y="500" font-size="40" font-family="sans-serif" fill="#7a1340" text-anchor="middle" font-weight="bold">${name} ❤ 나</text>
  <text x="360" y="560" font-size="28" font-family="sans-serif" fill="#9d2456" text-anchor="middle">${concept}</text>
  <text x="360" y="840" font-size="22" font-family="sans-serif" fill="#9d2456" text-anchor="middle" opacity="0.8">DEMO · set GEMINI_API_KEY for real AI</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  if (!body.myPhoto) {
    return NextResponse.json({ error: "내 사진을 업로드해주세요." }, { status: 400 });
  }
  if (!body.characterId && !body.characterPhoto) {
    return NextResponse.json({ error: "캐릭터를 선택해주세요." }, { status: 400 });
  }

  try {
    const provider = process.env.GEMINI_API_KEY ? "gemini" : "mock";
    const image =
      provider === "gemini" ? await generateWithGemini(body) : mockImage(body);
    return NextResponse.json({ image, provider });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "생성 중 오류" },
      { status: 500 }
    );
  }
}
