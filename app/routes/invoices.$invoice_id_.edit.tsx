import { customers, products } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import AlertMessage from "~/components/AlertMessage";
import InvoiceForm from "~/components/InvoiceForm";
import { createCustomer, getCustomersBySearch } from "~/controllers/customers";
import { getInvoiceById, updateInvoiceById } from "~/controllers/invoices";
import {
  createProduct,
  getBrandsBySearch,
  getModelsBySearch,
  getProductsBySearch,
  getTypesBySearch,
} from "~/controllers/products";
import { SITE_TITLE } from "~/root";
import { error } from "~/utils/errors";
import { getUserId } from "~/utils/session";
import { InvoicesWithCustomersType } from "~/utils/types";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Edit Invoice` }];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { invoice_id } = params;
  if (!invoice_id) return redirect("/invoices");
  try {
    const { invoice } = await getInvoiceById({ invoice_id });
    return { invoice };
  } catch (error) {
    return { error };
  }
};

export const shouldRevalidate = () => false;

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "brands_search":
      try {
        const { brands } = await getBrandsBySearch(values);
        return { brands };
      } catch (error) {
        return { error };
      }
    case "types_search":
      try {
        const { types } = await getTypesBySearch(values);
        return { types };
      } catch (error) {
        return { error };
      }
    case "models_search":
      try {
        const { models } = await getModelsBySearch(values);
        return { models };
      } catch (error) {
        return { error };
      }
    case "products_search":
      try {
        const { products } = await getProductsBySearch(values);
        return { products };
      } catch (error) {
        return { error };
      }
    case "customers_search":
      try {
        const { customers } = await getCustomersBySearch(values);
        return { customers };
      } catch (error) {
        return { error };
      }
    case "create_customer":
      try {
        const createdCustomerData = await createCustomer(values);
        return { createdCustomerData };
      } catch (error) {
        return { error };
      }
    case "create_product":
      try {
        const createdProductData = await createProduct(values);
        return { createdProductData };
      } catch (error) {
        return { error };
      }
    case "edit_invoice":
      const { invoice_id } = params;
      if (!invoice_id)
        return {
          code: 400,
          message: "Bad request: failed to update invoice",
        };
      try {
        const updatedInvoiceData = await updateInvoiceById(invoice_id, values);
        return { updatedInvoiceData };
      } catch (error) {
        return { error };
      }
  }
  return {
    error: { code: 400, message: "Bad request: action was not handled" },
  };
}

export default function InvoicesEdit() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [existingInvoiceData, setExistingInvoiceData] =
    useState<InvoicesWithCustomersType | null>(null);
  const [createdCustomer, setCreatedCustomer] = useState<customers | null>(
    null
  );
  const [createdProduct, setCreatedProduct] = useState<products | null>(null);
  const [alertData, setAlertData] = useState<error | null>(null);

  useEffect(() => {
    if (!loaderData) return;
    const { invoice: retrievedInvoice } = loaderData;
    if (retrievedInvoice) setExistingInvoiceData(retrievedInvoice);
    if (loaderData.error) setAlertData(loaderData.error);
  }, [loaderData]);

  useEffect(() => {
    if (!actionData) return;
    const {
      createdCustomerData,
      createdProductData,
      updatedInvoiceData,
      error,
    } = actionData;

    if (createdCustomerData) {
      const { code, createdCustomer: retrievedCustomer } = createdCustomerData;
      setCreatedCustomer(retrievedCustomer);
      setAlertData({ code, message: "Success: customer created" });
    }
    if (createdProductData) {
      const { code, createdProduct: retrievedProduct } = createdProductData;
      setCreatedProduct(retrievedProduct);
      setAlertData({ code, message: "Success: product created" });
    }
    if (updatedInvoiceData) {
      const {
        code,
        updatedInvoice,
      }: { code: number; updatedInvoice: InvoicesWithCustomersType } =
        updatedInvoiceData;
      setExistingInvoiceData(updatedInvoice);
      setAlertData({ code, message: "Success: invoice updated" });
      const { invoice_id } = updatedInvoice;
      if (invoice_id)
        navigate(`/invoices/${invoice_id}/edit`, { replace: true, preventScrollReset: true });
      else navigate(`/invoices`, { replace: true });
    }
    if (error) setAlertData(error);
  }, [actionData]);

  return (
    <>
      <h2 className="mb-4 text-center">Edit invoice</h2>
      <InvoiceForm
        {...(existingInvoiceData
          ? { existingInvoiceData, setExistingInvoiceData }
          : {})}
        navigation={navigation}
        createdCustomer={createdCustomer}
        setCreatedCustomer={setCreatedCustomer}
        createdProduct={createdProduct}
        setCreatedProduct={setCreatedProduct}
        setAlertData={setAlertData}
        actionName="edit_invoice"
        onCancel={() => navigate(-1)}
      />
      <AlertMessage alertData={alertData} setAlertData={setAlertData} />
    </>
  );
}
