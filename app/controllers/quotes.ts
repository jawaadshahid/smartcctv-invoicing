import {
  createQuote as insertQuote,
  deleteQuoteById as removeQuoteId,
  getQuoteById as selectQuoteById,
  getQuotes as selectQuotes,
} from "../models/quotes";

export const getQuotes = async () => {
  return await selectQuotes();
};

export const getQuoteById = async (quote_id: number) => {
  return await selectQuoteById(quote_id);
};

export const createQuote = async (data: any) => {
  return await insertQuote(data);
};

export const deleteQuoteById = async (quote_id: number) => {
  return await removeQuoteId(quote_id);
};
