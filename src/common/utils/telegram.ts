import { envConfig } from "@config/env";
import { SigninWithTelegramInput } from "@modules/auth/auth.schema";
import crypto from "crypto";

export const validateTelegramAuth = (
  userData: SigninWithTelegramInput
): boolean => {
  const { hash, ...rest } = userData;

  const secretKey = crypto
    .createHash("sha256")
    .update(envConfig.telegram.botToken)
    .digest();

  const dataCheckString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${String(rest[key as keyof typeof rest])}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  console.log("dataCheckString:\n", dataCheckString);
  console.log("hmac:", hmac);
  console.log("telegram hash:", hash);

  return hmac === hash.toLowerCase(); // Ensure both are lowercase
};

export function isValidTelegramAuthDate(authDate: number): boolean {
  const MAX_AUTH_AGE = 5 * 60; // 5 minutes in seconds
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  return currentTime - authDate <= MAX_AUTH_AGE;
}
