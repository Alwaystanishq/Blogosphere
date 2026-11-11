import { rateLimit } from "express-rate-limit";

function limiter(limit, message) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { success: false, message },
  });
}

// shortcut: counters are per process and reset on restart; use a shared store when scaling.
export const apiLimiter = limiter(300, "Too many requests. Please try again later.");
export const loginLimiter = limiter(10, "Too many login attempts. Please try again in 15 minutes.");
export const signupLimiter = limiter(5, "Too many signup attempts. Please try again in 15 minutes.");
