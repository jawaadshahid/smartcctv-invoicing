import type {
  customers,
  product_brands,
  product_models,
  product_types,
  products,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
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
import FormAnchorButton from "~/components/FormAnchorBtn";
import FormBtn from "~/components/FormBtn";
import Modal from "~/components/Modal";
import ProductForm from "~/components/ProductForm";
import QuoteProductRow from "~/components/QuoteProductRow";
import { SITE_TITLE } from "~/root";
import { createCustomer, createProduct, db } from "~/utils/db";
import {
  getGrandTotal,
  getSubtotal,
  getTwoDecimalPlaces,
} from "~/utils/formatters";
import { getUserId } from "~/utils/session";
import {
  TDClass,
  formClass,
  inputClass,
  respTRClass,
  selectClass,
} from "~/utils/styleClasses";
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
      } catch (error) {
        console.log({ error });
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
        const product_id = parseInt(productValues[`p_${i + 1}_id`] as string);
        if (!product_id) return true;
        prodPromiseCollection.push(
          db.products.findUnique({
            where: { product_id },
            include: {
              brand: true,
              model: true,
              type: true,
            },
          })
        );
      });

      // retrieves products from compiled promises
      let retrievedSelectedProds = [];
      try {
        retrievedSelectedProds = await Promise.all(prodPromiseCollection);
      } catch (error) {
        console.log({ error });
        quoteActionErrors.info =
          "there was a problem saving the quote, please try again later";
        return { quoteActionErrors };
      }

      // loops products and constructs quoted products
      const quotedProducts = retrievedSelectedProds.map((product: any, i) => {
        const { brand_name, model_name, type_name, price } = product;
        const quantity = parseInt(productValues[`p_${i + 1}_qty`] as string);
        return {
          name: `${brand_name} - ${type_name} - ${model_name}`,
          quantity,
          price,
        };
      });

      const newQuote: Prisma.quotesCreateInput = {
        customer: {
          connect: {
            customer_id: parseInt(`${customer}`),
          },
        },
        quoted_products: {
          createMany: {
            data: quotedProducts,
          },
        },
        labour: Number(`${labour}`),
        discount: Number(`${discount}`),
      };

      try {
        await db.quotes.create({ data: newQuote });
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
  const {
    customers,
    products,
    brands,
    types,
    models,
  }: {
    customers: customers[];
    products: products[] | any[];
    brands: product_brands[];
    types: product_types[];
    models: product_models[];
  } = useLoaderData();
  let data = useActionData();
  const isSubmitting = navigation.state === "submitting";
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerSelectValue, setCustomerSelectValue] = useState("");
  const [productCount, setProductCount] = useState(1);
  const [labour, setLabour] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [subtotal, setSubtotal] = useState("0");
  const [grandtotal, setGrandtotal] = useState("0");
  const [labourValue, setLabourValue] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
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
          if (!doesExist) {
            setProductCount((pCount) => pCount + 1);
            return [...state, { ...values }];
          }
          return state;
        case "remove":
          const newState = state.filter((psv) => psv.row_id !== values.row_id);
          setProductCount((pCount) => pCount - 1);
          return newState.map((psv, i) => {
            return { ...psv, row_id: `${i + 1}` };
          });
        default:
          return state;
      }
    },
    [{ row_id: "1", product_id: "", quantity: 1, price: new Prisma.Decimal(0) }]
  );

  useEffect(() => {
    const labourNum = Number(labour);
    setLabourValue(isNaN(labourNum) ? 0 : labourNum);
  }, [labour]);

  useEffect(() => {
    const discountNum = Number(discount);
    setDiscountValue(isNaN(discountNum) ? 0 : discountNum);
  }, [discount]);

  useEffect(() => {
    const subTotalDec = getSubtotal(productSelectValues);
    setSubtotal(getTwoDecimalPlaces(subTotalDec));
  }, [productSelectValues]);

  useEffect(() => {
    const subTotalDec = getSubtotal(productSelectValues);
    const labourDec = new Prisma.Decimal(labourValue);
    const discountDec = new Prisma.Decimal(discountValue);
    const grandTotalDec = getGrandTotal(subTotalDec, labourDec, discountDec);
    setGrandtotal(getTwoDecimalPlaces(grandTotalDec));
  }, [productSelectValues, labourValue, discountValue]);

  useEffect(() => {
    setIsNewCustomer(customerSelectValue === "-1");
  }, [customerSelectValue]);

  useEffect(() => {
    if (!data) return;
    if (data.createdCustomer)
      setCustomerSelectValue(`${data.createdCustomer.customer_id}`);
    data.createdCustomer = null;
    if (data.createdProduct) {
      const { product_id, price }: products = data.createdProduct;
      dispatchPSV({
        type: "update",
        row_id: newProductRow,
        product_id: `${product_id}`,
        price,
      });
      data.createdProduct = null;
    }
  }, [data, newProductRow]);

  return (
    <div>
      <h2 className="mb-4 text-center">Create a new quote</h2>
      <Form method="post" className={formClass}>
        {data?.quoteActionErrors?.info && (
          <label className="label">
            <span className="label-text-alt text-error">
              {data.quoteActionErrors.info}
            </span>
          </label>
        )}
        <input
          type="hidden"
          name="prodcount"
          id="prodcount"
          value={productCount}
        />
        <fieldset disabled={isSubmitting}>
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
              <option value="-1">Add new customer +</option>
              {customers.map(
                ({ customer_id, name, tel, email, address }: customers) => {
                  return (
                    <option key={customer_id} value={customer_id}>
                      {name} - {tel} - {email} - {address}
                    </option>
                  );
                }
              )}
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
        <fieldset disabled={isSubmitting}>
          <label className="label">
            <span className="label-text">Products</span>
          </label>
          {data?.quoteActionErrors?.product && (
            <label className="label">
              <span className="label-text-alt text-error">
                {data.quoteActionErrors.product}
              </span>
            </label>
          )}
          <div className="-mx-4 md:mx-0">
            <table className="table">
              <thead>
                <tr className="hidden md:table-row">
                  <th>Product</th>
                  <th className="w-[150px]">Quantity</th>
                  <th className="text-right w-[150px]">Unit price</th>
                  <th className="text-right w-[150px]">Item total</th>
                </tr>
              </thead>
              <tbody>
                {productSelectValues.map((e, i) => (
                  <QuoteProductRow
                    key={i}
                    rowId={`${i + 1}`}
                    products={products}
                    productSelectValues={productSelectValues}
                    dispatchPSV={dispatchPSV}
                  />
                ))}
                <tr className={respTRClass}>
                  <td colSpan={4} className={TDClass}>
                    <div className="flex md:justify-end btn-group">
                      <FormBtn
                        disabled={productCount === 1}
                        isSubmitting={isSubmitting}
                        onClick={(e) => {
                          e.preventDefault();
                          dispatchPSV({
                            type: "remove",
                            row_id: `${productCount}`,
                          });
                        }}
                      >
                        -
                      </FormBtn>
                      <FormBtn
                        isSubmitting={isSubmitting}
                        onClick={(e) => {
                          e.preventDefault();
                          dispatchPSV({
                            type: "add",
                            row_id: `${productCount + 1}`,
                            product_id: "",
                            quantity: 1,
                            price: 0,
                          });
                        }}
                      >
                        +
                      </FormBtn>
                    </div>
                  </td>
                </tr>
                <tr className={respTRClass}>
                  <td
                    colSpan={2}
                    className={`${TDClass} hidden md:table-cell`}
                  ></td>
                  <td className={`${TDClass} flex md:table-cell`}>
                    <label className="label md:justify-end">
                      <span className="label-text">Subtotal:</span>
                    </label>
                  </td>
                  <td className={TDClass}>
                    <input
                      disabled
                      value={subtotal}
                      className={`${inputClass} md:text-right`}
                    />
                  </td>
                </tr>
                <tr className={respTRClass}>
                  <td
                    colSpan={2}
                    className={`${TDClass} hidden md:table-cell`}
                  ></td>
                  <td className={`${TDClass} flex md:table-cell`}>
                    <label className="label md:justify-end" htmlFor="labour">
                      <span className="label-text">Labour:</span>
                    </label>
                  </td>
                  <td className={TDClass}>
                    <input type="hidden" name="labour" value={labourValue} />
                    <input
                      id="labour"
                      type="number"
                      min="0"
                      step="any"
                      value={labour}
                      className={`${inputClass} md:text-right`}
                      onChange={(e) => {
                        const val = e.target.value;
                        const pennies = val.split(".")[1];
                        if (!pennies || (pennies && pennies.length <= 2))
                          setLabour(val);
                      }}
                    />
                  </td>
                </tr>
                <tr className={respTRClass}>
                  <td
                    colSpan={2}
                    className={`${TDClass} hidden md:table-cell`}
                  ></td>
                  <td className={`${TDClass} flex md:table-cell`}>
                    <label className="label md:justify-end" htmlFor="discount">
                      <span className="label-text">Discount:</span>
                    </label>
                  </td>
                  <td className={TDClass}>
                    <input
                      type="hidden"
                      name="discount"
                      value={discountValue}
                    />
                    <input
                      id="discount"
                      type="number"
                      min="0"
                      value={discount}
                      className={`${inputClass} md:text-right`}
                      onChange={(e) => {
                        const val = e.target.value;
                        const pennies = val.split(".")[1];
                        if (!pennies || (pennies && pennies.length <= 2))
                          setDiscount(val);
                      }}
                    />
                  </td>
                </tr>
                <tr className={respTRClass}>
                  <td
                    colSpan={2}
                    className={`${TDClass} hidden md:table-cell`}
                  ></td>
                  <td className={`${TDClass} flex md:table-cell`}>
                    <label className="label md:justify-end">
                      <span className="label-text">Total:</span>
                    </label>
                  </td>
                  <td className={TDClass}>
                    <input
                      disabled
                      value={grandtotal}
                      className={`${inputClass} md:text-right`}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex md:justify-end mt-4 mb-2">
            <FormBtn
              type="submit"
              name="_action"
              value="create_quote"
              isSubmitting={isSubmitting}
            >
              Submit
            </FormBtn>
            <FormAnchorButton
              className="ml-4"
              href="/quotes"
              isSubmitting={isSubmitting}
            >
              Cancel
            </FormAnchorButton>
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
          <ProductForm
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
