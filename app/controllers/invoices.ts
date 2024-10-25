import { error, getErrorFromPrismaError } from "~/utils/errors";
import {
  updateInvoiceById as changeInvoiceById,
  getInvoicesByCustomerIds,
  createInvoice as insertInvoice,
  deleteInvoiceById as removeInvoiceId,
  getInvoiceById as selectInvoiceById,
  getInvoices as selectInvoices,
  getInvoicesCount as selectInvoicesCount,
} from "../models/invoices";
import { parseProductSubmissionData } from "../utils/parsers";
import { getCustomersBySearch } from "./customers";
import { getQuoteById } from "./quotes";

type formData = { [key: string]: FormDataEntryValue };

export const getInvoices = async (data: formData) => {
  const { skip, take } = data;
  if (!skip || !take)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to retrieve invoices",
    });
  const skipNum = parseInt(`${skip}`);
  const takeNum = parseInt(`${take}`);
  if (isNaN(skipNum) || isNaN(takeNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to retrieve invoices",
    });
  try {
    const pagedInvoices = await selectInvoices(skipNum, takeNum);
    return Promise.resolve({ code: 200, pagedInvoices });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve invoices`,
    });
  }
};

export const getInvoicesCount = async () => {
  try {
    const invoiceCount = await selectInvoicesCount();
    return Promise.resolve({ code: 200, invoiceCount });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve invoice count`,
    });
  }
};

export const getInvoiceById = async (data: formData) => {
  const { invoice_id } = data;
  if (!invoice_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: invoice_id is undefined",
    });
  const invoiceIdNum = parseInt(`${invoice_id}`);
  if (isNaN(invoiceIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: invoice_id is invalid",
    });
  try {
    const invoice = await selectInvoiceById(invoiceIdNum);
    if (!invoice)
      return Promise.reject({
        code: 404,
        message: "Not found: invoice not found",
      });
    return Promise.resolve({ code: 200, invoice });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve invoice`,
    });
  }
};

export const getInvoiceByCustomerSearch = async (data: formData) => {
  try {
    const { customers } = await getCustomersBySearch(data);
    const invoices = await getInvoicesByCustomerIds(
      customers.map(({ customer_id }) => customer_id)
    );
    return Promise.resolve({ code: 200, invoices });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve invoices`,
    });
  }
};

export const createInvoice = async (data: formData) => {
  const { customer, labour, discount, prodcount, ...productValues } = data;
  if (!customer)
    return Promise.reject({
      code: 400,
      message: "Bad request: you must select or define a customer",
    });
  if (Object.keys(productValues).length === 0)
    return Promise.reject({
      code: 400,
      message: "Bad request: you must select or define at least one product",
    });

  const invoicedProducts = await parseProductSubmissionData(data);
  if (!invoicedProducts) {
    return Promise.reject({
      code: 500,
      message: `Internal server error: failed to create invoice`,
    });
  }

  try {
    const createdInvoice = await insertInvoice({
      customer,
      labour,
      discount,
      invoicedProducts,
    });
    return Promise.resolve({ code: 201, createdInvoice });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to create invoice`,
    });
  }
};

export const deleteInvoiceById = async (data: formData) => {
  const { invoice_id } = data;
  if (!invoice_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to delete invoice",
    });
  const invoiceIdNum = parseInt(`${invoice_id}`);
  if (isNaN(invoiceIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to delete invoice",
    });
  try {
    const deleteAction = await removeInvoiceId(invoiceIdNum);
    return Promise.resolve({ code: 201, deletedInvoice: deleteAction[1] });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to delete invoice`,
    });
  }
};

export const updateInvoiceById = async (invoice_id: string, data: formData) => {
  if (!invoice_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to update invoice",
    });
  const invoiceIdNum = parseInt(`${invoice_id}`);
  if (isNaN(invoiceIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to update invoice",
    });
  const { customer, labour, discount, prodcount, ...productValues } = data;
  if (!customer)
    return Promise.reject({
      code: 400,
      message: "Bad request: you must select or define a customer",
    });
  if (Object.keys(productValues).length === 0)
    return Promise.reject({
      code: 400,
      message: "Bad request: you must select or define at least one product",
    });

  const invoicedProducts = await parseProductSubmissionData(data);
  if (!invoicedProducts) {
    return Promise.reject({
      code: 500,
      message: `Internal server error: failed to create invoice`,
    });
  }
  try {
    const updateAction = await changeInvoiceById({
      invoice_id: invoiceIdNum,
      customer,
      labour,
      discount,
      invoicedProducts,
    });
    return Promise.resolve({ code: 200, updatedInvoice: updateAction[2] });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to update invoice`,
    });
  }
};

export const createInvoiceFromQuoteById = async (data: formData) => {
  const { quote_id } = data;
  try {
    // retrieve quote via quote controller
    const { quote } = await getQuoteById({ quote_id });
    if (!quote)
      return Promise.reject({
        code: 400,
        message: `Bad request: failed to create invoice`,
      });

    // deconstruct all values
    const { customer_id, labour, discount, quoted_products } = quote;

    // map to invoice object schema
    const invoiceData = {
      customer: customer_id,
      labour,
      discount,
      invoicedProducts: quoted_products.map(({ name, quantity, price }) => {
        return { name, quantity, price };
      }),
    };

    const createdInvoice = await insertInvoice(invoiceData);
    return Promise.resolve({ code: 201, createdInvoice });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to create invoice`,
    });
  }
};
