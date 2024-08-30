import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import QuoteForm from "~/components/QuoteForm";
import { createCustomer, getCustomers } from "~/controllers/customers";
import {
  createProduct,
  getBrands,
  getModels,
  getProducts,
  getTypes,
} from "~/controllers/products";
import { createQuote } from "~/controllers/quotes";
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";
import { validateCustomerData, validateProductData } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Create quote` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    // TODO: expensive query, refactor so taxonomy is retrieved as action on user interaction
    const [brands, types, models, customers, products] = await Promise.all([
      getBrands(),
      getTypes(),
      getModels(),
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
      try {
        await createQuote(values);
        return redirect("/quotes");
      } catch (error) {
        return { quoteActionErrors: { info: error } };
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
