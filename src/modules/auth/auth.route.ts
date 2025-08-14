import { Router } from "express";
import { validator } from "@common/middlewares/validate.middleware";
import {
  profileHandler,
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
import { authenticate, authorize } from "@common/middlewares/auth.middlware";
import { Role } from "@common/enums/roles.enum";

const router = Router();

router.post(
  "/signup_with_email",
  authenticate,
  authorize(Role.SUPER),
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
router.get("/refresh_token", rotateRefreshTokenHandler);

router.get(
  "/profile",
  authenticate,
  authorize(Role.USER, Role.ADMIN, Role.SUPER),
  profileHandler
);


export const authRouter = router;
