import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  DocumentMinusIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import type { customers, products } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Form } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";
import { ReactNode, useEffect, useReducer, useState } from "react";
import { error } from "~/utils/errors";
import {
  getGrandTotal,
  getSubtotal,
  getTwoDecimalPlaces,
} from "~/utils/formatters";
import {
  formClass,
  inputClass,
  respTDClass,
  respTRClass,
} from "~/utils/styleClasses";
import type { QuotesWithCustomersType } from "~/utils/types";
import CustomerForm from "./CustomerForm";
import FormBtn from "./FormBtn";
import Modal from "./Modal";
import ProductForm from "./ProductForm";
import QuoteEditProductRow from "./QuoteEditProductRow";
import QuoteNewProductRow from "./QuoteNewProductRow";
import ReadOnlyWithClearInput from "./ReadOnlyWithClearInput";
import SearchInputWithDropdown, { ItemType } from "./SearchInputWithDropdown";

type QuoteForm = {
  existingQuoteData?: QuotesWithCustomersType;
  setExistingQuoteData?: React.Dispatch<
    React.SetStateAction<QuotesWithCustomersType | null>
  >;
  navigation: Navigation;
  createdCustomer: customers | null;
  setCreatedCustomer: React.Dispatch<React.SetStateAction<customers | null>>;
  createdProduct: products | null;
  setCreatedProduct: React.Dispatch<React.SetStateAction<products | null>>;
  onCancel: Function;
  actionName: string;
  setAlertData: React.Dispatch<React.SetStateAction<error | null>>;
};

const QuoteForm = ({
  existingQuoteData,
  setExistingQuoteData,
  navigation,
  createdCustomer,
  setCreatedCustomer,
  createdProduct,
  setCreatedProduct,
  onCancel,
  actionName,
  setAlertData,
}: QuoteForm) => {
  const [currentCustomer, setCurrectCustomer] = useState<customers | null>(
    null
  );
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [labour, setLabour] = useState("0");
  const [labourValue, setLabourValue] = useState(0);
  const [discount, setDiscount] = useState("0");
  const [discountValue, setDiscountValue] = useState(0);
  const [subtotal, setSubtotal] = useState("0");
  const [grandtotal, setGrandtotal] = useState("0");
  const [newProduct, setNewProduct] = useState<products | null>(null);
  const [newProductRow, setNewProductRow] = useState(0);
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
          return state.filter((psv) => psv.row_id !== values.row_id);
        default:
          return state;
      }
    },
    []
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
          return state.filter((piv) => piv.row_id !== values.row_id);
        default:
          return state;
      }
    },
    []
  );

  useEffect(() => {
    // first time only
    if (!existingQuoteData) return;
    const { customer, labour, discount, quoted_products } = existingQuoteData;
    if (customer) setCurrectCustomer(customer);
    if (labour) setLabour(labour.toString());
    if (discount) setDiscount(discount.toString());
    if (quoted_products)
      quoted_products.forEach(({ name, quantity, price }, i) => {
        pivDispatcher({
          type: "add",
          row_id: `${i + 1}`,
          name,
          quantity,
          price: new Prisma.Decimal(price),
        });
      });
    if (setExistingQuoteData) setExistingQuoteData(null);
  }, [existingQuoteData]);

  useEffect(() => {
    if (!createdCustomer) return;
    setCurrectCustomer(createdCustomer);
    setIsAddingNewCustomer(false);
    setCreatedCustomer(null);
  }, [createdCustomer]);

  useEffect(() => {
    if (!createdProduct) return;
    setNewProduct(createdProduct);
    const { product_id, price }: products = createdProduct;
    psvDispatcher({
      type: "update",
      row_id: newProductRow,
      product_id: `${product_id}`,
      price,
    });
    setCreatedProduct(null);
  }, [createdProduct]);

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

  const isSubmitting = navigation.state === "submitting";
  const allProductValues = productSelectValues
    .concat(productInputValues)
    .sort((a, b) => (parseInt(a.row_id) > parseInt(b.row_id) ? 1 : -1));
  const apvCount = allProductValues.length;

  const ProductRow = (): ReactNode => {
    return (
      <>
        {[...Array(apvCount)].map((e, i) => {
          const rowItem = allProductValues.find(
            (valueObj) => valueObj.row_id === `${i + 1}`
          );
          if (!rowItem) return;
          if (rowItem.hasOwnProperty("product_id")) {
            return (
              <QuoteNewProductRow
                key={rowItem.row_id}
                rowId={rowItem.row_id}
                dispatcher={psvDispatcher}
                setAlertData={setAlertData}
                {...(newProduct &&
                newProduct.product_id.toString() === rowItem.product_id
                  ? { createdProduct: newProduct }
                  : {})}
              />
            );
          } else {
            return (
              <QuoteEditProductRow
                key={rowItem.row_id}
                rowId={rowItem.row_id}
                productInputValue={rowItem}
                dispatcher={pivDispatcher}
              />
            );
          }
        })}
      </>
    );
  };

  const removeProductRow = () => {
    const rowItem = allProductValues.at(-1);
    if (!rowItem) return;
    if (rowItem.hasOwnProperty("product_id")) {
      psvDispatcher({
        type: "remove",
        row_id: `${rowItem.row_id}`,
      });
    } else {
      pivDispatcher({
        type: "remove",
        row_id: `${rowItem.row_id}`,
      });
    }
  };

  const addProductRow = (rowType: "custom" | "product") => {
    const targetDispatcher =
      rowType === "custom" ? pivDispatcher : psvDispatcher;
    const lastItem = allProductValues.at(-1);
    const row_id = lastItem ? lastItem.row_id : "0";
    targetDispatcher({
      row_id: `${parseInt(row_id) + 1}`,
      type: "add",
      ...(rowType === "custom" && { name: "" }),
      ...(rowType === "product" && { product_id: "" }),
      quantity: 1,
      price: 0,
    });
  };

  return (
    <>
      <Form method="post" className={formClass}>
        <input type="hidden" name="prodcount" id="prodcount" value={apvCount} />
        <fieldset disabled={isSubmitting}>
          <div className="mb-4 flex flex-wrap items-start gap-2">
            {currentCustomer ? (
              <ReadOnlyWithClearInput
                name="customer"
                id="customer"
                value={currentCustomer.customer_id}
                label={`${currentCustomer.name} - ${currentCustomer.address}`}
                onClear={() => setCurrectCustomer(null)}
              />
            ) : (
              <>
                <div className="flex-1">
                  <SearchInputWithDropdown
                    dataType="customers"
                    setAlertData={setAlertData}
                    onItemClick={(item: ItemType) =>
                      setCurrectCustomer(item as customers)
                    }
                  />
                </div>
                <FormBtn
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddingNewCustomer(true);
                  }}
                >
                  <UserPlusIcon className="h-5 w-5 stroke-2" />
                </FormBtn>
              </>
            )}
          </div>
        </fieldset>
        <fieldset disabled={isSubmitting}>
          <label className="label">
            <span className="label-text">Products</span>
          </label>
          <div className="-m-4 md:mb-0 md:mx-0">
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
                {ProductRow()}
                <tr className={respTRClass}>
                  <td colSpan={4} className={respTDClass}>
                    <div className="flex justify-end btn-group">
                      <FormBtn
                        disabled={apvCount === 0}
                        isSubmitting={isSubmitting}
                        onClick={(e) => {
                          e.preventDefault();
                          removeProductRow();
                        }}
                      >
                        <DocumentMinusIcon className="h-5 w-5 stroke-2" />
                      </FormBtn>
                      <FormBtn
                        isSubmitting={isSubmitting}
                        onClick={(e) => {
                          e.preventDefault();
                          addProductRow("product");
                        }}
                      >
                        <DocumentPlusIcon className="h-5 w-5 stroke-2" />
                      </FormBtn>
                      <FormBtn
                        isSubmitting={isSubmitting}
                        onClick={(e) => {
                          e.preventDefault();
                          addProductRow("custom");
                        }}
                      >
                        <DocumentTextIcon className="h-5 w-5 stroke-2" />
                      </FormBtn>
                    </div>
                  </td>
                </tr>
                <tr className={respTRClass}>
                  <td
                    colSpan={2}
                    className={`${respTDClass} hidden md:table-cell`}
                  ></td>
                  <td className={`${respTDClass} flex md:table-cell`}>
                    <label className="label md:justify-end">
                      <span className="label-text">Subtotal:</span>
                    </label>
                  </td>
                  <td className={respTDClass}>
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
                    className={`${respTDClass} hidden md:table-cell`}
                  ></td>
                  <td className={`${respTDClass} flex md:table-cell`}>
                    <label className="label md:justify-end" htmlFor="labour">
                      <span className="label-text">Labour:</span>
                    </label>
                  </td>
                  <td className={respTDClass}>
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
                    className={`${respTDClass} hidden md:table-cell`}
                  ></td>
                  <td className={`${respTDClass} flex md:table-cell`}>
                    <label className="label md:justify-end" htmlFor="discount">
                      <span className="label-text">Discount: -</span>
                    </label>
                  </td>
                  <td className={respTDClass}>
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
                    className={`${respTDClass} hidden md:table-cell`}
                  ></td>
                  <td className={`${respTDClass} flex md:table-cell`}>
                    <label className="label md:justify-end">
                      <span className="label-text">Total:</span>
                    </label>
                  </td>
                  <td className={respTDClass}>
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
          <div className="flex justify-end mt-4 mb-2">
            <FormBtn
              type="submit"
              name="_action"
              value={actionName}
              isSubmitting={isSubmitting}
            >
              <ArrowDownTrayIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
            <FormBtn
              className="ml-4"
              isSubmitting={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                onCancel();
              }}
            >
              <ArrowUturnLeftIcon className="h-5 w-5 stroke-2" />
            </FormBtn>
          </div>
        </fieldset>
      </Form>
      <Modal open={isAddingNewCustomer}>
        <h3 className="mb-4">Create new customer</h3>
        {isAddingNewCustomer && (
          <CustomerForm
            actionName="create_customer"
            navigation={navigation}
            onCancel={() => setIsAddingNewCustomer(false)}
          />
        )}
      </Modal>
      <Modal open={isNewProduct}>
        <h3 className="mb-4">Create new product</h3>
        {isNewProduct && (
          <ProductForm
            actionName="create_product"
            navigation={navigation}
            setAlertData={setAlertData}
            onCancel={() =>
              psvDispatcher({
                type: "update",
                row_id: newProductRow,
                product_id: "",
              })
            }
          />
        )}
      </Modal>
    </>
  );
};

export default QuoteForm;
