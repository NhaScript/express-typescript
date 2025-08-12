import { Router } from "express";
import { ValidationType, validator } from "@common/middlewares/validate.middleware";
import {
    rotateRefreshTokenHandler,
  signinWithEmailHandler,
  signinWithTelegramHandler,
  signupWithEmailHandler,
} from "./auth.controller";
import {
  signinWithEmailSchema,
  signinWithTelegramSchema,
  signupWithEmailSchema,
} from "./auth.schema";

const router = Router();

router.post(
  "/signup_with_email",
  validator(signupWithEmailSchema),
  signupWithEmailHandler
);
router.post(
  "/signin_with_email",
  validator(signinWithEmailSchema),
  signinWithEmailHandler
);
router.post(
  "/signin_with_telegram",
  validator(signinWithTelegramSchema),
  signinWithTelegramHandler
);
router.get(
  "/refresh_token",
  rotateRefreshTokenHandler
);

export const authRouter = router;
