import { NOREPLY_EMAIL } from "@/lib/site";

/** Free notice to the noreply Gmail. The public contact address is left alone. */
export async function notifyLibrary(
  subject: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${NOREPLY_EMAIL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: "Bhajan Library",
          email: NOREPLY_EMAIL,
          _replyto: NOREPLY_EMAIL,
          _subject: subject,
          _template: "box",
          _captcha: "false",
          message,
        }),
      }
    );
    const body = (await response.json().catch(() => null)) as {
      success?: string | boolean;
    } | null;
    return body?.success === true || body?.success === "true";
  } catch (err) {
    console.error("Library email failed:", err);
    return false;
  }
}
