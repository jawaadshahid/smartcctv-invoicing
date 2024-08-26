import {
  createUser as insertUser,
  approveUserById as putUserApprovalById,
  updateUserById as putUserById,
  deleteUserById as removeUserById,
  getUserByEmail as selectUserByEmail,
  getUserById as selectUserById,
  getUsers as selectUsers,
} from "../models/users";

export const getUsers = async () => {
  return await selectUsers();
};

export const getUserByEmail = async (email: string) => {
  return await selectUserByEmail(email);
};

export const getUserById = async (id: number) => {
  return await selectUserById(id);
};

export const createUser = async (isAdmin: boolean, data: any) => {
  return await insertUser(isAdmin, data);
};

export const updateUserById = async (id: number, data: any) => {
  return await putUserById(id, data);
};

export const approveUserById = async (id: number) => {
  return await putUserApprovalById(id);
};

export const deleteUserById = async (id: number) => {
  return await removeUserById(id);
};
