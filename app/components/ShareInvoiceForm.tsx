import {
  ArrowUturnLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import type { customers, users } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { Form } from "@remix-run/react";
import type { Navigation } from "@remix-run/router";
import { formClass, inputClass } from "~/utils/styleClasses";
import type { InvoicedProductsType } from "~/utils/types";
import {
  getCurrencyString,
  getSubtotal,
  getTwoDecimalPlaces,
} from "../utils/formatters";
import FormBtn from "./FormBtn";

type ProductDataType = {
  invoiced_products: InvoicedProductsType[];
  labour: Prisma.Decimal;
  discount: Prisma.Decimal;
  grandTotal: Prisma.Decimal;
};

const ShareInvoiceFrom = ({
  invoiceid,
  navigation,
  customer,
  productData,
  user,
  onCancel,
  formErrors,
}: {
  invoiceid: number;
  navigation: Navigation;
  customer: customers;
  productData: ProductDataType;
  user: users;
  onCancel: Function;
  formErrors: any;
}) => {
  const { invoiced_products, labour, discount, grandTotal } = productData;
  const labourDec = new Prisma.Decimal(labour);
  const discountDec = new Prisma.Decimal(discount);
  const subtotalDec = getSubtotal(invoiced_products);
  const isSubmitting = navigation.state === "submitting";
  return (
    <Form replace method="post" className={formClass}>
      <input type="hidden" value={invoiceid} name="invoiceid" id="invoiceid" />
      <input
        type="hidden"
        value={invoiced_products ? invoiced_products.length : 0}
        name="productCount"
        id="productCount"
      />
      {invoiced_products &&
        invoiced_products.map(
          ({ name, quantity, price }: InvoicedProductsType, ind) => {
            const priceDec = new Prisma.Decimal(price);
            return (
              <input
                key={ind + 1}
                type="hidden"
                value={`${name} x${quantity}: ${getCurrencyString(
                  priceDec.toNumber() * quantity
                )}`}
                name={`prod_${ind + 1}`}
                id={`prod_${ind + 1}`}
              />
            );
          }
        )}
      <input
        type="hidden"
        value={getTwoDecimalPlaces(subtotalDec)}
        name="subtotal"
        id="subtotal"
      />
      <input
        type="hidden"
        value={getTwoDecimalPlaces(labourDec)}
        name="labour"
        id="labour"
      />
      <input
        type="hidden"
        value={getTwoDecimalPlaces(discountDec)}
        name="discount"
        id="discount"
      />
      <input
        type="hidden"
        value={getTwoDecimalPlaces(grandTotal)}
        name="grandTotal"
        id="grandTotal"
      />
      <fieldset disabled={isSubmitting}>
        {customer.email && (
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">
                {customer.name} ({customer.email})
              </span>
              <input
                type="checkbox"
                className="checkbox"
                name="customerEmail"
                id="customerEmail"
                value={customer.email}
              />
            </label>
          </div>
        )}
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">
              {user.firstName} ({user.email})
            </span>
            <input
              type="checkbox"
              className="checkbox"
              name="userEmail"
              id="userEmail"
              value={user.email}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Other(s)</span>
          </label>
          <input
            type="text"
            name="otherEmails"
            id="otherEmails"
            placeholder="john@example.com,jill@example.com,etc"
            className={inputClass}
          />
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">VAT Invoice</span>
            <input
              type="checkbox"
              className="checkbox"
              name="isVatInvoice"
              id="isVatInvoice"
            />
          </label>
          {formErrors?.msg && (
            <label className="label">
              <span className="label-text-alt text-error">
                {formErrors.msg}
              </span>
            </label>
          )}
        </div>
        <div className="flex justify-end mt-4 mb-2">
          <FormBtn
            type="submit"
            name="_action"
            value="share_invoice"
            isSubmitting={isSubmitting}
          >
            <PaperAirplaneIcon className="h-5 w-5 stroke-2" />
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
  );
};

export default ShareInvoiceFrom;
