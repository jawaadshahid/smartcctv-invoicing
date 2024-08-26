import { db } from "../utils/db";

export const getCustomers = () => {
  return db.customers.findMany();
};

export const updateCustomer = async (data: any) => {
  const { customer_id, name, tel, email, address } = data;
  return db.customers.update({
    where: {
      customer_id: parseInt(`${customer_id}`),
    },
    data: {
      name: `${name}`,
      tel: `${tel}`,
      email: `${email}`,
      address: `${address}`,
    },
  });
};

export const createCustomer = (data: any) => {
  const { name, tel, email, address } = data;
  return db.customers.create({
    data: {
      name: `${name}`,
      tel: `${tel}`,
      email: `${email}`,
      address: `${address}`,
    },
  });
};

export const deleteCustomerById = (customer_id: number) => {
  return db.customers.delete({
    where: { customer_id },
  });
};
