import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import InvoiceForm from "~/components/InvoiceForm";
import {
  createCustomer,
  getCustomerById,
  getCustomerBySearch,
} from "~/controllers/customers";
import { createInvoice } from "~/controllers/invoices";
import {
  createProduct,
  getBrands,
  getModels,
  getProducts,
  getTypes,
} from "~/controllers/products";
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";
import { validateCustomerData, validateProductData } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Create invoice` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    // TODO: expensive query, refactor so taxonomy is retrieved as action on user interaction
    const [brands, types, models, products] = await Promise.all([
      getBrands(),
      getTypes(),
      getModels(),
      getProducts(),
    ]);
    return json({ brands, types, models, products });
  } catch (err) {
    console.error(err);
    return {};
  }
};

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "customer_search":
      const { search_term } = values;
      const customers =
        search_term.toString().length > 0
          ? await getCustomerBySearch(search_term.toString())
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
    case "create_invoice":
      try {
        await createInvoice(values);
        return redirect("/invoices");
      } catch (error) {
        return { quoteActionErrors: { info: error } };
      }
  }

  return {};
}

export default function InvoicesCreate() {
  const navigation = useNavigation();
  const invoiceFormData = useLoaderData();
  const data = useActionData();
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="mb-4 text-center">Create a new invoice</h2>
      <InvoiceForm
        invoiceFormData={invoiceFormData}
        navigation={navigation}
        formData={data || {}}
        actionName="create_invoice"
        onCancel={() => {
          navigate(`/invoices`);
        }}
      />
    </div>
  );
}
