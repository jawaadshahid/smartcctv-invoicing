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
  getCustomersBySearch,
} from "~/controllers/customers";
import {
  createInvoice,
  deleteInvoiceById,
  getInvoiceById,
} from "~/controllers/invoices";
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
import { SITE_TITLE } from "~/root";
import { getUserId } from "~/utils/session";
import { validateCustomerData, validateProductData } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Edit Invoice` }];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { invoiceid } = params;
  if (!invoiceid) return redirect("/invoices");
  try {
    const existingData = await getInvoiceById(parseInt(`${invoiceid}`));
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
    case "edit_invoice":
      const { invoiceid } = params;
      try {
        await Promise.all([
          createInvoice(values),
          deleteInvoiceById(parseInt(`${invoiceid}`)),
        ]);
        return redirect("/invoices");
      } catch (error) {
        return { invoiceActionErrors: { info: error } };
      }
  }

  return {};
}

export default function InvoicesEdit() {
  const navigation = useNavigation();
  const { existingData } = useLoaderData();
  const data = useActionData();
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-4 text-center">Edit invoice</h2>
      <InvoiceForm
        existingData={existingData}
        navigation={navigation}
        formData={data || {}}
        actionName="edit_invoice"
        onCancel={() => {
          navigate(-1);
        }}
      />
    </div>
  );
}
