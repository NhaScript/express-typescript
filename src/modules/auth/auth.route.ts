import { Router } from "express";
import { validator } from "@common/middlewares/validate.middleware";
import {
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
  "/signupWithEmail",
  validator(signupWithEmailSchema),
  signupWithEmailHandler
);
router.post(
  "/signinWithEmail",
  validator(signinWithEmailSchema),
  signinWithEmailHandler
);
router.post(
  "/signinWithTelegram",
  validator(signinWithTelegramSchema),
  signinWithTelegramHandler
);

export const authRouter = router;
