import { Prisma } from "@prisma/client";
import { getProductsByIds } from "~/controllers/products";

type formData = { [key: string]: FormDataEntryValue };

export const parseProductSubmissionData = async (data: formData) => {
  const { prodcount, ...productValues } = data;

  // retrieves products from compiled promises
  const productIds = [...Array(parseInt(`${prodcount}`))]
    .map((e, i) => parseInt(`${productValues[`np_${i + 1}_id`]}`))
    .filter((val) => !isNaN(val));

  const retrievedSelectedProds = await getProductsByIds(productIds);
  if (!retrievedSelectedProds) {
    return Promise.reject({
      code: 500,
      message: `Internal server error: failed to retrieve selected products`,
    });
  }

  // combine selected and custom prods
  const parsedProducts: {
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
        parsedProducts.push({
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
      parsedProducts.push({
        name: `${productValues[`ep_${i + 1}_name`]}`,
        quantity: parseInt(`${productValues[`ep_${i + 1}_qty`]}`),
        price: new Prisma.Decimal(`${productValues[`ep_${i + 1}_price`]}`),
      });
    }
  });

  return parsedProducts;
};
