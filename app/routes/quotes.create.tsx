import type {
  customers,
  product_brands,
  product_models,
  product_types,
  products,
} from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useReducer, useState } from "react";
import CreateCustomerForm from "~/components/CreateCustomerForm";
import CreateProductForm from "~/components/CreateProductForm";
import Modal from "~/components/Modal";
import QuoteProductRow from "~/components/QuoteProductRow";
import { SITE_TITLE } from "~/root";
import { createCustomer, createProduct, db } from "~/utils/db";
import { getUserId } from "~/utils/session";
import { validateCustomerData, validateProductData } from "~/utils/validations";

export const meta: V2_MetaFunction = () => {
  return [{ title: `${SITE_TITLE} - Create quote` }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const uid = await getUserId(request);
  if (!uid) return redirect("/login");
  try {
    const [brands, types, models, customers, products]: [
      brands: product_brands[],
      types: product_types[],
      models: product_models[],
      customers: customers[],
      products: products[]
    ] = await Promise.all([
      db.product_brands.findMany(),
      db.product_types.findMany(),
      db.product_models.findMany(),
      db.customers.findMany(),
      db.products.findMany(),
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
      const { name, tel, email, address } = values;
      const customerActionErrors: any = validateCustomerData(values);

      if (Object.values(customerActionErrors).some(Boolean))
        return { customerActionErrors };

      try {
        const createdCustomer = await createCustomer(
          `${name}`,
          `${tel}`,
          `${email}`,
          `${address}`
        );
        return { createdCustomer };
      } catch (err) {
        console.log(err);
        customerActionErrors.info =
          "There was a problem creating the customer...";
        return { customerActionErrors };
      }
    case "create_product":
      const { brand, newbrand, type, newtype, model, newmodel, price } = values;
      const productActionErrors: any = validateProductData(values);

      if (Object.values(productActionErrors).some(Boolean))
        return { productActionErrors };
      try {
        const createdProduct = await createProduct(
          `${brand}`,
          `${newbrand}`,
          `${type}`,
          `${newtype}`,
          `${model}`,
          `${newmodel}`,
          `${price}`
        );
        return { createdProduct };
      } catch (err) {
        console.log(err);
        productActionErrors.info =
          "There was a problem creating the product...";
        return { productActionErrors };
      }
    case "create_quote":
      const { customer, labour, ...productValues } = values;
      console.log({ productValues });
      const quoteActionErrors: any = {};

      if (!customer)
        quoteActionErrors.customer = "you must select or define a customer!";

        console.log(Object.keys(productValues));
      if (Object.keys(productValues).length === 0)
        quoteActionErrors.product = "you must select or define at least one product!";

      if (Object.values(quoteActionErrors).some(Boolean))
        return { quoteActionErrors };
  }

  return {};
}

export default function QuotesCreate() {
  const selectClass = "select select-bordered w-full";
  const inputClass = "input input-bordered w-full";
  const navigation = useNavigation();
  const {
    customers,
    products,
    brands,
    types,
    models,
  }: {
    customers: customers[];
    products: products[];
    brands: product_brands[];
    types: product_types[];
    models: product_models[];
  } = useLoaderData();
  const data = useActionData();
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerSelectValue, setCustomerSelectValue] = useState("");
  const [productCount, setProductCount] = useState(1);
  const [labour, setLabour] = useState(0);
  const [grandtotal, setGrandtotal] = useState(0);
  const [newProductRow, setNewProductRow] = useState(0);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productSelectValues, dispatchPSV] = useReducer(
    (state: any[], action: any) => {
      const { type, ...values } = action;
      switch (type) {
        case "update":
          if (values.product_id === "-1") {
            setNewProductRow(values.row_id);
            setIsNewProduct(true);
          } else {
            setNewProductRow(0);
            setIsNewProduct(false);
          }
          return state.map((psv) => {
            if (psv.row_id === values.row_id) {
              return { ...psv, ...values };
            }
            return { ...psv };
          });
        case "add":
          const doesExist = Boolean(
            state.find((psv) => psv.row_id === values.row_id)
          );
          if (!doesExist) return [...state, { ...values }];
          return state;
        case "remove":
          return state.filter((psv) => psv.row_id !== values.row_id);
        default:
          return state;
      }
    },
    [{ row_id: "1", product_id: "", qty: 1, price: 0 }]
  );

  useEffect(() => {
    setGrandtotal(
      productSelectValues.reduce(
        (partialSum, a: any) => partialSum + a.price * a.qty,
        0
      ) + labour
    );
  }, [productSelectValues, labour]);

  useEffect(() => {
    setIsNewCustomer(customerSelectValue === "-1");
  }, [customerSelectValue]);

  useEffect(() => {
    if (!data) return;
    if (data.createdCustomer)
      setCustomerSelectValue(`${data.createdCustomer.customer_id}`);
    if (data.createdProduct) {
      dispatchPSV({
        type: "update",
        row_id: newProductRow,
        product_id: `${data.createdProduct.product_id}`,
      });
    }
  }, [data, newProductRow]);

  return (
    <div>
      <h2 className="mb-4 text-center">Create a new quote</h2>
      <Form method="post" className="bg-base-300 px-4 py-2 rounded-lg">
        {data?.quoteActionErrors?.info && (
          <label className="label">
            <span className="label-text-alt text-error">
              {data.quoteActionErrors.info}
            </span>
          </label>
        )}
        <fieldset disabled={navigation.state === "submitting"}>
          <div className="mb-4">
            <label className="label" htmlFor="customer">
              <span className="label-text">Customer</span>
            </label>
            <select
              className={selectClass}
              name="customer"
              id="customer"
              value={customerSelectValue}
              onChange={(e) => {
                setCustomerSelectValue(e.target.value);
              }}
            >
              <option disabled value="">
                Select a customer...
              </option>
              {customers.map(
                ({ customer_id, name, tel, email, address }: customers) => {
                  return (
                    <option key={customer_id} value={customer_id}>
                      {name} - {tel} - {email} - {address}
                    </option>
                  );
                }
              )}
              <option value="-1">Add new customer +</option>
            </select>
            {data?.quoteActionErrors?.customer && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {data.quoteActionErrors.customer}
                </span>
              </label>
            )}
          </div>
        </fieldset>
        <fieldset disabled={navigation.state === "submitting"}>
          <div className="-mx-4">
            <table className="table">
              <thead>
                <tr className="hidden md:table-row">
                  <th>Product</th>
                  <th className="w-[100px]">Quantity</th>
                  <th className="text-right w-[150px]">Unit (£)</th>
                  <th className="text-right w-[150px]">Subtotal (£)</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(productCount)].map((e, i) => (
                  <QuoteProductRow
                    key={i}
                    rowId={`${i + 1}`}
                    products={products}
                    productSelectValues={productSelectValues}
                    dispatchPSV={dispatchPSV}
                  />
                ))}
                {data?.quoteActionErrors?.product && (
                  <tr>
                    <td colSpan={4}>
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {data.quoteActionErrors.product}
                        </span>
                      </label>
                    </td>
                  </tr>
                )}
                <tr className="flex flex-col md:table-row">
                  <td colSpan={4}>
                    <div className="flex md:justify-end join">
                      <button
                        className="btn btn-neutral join-item"
                        disabled={productCount === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setProductCount((pCount) => {
                            dispatchPSV({
                              type: "remove",
                              row_id: `${pCount}`,
                            });
                            return pCount - 1;
                          });
                        }}
                      >
                        -
                      </button>
                      <button
                        className="btn btn-neutral join-item"
                        onClick={(e) => {
                          e.preventDefault();
                          setProductCount((pCount) => {
                            dispatchPSV({
                              type: "add",
                              row_id: `${pCount + 1}`,
                              product_id: "",
                              qty: 1,
                              price: 0,
                            });
                            return pCount + 1;
                          });
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="flex flex-col md:table-row">
                  <td colSpan={2} className="hidden md:table-cell"></td>
                  <td className="flex md:table-cell">
                    <label className="label md:justify-end" htmlFor="labour">
                      <span className="label-text">Labour cost (£):</span>
                    </label>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      name="labour"
                      id="labour"
                      value={labour}
                      className={`${inputClass} md:text-right`}
                      onChange={(e) => {
                        setLabour(parseInt(e.target.value));
                      }}
                    />
                  </td>
                </tr>
                <tr className="flex flex-col md:table-row">
                  <td colSpan={2} className="hidden md:table-cell"></td>
                  <td>
                    <label className="label md:justify-end">
                      <span className="label-text">Total cost (£):</span>
                    </label>
                  </td>
                  <td>
                    <label className="label md:justify-end">
                      <span className="label-text">{grandtotal}</span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex md:justify-end mt-4 mb-2">
            <button
              className="btn btn-neutral"
              type="submit"
              name="_action"
              value="create_quote"
            >
              {navigation.state === "submitting" ? "Submitting..." : "Submit"}
            </button>
            <a className="btn btn-neutral ml-4" href="/quotes">
              Cancel
            </a>
          </div>
        </fieldset>
      </Form>
      <Modal open={isNewCustomer}>
        <h3 className="mb-4">Create new customer</h3>
        {isNewCustomer && (
          <CreateCustomerForm
            actionName="create_customer"
            navigation={navigation}
            formErrors={data?.customerActionErrors}
            onCancel={() => {
              setCustomerSelectValue("");
              if (data) data.customerActionErrors = {};
            }}
          />
        )}
      </Modal>
      <Modal open={isNewProduct}>
        <h3 className="mb-4">Create new product</h3>
        {isNewProduct && (
          <CreateProductForm
            actionName="create_product"
            selectData={{ brands, types, models }}
            navigation={navigation}
            formErrors={data?.productActionErrors}
            onCancel={() => {
              dispatchPSV({
                type: "update",
                row_id: newProductRow,
                product_id: "",
              });
              if (data) data.productActionErrors = {};
            }}
          />
        )}
      </Modal>
    </div>
  );
}
