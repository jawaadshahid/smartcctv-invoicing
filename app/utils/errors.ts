import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export type error = {
  message: string;
  code: number;
};

export const getErrorFromPrismaError = (error: any): error => {
  if (
    error instanceof PrismaClientKnownRequestError &&
    error.code.substring(0, 2) === "P2"
  ) {
    return { code: 400, message: "Bad request" };
  }
  return { code: 500, message: "Internal server error" };
};
