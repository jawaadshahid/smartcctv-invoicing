import { error, getErrorFromPrismaError } from "~/utils/errors";
import {
  createCustomer as insertCustomer,
  updateCustomer as putCustomers,
  deleteCustomerById as removeCustomerById,
  getCustomerById as selectCustomerById,
  getCustomers as selectCustomers,
  getCustomersBySearch as selectCustomersBySearch,
  getCustomersCount as selectCustomersCount,
} from "../models/customers";
import { validateCustomerData, validateSearchTerm } from "~/utils/validations";

type formData = { [key: string]: FormDataEntryValue };

export const getCustomers = async (data: formData) => {
  const { skip, take } = data;
  if (!skip || !take)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to retrieve customers",
    });
  const skipNum = parseInt(`${skip}`);
  const takeNum = parseInt(`${take}`);
  if (isNaN(skipNum) || isNaN(takeNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to retrieve customers",
    });
  try {
    const pagedCustomers = await selectCustomers(skipNum, takeNum);
    return Promise.resolve({ code: 200, pagedCustomers });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve customers`,
    });
  }
};

export const getCustomersCount = async () => {
  try {
    const customerCount = await selectCustomersCount();
    return Promise.resolve({ code: 200, customerCount });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve customer count`,
    });
  }
};

export const getCustomerById = async (data: formData) => {
  const { customer_id } = data;
  if (!customer_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: customer_id is undefined",
    });
  const customerIdNum = parseInt(`${customer_id}`);
  if (isNaN(customerIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: customer_id is invalid",
    });
  try {
    const customer = await selectCustomerById(customerIdNum);
    if (!customer)
      return Promise.reject({
        code: 404,
        message: "Not found: customer not found",
      });
    return Promise.resolve({ code: 200, customer });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve customer`,
    });
  }
};

export const getCustomersBySearch = async (data: formData) => {
  const { search_term } = data;
  const sanitisedTerm = `${search_term}`.trim();
  const searchTermError = validateSearchTerm(sanitisedTerm);
  if (searchTermError)
    return Promise.reject({
      code: 400,
      message: `Bad request: ${searchTermError}`,
    });
  if (!sanitisedTerm) return Promise.resolve({ code: 200, customers: [] });
  try {
    const customers = await selectCustomersBySearch(sanitisedTerm);
    return Promise.resolve({ code: 200, customers });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve customers`,
    });
  }
};

export const updateCustomer = async (data: formData) => {
  const updateCustomerErrors = validateCustomerData(data);
  if (updateCustomerErrors)
    return Promise.reject({
      code: 400,
      message: `Bad request: ${updateCustomerErrors}`,
    });
  const { customer_id } = data;
  if (!customer_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to update customer",
    });
  const customerIdNum = parseInt(`${customer_id}`);
  if (isNaN(customerIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to update customer",
    });
  try {
    const updatedCustomer = await putCustomers({
      customer_id: customerIdNum,
      ...data,
    });
    return Promise.resolve({ code: 200, updatedCustomer });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to update customer`,
    });
  }
};

export const createCustomer = async (data: any) => {
  const createCustomerErrors = validateCustomerData(data);
  if (createCustomerErrors)
    return Promise.reject({
      code: 400,
      message: `Bad request: ${createCustomerErrors}`,
    });
  try {
    const createdCustomer = await insertCustomer(data);
    return Promise.resolve({ code: 201, createdCustomer });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to create customer`,
    });
  }
};

export const deleteCustomerById = async (data: formData) => {
  const { customer_id } = data;
  if (!customer_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to delete customer",
    });
  const customerIdNum = parseInt(`${customer_id}`);
  if (isNaN(customerIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to delete customer",
    });
  try {
    const deletedCustomer = await removeCustomerById(customerIdNum);
    return Promise.resolve({ code: 201, deletedCustomer });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to delete customer`,
    });
  }
};
