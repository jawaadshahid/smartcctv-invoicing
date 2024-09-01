import { db } from "../utils/db";

export const getUsers = () => {
  return db.users.findMany();
};

export const getUserByEmail = (email: string) => {
  return db.users.findFirst({
    where: { email },
  });
};

export const getUserById = (id: number) => {
  return db.users.findFirst({
    where: { id },
  });
};

export const createUser = (isAdmin: boolean, data: any) => {
  const { firstname, lastname, address, email, password } = data;
  return db.users.create({
    data: {
      firstName: `${firstname}`,
      lastName: `${lastname}`,
      address: `${address}`,
      email: `${email}`,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAdmin: isAdmin ? 1 : 0,
      isApproved: isAdmin ? 1 : 0,
    },
  });
};

export const updateUserById = (id: number, data: any) => {
  const { firstname, lastname, address, email, newpassword } = data;
  return db.users.update({
    where: {
      id,
    },
    data: {
      firstName: `${firstname}`,
      lastName: `${lastname}`,
      address: `${address}`,
      email: `${email}`,
      ...(newpassword && { password: newpassword }),
      updatedAt: new Date(),
    },
  });
};

export const approveUserById = (id: number) => {
  return db.users.update({
    where: { id },
    data: { isApproved: 1 },
  });
};

export const deleteUserById = (id: number) => {
  return db.users.delete({
    where: { id },
  });
};
