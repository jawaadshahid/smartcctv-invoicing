import { customers, products } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import AlertMessage from "~/components/AlertMessage";
import QuoteForm from "~/components/QuoteForm";
import { createCustomer, getCustomersBySearch } from "~/controllers/customers";
import {
  createProduct,
  getBrandsBySearch,
  getModelsBySearch,
  getProductsBySearch,
  getTypesBySearch,
} from "~/controllers/products";
import { getQuoteById, updateQuoteById } from "~/controllers/quotes";
import { SITE_TITLE } from "~/root";
import { error } from "~/utils/errors";
import { getUserId } from "~/utils/session";
import { QuotesWithCustomersType } from "~/utils/types";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Edit quote ` }];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  const { quote_id } = params;
  if (!quote_id) return redirect("/quotes");
  try {
    const { quote } = await getQuoteById({ quote_id });
    return json({ quote });
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
    case "edit_quote":
      const { quote_id } = params;
      if (!quote_id)
        return {
          code: 400,
          message: "Bad request: failed to update quote",
        };
      try {
        const updatedQuoteData = await updateQuoteById(quote_id, values);
        return { updatedQuoteData };
      } catch (error) {
        return { error };
      }
  }
  return {
    error: { code: 400, message: "Bad request: action was not handled" },
  };
}

export default function QuotesEdit() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [existingQuoteData, setExistingQuoteData] =
    useState<QuotesWithCustomersType | null>(null);
  const [createdCustomer, setCreatedCustomer] = useState<customers | null>(
    null
  );
  const [createdProduct, setCreatedProduct] = useState<products | null>(null);
  const [alertData, setAlertData] = useState<error | null>(null);

  useEffect(() => {
    if (!loaderData) return;
    const { quote: retrievedQuote } = loaderData;
    if (retrievedQuote) setExistingQuoteData(retrievedQuote);
    if (loaderData.error) setAlertData(loaderData.error);
  }, [loaderData]);

  useEffect(() => {
    if (!actionData) return;
    const { createdCustomerData, createdProductData, updatedQuoteData, error } =
      actionData;

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
    if (updatedQuoteData) {
      const {
        code,
        updatedQuote,
      }: { code: number; updatedQuote: QuotesWithCustomersType } =
        updatedQuoteData;
      setExistingQuoteData(updatedQuote);
      setAlertData({ code, message: "Success: quote updated" });
      const { quote_id } = updatedQuote;
      if (quote_id) navigate(`/quotes/${quote_id}/edit`, { replace: true });
      else navigate(`/quotes`, { replace: true });
    }
    if (error) setAlertData(error);
  }, [actionData]);

  return (
    <>
      <h2 className="mb-4 text-center">Edit quote</h2>
      <QuoteForm
        {...(existingQuoteData
          ? { existingQuoteData, setExistingQuoteData }
          : {})}
        navigation={navigation}
        createdCustomer={createdCustomer}
        setCreatedCustomer={setCreatedCustomer}
        createdProduct={createdProduct}
        setCreatedProduct={setCreatedProduct}
        setAlertData={setAlertData}
        actionName="edit_quote"
        onCancel={() => navigate(-1)}
      />
      <AlertMessage alertData={alertData} setAlertData={setAlertData} />
    </>
  );
}
