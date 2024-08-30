import { Prisma, type products } from "@prisma/client";
import {
  createQuote as insertQuote,
  deleteQuoteById as removeQuoteId,
  getQuoteById as selectQuoteById,
  getQuotes as selectQuotes,
} from "../models/quotes";
import { getProductsByIds } from "./products";

export const getQuotes = async () => {
  return await selectQuotes();
};

export const getQuoteById = async (quote_id: number) => {
  return await selectQuoteById(quote_id);
};

export const createQuote = async (data: any) => {
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
      "there was a problem saving the quote, please try again later"
    );
  }

  // combine selected and custom prods
  const quotedProducts: {
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
        quotedProducts.push({
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
      quotedProducts.push({
        name: `${productValues[`ep_${i + 1}_name`]}`,
        quantity: parseInt(`${productValues[`ep_${i + 1}_qty`]}`),
        price: new Prisma.Decimal(`${productValues[`ep_${i + 1}_price`]}`),
      });
    }
  });

  try {
    await insertQuote({ customer, labour, discount, quotedProducts });
  } catch (error) {
    console.log({ error });
    return Promise.reject(
      "there was a problem saving the quote, please try again later"
    );
  }
};

export const deleteQuoteById = async (quote_id: number) => {
  return await removeQuoteId(quote_id);
};
