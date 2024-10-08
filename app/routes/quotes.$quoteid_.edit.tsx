import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import QuoteForm from "~/components/QuoteForm";
import {
  createCustomer,
  getCustomerById,
  getCustomersBySearch,
} from "~/controllers/customers";
import {
  createProduct,
  getBrands,
  getBrandsBySearch,
  getModels,
  getModelsBySearch,
  getProductsBySearch,
  getTypes,
  getTypesBySearch,
} from "~/controllers/products";
import {
  createQuote,
  deleteQuoteById,
  getQuoteById,
} from "~/controllers/quotes";
import { SITE_TITLE } from "~/root";
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
    const existingData = await getQuoteById(parseInt(`${quoteid}`));
    return json({ existingData });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  const { _action, search_term, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "brands_search":
      const brands =
        search_term.toString().length > 0
          ? await getBrandsBySearch(search_term.toString())
          : await getBrands();
      return { brands };
    case "types_search":
      const types =
        search_term.toString().length > 0
          ? await getTypesBySearch(search_term.toString())
          : await getTypes();
      return { types };
    case "models_search":
      const models =
        search_term.toString().length > 0
          ? await getModelsBySearch(search_term.toString())
          : await getModels();
      return { models };
    case "products_search":
      const products =
        search_term.toString().length > 0
          ? await getProductsBySearch(search_term.toString())
          : [];
      return { products };
    case "customers_search":
      const customers =
        search_term.toString().length > 0
          ? await getCustomersBySearch(search_term.toString())
          : [];
      return { customers };
    case "get_customer":
      const { customer_id } = values;
      try {
        const customer = await getCustomerById(
          parseInt(customer_id.toString())
        );
        return { customer };
      } catch (error) {
        return { quoteActionErrors: { info: "customer not found" } };
      }
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
      try {
        await Promise.all([
          createQuote(values),
          deleteQuoteById(parseInt(`${quoteid}`)),
        ]);
        return redirect("/quotes");
      } catch (error) {
        return { quoteActionErrors: { info: error } };
      }
  }

  return {};
}

export default function QuotesEdit() {
  const navigation = useNavigation();
  const { existingData } = useLoaderData();
  const data = useActionData();
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-4 text-center">Edit quote</h2>
      <QuoteForm
        existingData={existingData}
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
