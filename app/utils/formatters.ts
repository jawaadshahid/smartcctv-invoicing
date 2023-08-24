import { Prisma } from "@prisma/client";

const currencyFormatter = Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});
export const getCurrencyString = (
  value: number | Prisma.Decimal | string
): string => {
  let fVal;
  switch (typeof value) {
    case "number":
      fVal = value;
      break;
    case "string":
      fVal = Number(value);
      break;
    default:
      fVal = value.toNumber();
  }
  return currencyFormatter.format(fVal);
};

export const getSubtotal = (
  items: { price: Prisma.Decimal; quantity: number }[]
): Prisma.Decimal => {
  let subTotal = new Prisma.Decimal(0);
  items.forEach(({ price, quantity }) => {
    subTotal = Prisma.Decimal.add(
      subTotal,
      Prisma.Decimal.mul(price, quantity || 1)
    );
  });
  return subTotal;
};

export const getGrandTotal = (
  subtotal: Prisma.Decimal,
  labour: Prisma.Decimal,
  discount: Prisma.Decimal
): Prisma.Decimal => {
  return Prisma.Decimal.sum(subtotal, labour, discount.negated());
};

export const getTwoDecimalPlaces = (
  value: number | Prisma.Decimal | string
): string => {
  let dec;
  switch (typeof value) {
    case "number":
    case "string":
      dec = new Prisma.Decimal(value);
      break;
    default:
      dec = value;
  }
  if (!value || dec.isNaN()) return "";
  return dec.decimalPlaces() !== 2
    ? dec.toFixed(2, Prisma.Decimal.ROUND_UP)
    : dec.toString();
};

export const constructEmailBody = (
  subtotal: FormDataEntryValue,
  labour: FormDataEntryValue,
  discount: FormDataEntryValue,
  grandTotal: FormDataEntryValue,
  productCount: FormDataEntryValue,
  productData: any
) => {
  const pCount: number = parseInt(`${productCount}`);
  let htmlStr = `<p>Hi,<br>Please see below for your quotation:</p>`;
  htmlStr += `<p>`;
  for (let ind = 0; ind < pCount; ind++) {
    const productValue: FormDataEntryValue = productData[`prod_${ind + 1}`];
    htmlStr += `${productValue}<br>`;
  }
  htmlStr += `Subtotal: ${getCurrencyString(`${subtotal}`)}<br>`;
  htmlStr += `Labour: ${getCurrencyString(`${labour}`)}<br>`;
  if (Number(`${discount}`) > 0)
    htmlStr += `Discount: -${getCurrencyString(`${discount}`)}<br>`;
  htmlStr += `Total: ${getCurrencyString(`${grandTotal}`)}`;
  htmlStr += `</p>`;
  htmlStr += `<p>A PDF containing your quotation is also attached for your records.</p>`;
  htmlStr += `<p>Kind Regards,<br>Smart CCTV</p>`;
  return htmlStr;
};

export const prettifyDateString = (dateString: string) => {
  const date = new Date(dateString);
  return date.toDateString();
};
