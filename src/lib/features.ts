// Keep unfinished learning features local until they are ready to launch.
// Shared by server routes and client navigation; Next.js inlines NODE_ENV.
export const LEARN_ENABLED = process.env.NODE_ENV === "development";
export const TRADITIONAL_CHUTNEY_ENABLED = process.env.NODE_ENV === "development";
