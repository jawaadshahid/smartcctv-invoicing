import type {
  customers,
  product_brands,
  product_models,
  product_types,
  products,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Form } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";
import { useEffect, useReducer, useState } from "react";
import {
  getGrandTotal,
  getSubtotal,
  getTwoDecimalPlaces,
} from "~/utils/formatters";
import {
  TDClass,
  formClass,
  inputClass,
  respTRClass,
  selectClass,
} from "~/utils/styleClasses";
import type { QuotesType } from "~/utils/types";
import FormBtn from "./FormBtn";
import QuoteNewProductRow from "./QuoteNewProductRow";
import Modal from "./Modal";
import CustomerForm from "./CustomerForm";
import ProductForm from "./ProductForm";
import QuoteEditProductRow from "./QuoteEditProductRow";

const QuoteForm = ({
  quoteFormData,
  navigation,
  formData,
  onCancel,
  actionName,
}: {
  quoteFormData: {
    customers: customers[];
    products: products[] | any[];
    brands: product_brands[];
    types: product_types[];
    models: product_models[];
    quote?: QuotesType;
  };
  navigation: Navigation;
  formData: any;
  onCancel: Function;
  actionName: string;
}) => {
  const {
    customers,
    products,
    brands,
    types,
    models,
    quote: existingData,
  } = quoteFormData;
  const [customerSelectValue, setCustomerSelectValue] = useState("");
  const [labour, setLabour] = useState("0");
  const [labourValue, setLabourValue] = useState(0);
  const [discount, setDiscount] = useState("0");
  const [discountValue, setDiscountValue] = useState(0);
  const [subtotal, setSubtotal] = useState("0");
  const [grandtotal, setGrandtotal] = useState("0");
  const [newProductRow, setNewProductRow] = useState(0);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [productSelectValues, psvDispatcher] = useReducer(
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
            return [...state, { ...values }];
          }
          return state;
        case "remove":
          const newState = state.filter((psv) => psv.row_id !== values.row_id);
          return newState.map((psv, i) => {
            return { ...psv, row_id: `${i + 1}` };
          });
        default:
          return state;
      }
    },
    [{ row_id: "1", product_id: "", quantity: 1, price: new Prisma.Decimal(0) }]
  );
  const [productInputValues, pivDispatcher] = useReducer(
    (state: any[], action: any) => {
      const { type, ...values } = action;
      switch (type) {
        case "update":
          return state.map((piv) => {
            if (piv.row_id === values.row_id) {
              return { ...piv, ...values };
            }
            return { ...piv };
          });
        case "add":
          const doesExist = Boolean(
            state.find((piv) => piv.row_id === values.row_id)
          );
          if (!doesExist) {
            return [...state, { ...values }];
          }
          return state;
        case "remove":
          const newState = state.filter((piv) => piv.row_id !== values.row_id);
          return newState.map((piv, i) => {
            return { ...piv, row_id: `${i + 1}` };
          });
        default:
          return state;
      }
    },
    []
  );

  useEffect(() => {
    if (!existingData) return;
    const { customer, labour, discount, quoted_products } = existingData;
    setCustomerSelectValue(customer ? customer.customer_id.toString() : "");
    setLabour(labour.toString());
    setDiscount(discount.toString());
    quoted_products.forEach(({ name, quantity, price }, i) => {
      pivDispatcher({
        type: "add",
        row_id: `${i + 1}`,
        name,
        quantity,
        price: new Prisma.Decimal(price),
      });
    });
  }, [existingData]);

  useEffect(() => {
    const labourNum = Number(labour);
    setLabourValue(isNaN(labourNum) ? 0 : labourNum);
  }, [labour]);

  useEffect(() => {
    const discountNum = Number(discount);
    setDiscountValue(isNaN(discountNum) ? 0 : discountNum);
  }, [discount]);

  useEffect(() => {
    const subTotalDec = Prisma.Decimal.add(
      getSubtotal(productInputValues),
      getSubtotal(productSelectValues)
    );
    setSubtotal(getTwoDecimalPlaces(subTotalDec));
  }, [productInputValues, productSelectValues]);

  useEffect(() => {
    const subTotalDec = Prisma.Decimal.add(
      getSubtotal(productInputValues),
      getSubtotal(productSelectValues)
    );
    const grandTotalDec = getGrandTotal(
      subTotalDec,
      new Prisma.Decimal(labourValue),
      new Prisma.Decimal(discountValue)
    );
    setGrandtotal(getTwoDecimalPlaces(grandTotalDec));
  }, [productInputValues, productSelectValues, labourValue, discountValue]);

  useEffect(() => {
    setIsNewCustomer(customerSelectValue === "-1");
  }, [customerSelectValue, setIsNewCustomer]);

  useEffect(() => {
    if (!formData) return;
    if (formData.createdCustomer) {
      setCustomerSelectValue(`${formData.createdCustomer.customer_id}`);
    }
    if (formData.createdProduct) {
      const { product_id, price }: products = formData.createdProduct;
      psvDispatcher({
        type: "update",
        row_id: newProductRow,
        product_id: `${product_id}`,
        price,
      });
    }
    return () => {};
  }, [formData, newProductRow, customers]);

  const isSubmitting = navigation.state === "submitting";
  const psvCount = productSelectValues.length;
  const pivCount = productInputValues.length;

  return (
    <>
      <Form method="post" className={formClass}>
        {formData && formData.info && (
          <label className="label">
            <span className="label-text-alt text-error">{formData.info}</span>
          </label>
        )}
        <input
          type="hidden"
          name="prodcount"
          id="prodcount"
          value={psvCount + pivCount}
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
                      {`${name}${tel && ` - ${tel}`}${email && ` - ${email}`}${
                        address && ` - ${address}`
                      }`}
                    </option>
                  );
                }
              )}
            </select>
            {formData && formData.customer && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {formData.customer}
                </span>
              </label>
            )}
          </div>
        </fieldset>
        <fieldset disabled={isSubmitting}>
          <label className="label">
            <span className="label-text">Products</span>
          </label>
          {formData && formData.product && (
            <label className="label">
              <span className="label-text-alt text-error">
                {formData.product}
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
                {productInputValues.map((e, i) => (
                  <QuoteEditProductRow
                    key={i}
                    rowId={`${i + 1}`}
                    productInputValue={productInputValues[i]}
                    dispatcher={pivDispatcher}
                  />
                ))}
                {productSelectValues.map((e, i) => (
                  <QuoteNewProductRow
                    key={i}
                    rowId={`${i + 1}`}
                    products={products}
                    productSelectValue={productSelectValues[i]}
                    dispatcher={psvDispatcher}
                  />
                ))}
                <tr className={respTRClass}>
                  <td colSpan={4} className={TDClass}>
                    <div className="flex md:justify-end btn-group">
                      <FormBtn
                        disabled={psvCount === 1}
                        isSubmitting={isSubmitting}
                        onClick={(e) => {
                          e.preventDefault();
                          psvDispatcher({
                            type: "remove",
                            row_id: `${psvCount}`,
                          });
                        }}
                      >
                        -
                      </FormBtn>
                      <FormBtn
                        isSubmitting={isSubmitting}
                        onClick={(e) => {
                          e.preventDefault();
                          psvDispatcher({
                            type: "add",
                            row_id: `${psvCount + 1}`,
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
                      <span className="label-text">Discount: -</span>
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
              value={actionName}
              isSubmitting={isSubmitting}
            >
              Submit
            </FormBtn>
            <FormBtn
              className="ml-4"
              isSubmitting={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                onCancel();
              }}
            >
              Cancel
            </FormBtn>
          </div>
        </fieldset>
      </Form>
      <Modal open={isNewCustomer}>
        <h3 className="mb-4">Create new customer</h3>
        {isNewCustomer && (
          <CustomerForm
            actionName="create_customer"
            navigation={navigation}
            formErrors={formData?.customerActionErrors}
            onCancel={() => {
              setCustomerSelectValue("");
              if (formData) formData.customerActionErrors = {};
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
            formErrors={formData?.productActionErrors}
            onCancel={() => {
              psvDispatcher({
                type: "update",
                row_id: newProductRow,
                product_id: "",
              });
              if (formData) formData.productActionErrors = {};
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default QuoteForm;
