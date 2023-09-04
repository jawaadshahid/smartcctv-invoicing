import type { products } from "@prisma/client";
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
  getCustomers,
  getProductById,
  getProducts,
} from "~/utils/db";
import { getUserId } from "~/utils/session";
import { validateCustomerData, validateProductData } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Create quote` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    // TODO: refactor so taxonomy is retrieved as action
    const [brands, types, models, customers, products] = await Promise.all([
      db.product_brands.findMany(),
      db.product_types.findMany(),
      db.product_models.findMany(),
      getCustomers(),
      getProducts(),
    ]);
    return json({ brands, types, models, customers, products });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "create_customer":
      const customerActionErrors: any = validateCustomerData(values);

      if (Object.values(customerActionErrors).some(Boolean))
        return { customerActionErrors };

      try {
        const createdCustomer = await createCustomer(values);
        return json({ createdCustomer });
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
    case "create_quote":
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

      // first loop: compile promises to get prods by Id
      const prodPromiseCollection: any[] = [];
      [...Array(parseInt(`${prodcount}`))].forEach((e, i) => {
        const product_id = parseInt(`${productValues[`np_${i + 1}_id`]}`);
        if (!product_id) return true;
        prodPromiseCollection.push(getProductById(product_id));
      });

      // retrieves products from compiled promises
      let retrievedSelectedProds: products[] = [];
      try {
        retrievedSelectedProds = await Promise.all(prodPromiseCollection);
      } catch (error) {
        console.log({ error });
        quoteActionErrors.info =
          "there was a problem saving the quote, please try again later";
        return { quoteActionErrors };
      }

      const quotedProducts = retrievedSelectedProds.map(
        (product: products, i) => {
          const { brand_name, model_name, type_name, price } = product;
          const quantity = parseInt(`${productValues[`np_${i + 1}_qty`]}`);
          return {
            name: `${brand_name} - ${type_name} - ${model_name}`,
            quantity,
            price,
          };
        }
      );

      try {
        await createQuote({ customer, labour, discount, quotedProducts });
        return redirect("/quotes");
      } catch (error) {
        console.log({ error });
        quoteActionErrors.info =
          "there was a problem saving the quote, please try again later";
        return { quoteActionErrors };
      }
  }

  return {};
}

export default function QuotesCreate() {
  const navigation = useNavigation();
  const quoteFormData = useLoaderData();
  const data = useActionData();
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="mb-4 text-center">Create a new quote</h2>
      <QuoteForm
        quoteFormData={quoteFormData}
        navigation={navigation}
        formData={data || {}}
        actionName="create_quote"
        onCancel={() => {
          navigate(`/quotes`);
        }}
      />
    </div>
  );
}
