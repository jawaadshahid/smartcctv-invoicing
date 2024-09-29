import { Prisma, products } from "@prisma/client";
import {
  getInvoicesByCustomerIds,
  createInvoice as insertInvoice,
  deleteInvoiceById as removeInvoiceId,
  getInvoiceById as selectInvoiceById,
  getInvoices as selectInvoices,
  getInvoicesCount as selectInvoicesCount,
} from "../models/invoices";
import { getCustomersBySearch } from "./customers";
import { getProductsByIds } from "./products";
import { getQuoteById } from "./quotes";

export const getInvoices = async (skip: number, take: number) => {
  return await selectInvoices(skip, take);
};

export const getInvoicesCount = async () => {
  return await selectInvoicesCount();
};

export const getInvoiceById = async (invoice_id: number) => {
  return await selectInvoiceById(invoice_id);
};

export const getInvoiceByCustomerSearch = async (search_term: string) => {
  const customers = await getCustomersBySearch(search_term);
  return await getInvoicesByCustomerIds(
    customers.map(({ customer_id }) => customer_id)
  );
};

export const createInvoice = async (data: any) => {
  const { customer, labour, discount, prodcount, ...productValues } = data;

  if (!customer) return Promise.reject("you must select or define a customer!");

  if (Object.keys(productValues).length === 0)
    return Promise.reject("you must select or define at least one product!");

  // retrieves products from compiled promises
  const productIds = [...Array(parseInt(`${prodcount}`))]
    .map((e, i) => parseInt(`${productValues[`np_${i + 1}_id`]}`))
    .filter((val) => !isNaN(val));
  let retrievedSelectedProds: (products | null)[] = [];
  try {
    retrievedSelectedProds = await getProductsByIds(productIds);
  } catch (error) {
    console.log({ error });
    return Promise.reject(
      "there was a problem saving the invoice, please try again later"
    );
  }

  // combine selected and custom prods
  const invoicedProducts: {
    name: string;
    quantity: number;
    price: Prisma.Decimal;
  }[] = [];
  [...Array(parseInt(`${prodcount}`))].forEach((e, i) => {
    // selected prod
    if (productValues.hasOwnProperty(`np_${i + 1}_id`)) {
      const product_id = parseInt(`${productValues[`np_${i + 1}_id`]}`);
      const quantity = parseInt(`${productValues[`np_${i + 1}_qty`]}`);
      const selectedProduct = retrievedSelectedProds.find((prod) =>
        prod ? prod.product_id === product_id : null
      );
      if (selectedProduct) {
        const { brand_name, model_name, type_name, price } = selectedProduct;
        invoicedProducts.push({
          name: `${brand_name} - ${type_name} - ${model_name}`,
          quantity,
          price,
        });
      }
    }
    // custom prod
    if (
      productValues.hasOwnProperty(`ep_${i + 1}_name`) &&
      `${productValues[`ep_${i + 1}_name`]}`.trim()
    ) {
      invoicedProducts.push({
        name: `${productValues[`ep_${i + 1}_name`]}`,
        quantity: parseInt(`${productValues[`ep_${i + 1}_qty`]}`),
        price: new Prisma.Decimal(`${productValues[`ep_${i + 1}_price`]}`),
      });
    }
  });

  try {
    await insertInvoice({ customer, labour, discount, invoicedProducts });
  } catch (error) {
    console.log({ error });
    return Promise.reject(
      "there was a problem saving the invoice, please try again later"
    );
  }
};

export const deleteInvoiceById = async (invoice_id: number) => {
  return await removeInvoiceId(invoice_id);
};

export const createInvoiceFromQuoteById = async (quote_id: number) => {
  // retrieve quote via quote controller
  try {
    const quote = await getQuoteById(quote_id);
    if (!quote)
      return Promise.reject(
        "there was a problem saving the invoice, please try again later"
      );

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

    const newInvoice = await insertInvoice(invoiceData);
    if (!newInvoice)
      return Promise.reject(
        "there was a problem saving the invoice, please try again later"
      );
    return newInvoice;
  } catch (error) {
    console.log({ error });
    return Promise.reject(
      "there was a problem saving the invoice, please try again later"
    );
  }
  // pass to createInvoice model
};
