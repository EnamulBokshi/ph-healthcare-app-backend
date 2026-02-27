import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../helpers/sendResponse";
import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { ICreateAdminPayload } from "./user.interface";
import { tokenUtils } from "../../utils/token";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  if (
    !payload.doctor ||
    !payload.doctor.name ||
    !payload.doctor.email ||
    !payload.password
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      "Missing required fields: doctor.name, doctor.email, password",
    );
  }
  const result = await UserService.createDoctor(payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload: ICreateAdminPayload = req.body;

  if (!payload.body.admin.name || !payload.body.admin.email || !payload.body.password) {
    throw new AppError(
      status.BAD_REQUEST,
      "Missing required fields: admin.name, admin.email, password",
    );
  }
  const result = await UserService.createAdmin(payload);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});
const createSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload: ICreateAdminPayload = req.body;

  if (!payload.body.admin.name || !payload.body.admin.email || !payload.body.password) {
    throw new AppError(
      status.BAD_REQUEST,
      "Missing required fields: admin.name, admin.email, password",
    );
  }
  const result = await UserService.createSuperAdmin(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Super Admin created successfully",
    data: result,
  });
});

export const UserController = {
  createDoctor,
  createAdmin,
  createSuperAdmin,
};
