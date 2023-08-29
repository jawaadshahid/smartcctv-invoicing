import { Prisma, type products } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import QuoteForm from "~/components/QuoteForm";
import { SITE_TITLE } from "~/root";
import {
  createCustomer,
  createProduct,
  createQuote,
  db,
  deleteQuoteById,
  getCustomers,
  getProductById,
  getProducts,
  getQuoteById,
} from "~/utils/db";
import { getUserId } from "~/utils/session";
import { validateCustomerData, validateProductData } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Edit quote ` }];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { quoteid } = params;
  if (!quoteid) return redirect("/quotes");
  try {
    // TODO: refactor so taxonomy is retrieved as action
    const [brands, types, models, customers, products, quote] =
      await Promise.all([
        db.product_brands.findMany(),
        db.product_types.findMany(),
        db.product_models.findMany(),
        getCustomers(),
        getProducts(),
        getQuoteById(parseInt(`${quoteid}`)),
      ]);
    return json({ brands, types, models, customers, products, quote });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "create_customer":
      const customerActionErrors: any = validateCustomerData(values);

      if (Object.values(customerActionErrors).some(Boolean))
        return { customerActionErrors };

      try {
        const createdCustomer = await createCustomer(values);
        return { createdCustomer };
      } catch (error) {
        console.log({ error });
        customerActionErrors.info =
          "There was a problem creating the customer...";
        return { customerActionErrors };
      }
    case "create_product":
      const productActionErrors: any = validateProductData(values);

      if (Object.values(productActionErrors).some(Boolean))
        return { productActionErrors };

      try {
        const createdProduct = await createProduct(values);
        return { createdProduct };
      } catch (error: any) {
        console.log({ error });
        if (error.code) {
          productActionErrors.info = error.msg;
        } else
          productActionErrors.info =
            "There was a problem creating the product...";
        return { productActionErrors };
      }
    case "edit_quote":
      const { quoteid } = params;
      const { customer, labour, discount, prodcount, ...productValues } =
        values;
      const quoteActionErrors: any = {};

      if (!customer)
        quoteActionErrors.customer = "you must select or define a customer!";

      if (Object.keys(productValues).length === 0)
        quoteActionErrors.product =
          "you must select or define at least one product!";

      if (Object.values(quoteActionErrors).some(Boolean))
        return { quoteActionErrors };

      // delete existing quote
      try {
        await deleteQuoteById(parseInt(`${quoteid}`));
      } catch (error) {
        console.log({ error });
        return {
          quoteActionErrors: {
            info: "there was a problem saving the quote, please try again later",
          },
        };
      }

      // first loop: compile promises to get prods by Id
      const prodPromises: any[] = [];
      [...Array(parseInt(`${prodcount}`))].forEach((e, i) => {
        if (productValues.hasOwnProperty(`np_${i + 1}_id`)) {
          const product_id = parseInt(`${productValues[`np_${i + 1}_id`]}`);
          prodPromises.push(getProductById(product_id));
        }
      });

      // retrieves products from compiled promises
      let retrievedSelectedProds: products[] = [];
      try {
        retrievedSelectedProds = await Promise.all(prodPromises);
      } catch (error) {
        console.log({ error });
        return {
          quoteActionErrors: {
            info: "there was a problem saving the quote, please try again later",
          },
        };
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
          const selectedProduct = retrievedSelectedProds.find(
            (prod) => prod.product_id === product_id
          );
          if (selectedProduct) {
            const { brand_name, model_name, type_name, price } =
              selectedProduct;
            quotedProducts.push({
              name: `${brand_name} - ${type_name} - ${model_name}`,
              quantity,
              price,
            });
          }
        }
        // custom prod
        if (productValues.hasOwnProperty(`ep_${i + 1}_name`)) {
          quotedProducts.push({
            name: `${productValues[`ep_${i + 1}_name`]}`,
            quantity: parseInt(`${productValues[`ep_${i + 1}_qty`]}`),
            price: new Prisma.Decimal(`${productValues[`ep_${i + 1}_price`]}`),
          });
        }
      });

      try {
        await createQuote({ customer, labour, discount, quotedProducts });
        return redirect("/quotes");
      } catch (error) {
        console.log({ error });
        return {
          quoteActionErrors: {
            info: "there was a problem saving the quote, please try again later",
          },
        };
      }
  }

  return {};
}

export default function QuotesEdit() {
  const navigation = useNavigation();
  const quoteFormData = useLoaderData();
  const data = useActionData();
  const navigate = useNavigate();
  
  return (
    <div>
      <h2 className="mb-4 text-center">Edit quote</h2>
      <QuoteForm
        quoteFormData={quoteFormData}
        navigation={navigation}
        formData={data || {}}
        actionName="edit_quote"
        onCancel={() => {
          navigate(-1);
        }}
      />
    </div>
  );
}
