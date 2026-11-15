export default async () => {
  const site = process.env.URL || "https://www.bhajanlibrary.com";
  const secret = process.env.PLAYBACK_CHECK_SECRET;
  if (!secret) {
    return new Response("PLAYBACK_CHECK_SECRET is not set", { status: 500 });
  }

  const response = await fetch(`${site}/api/playback-check`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
  });
  return new Response(await response.text(), { status: response.status });
};

export const config = {
  schedule: "0 8 * * *",
};
