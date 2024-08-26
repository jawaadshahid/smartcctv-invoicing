import {
  createCustomer as insertCustomer,
  updateCustomer as putCustomers,
  deleteCustomerById as removeCustomerById,
  getCustomers as selectCustomers,
} from "../models/customers";

export const getCustomers = async () => {
  return await selectCustomers();
};

export const updateCustomer = async (data: any) => {
  return await putCustomers(data);
};

export const createCustomer = async (data: any) => {
  return await insertCustomer(data);
};

export const deleteCustomerById = async (customer_id: number) => {
  return await removeCustomerById(customer_id);
};
