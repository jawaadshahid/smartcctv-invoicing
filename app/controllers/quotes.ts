import { error, getErrorFromPrismaError } from "~/utils/errors";
import { parseProductSubmissionData } from "~/utils/parsers";
import {
  updateQuoteById as changeQuoteById,
  getQuotesByCustomerIds,
  createQuote as insertQuote,
  deleteQuoteById as removeQuoteId,
  getQuoteById as selectQuoteById,
  getQuotes as selectQuotes,
  getQuotesCount as selectQuotesCount,
} from "../models/quotes";
import { getCustomersBySearch } from "./customers";

type formData = { [key: string]: FormDataEntryValue };

export const getQuotes = async (data: formData) => {
  const { skip, take } = data;
  if (!skip || !take)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to retrieve quotes",
    });
  const skipNum = parseInt(`${skip}`);
  const takeNum = parseInt(`${take}`);
  if (isNaN(skipNum) || isNaN(takeNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to retrieve quotes",
    });
  try {
    const pagedQuotes = await selectQuotes(skipNum, takeNum);
    return Promise.resolve({ code: 200, pagedQuotes });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve quotes`,
    });
  }
};

export const getQuotesCount = async () => {
  try {
    const quoteCount = await selectQuotesCount();
    return Promise.resolve({ code: 200, quoteCount });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve quote count`,
    });
  }
};

export const getQuoteById = async (data: formData) => {
  const { quote_id } = data;
  if (!quote_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: quote_id is undefined",
    });
  const quoteIdNum = parseInt(`${quote_id}`);
  if (isNaN(quoteIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: quote_id is invalid",
    });
  try {
    const quote = await selectQuoteById(quoteIdNum);
    if (!quote)
      return Promise.reject({
        code: 404,
        message: "Not found: quote not found",
      });
    return Promise.resolve({ code: 200, quote });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve quote`,
    });
  }
};

export const getQuotesByCustomerSearch = async (data: formData) => {
  try {
    const { customers } = await getCustomersBySearch(data);
    const quotes = await getQuotesByCustomerIds(
      customers.map(({ customer_id }) => customer_id)
    );
    return Promise.resolve({ code: 200, quotes });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to retrieve quotes`,
    });
  }
};

export const createQuote = async (data: formData) => {
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

  const quotedProducts = await parseProductSubmissionData(data);
  if (!quotedProducts) {
    return Promise.reject({
      code: 500,
      message: `Internal server error: failed to create quote`,
    });
  }

  try {
    const createdQuote = await insertQuote({
      customer,
      labour,
      discount,
      quotedProducts,
    });
    return Promise.resolve({ code: 201, createdQuote });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to create quote`,
    });
  }
};

export const deleteQuoteById = async (data: formData) => {
  const { quote_id } = data;
  if (!quote_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to delete quote",
    });
  const quoteIdNum = parseInt(`${quote_id}`);
  if (isNaN(quoteIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to delete quote",
    });
  try {
    const deleteAction = await removeQuoteId(quoteIdNum);
    return Promise.resolve({ code: 201, deletedQuote: deleteAction[1] });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to delete quote`,
    });
  }
};

export const updateQuoteById = async (quote_id: string, data: formData) => {
  if (!quote_id)
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to update quote",
    });
  const quoteIdNum = parseInt(`${quote_id}`);
  if (isNaN(quoteIdNum))
    return Promise.reject({
      code: 400,
      message: "Bad request: failed to update quote",
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

  const quotedProducts = await parseProductSubmissionData(data);
  if (!quotedProducts) {
    return Promise.reject({
      code: 500,
      message: `Internal server error: failed to create quote`,
    });
  }
  try {
    const updateAction = await changeQuoteById({
      quote_id: quoteIdNum,
      customer,
      labour,
      discount,
      quotedProducts,
    });
    return Promise.resolve({ code: 200, updatedQuote: updateAction[2] });
  } catch (error) {
    console.log({ error });
    const { code, message }: error = getErrorFromPrismaError(error);
    return Promise.reject({
      code,
      message: `${message}: failed to update quote`,
    });
  }
};
