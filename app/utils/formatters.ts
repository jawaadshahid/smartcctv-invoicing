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
  items
    .filter(({ price, quantity }) => price && quantity)
    .forEach(({ price, quantity }) => {
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

export const prettifyRefNum = (baseRefNum: number) => {
  const DESIRED_COUNT = 6;
  const charCount = `${baseRefNum}`.length;
  const countDiff = DESIRED_COUNT - charCount;
  return `${
    countDiff > 0 && [...Array(countDiff)].map(() => 0).join("")
  }${baseRefNum}`;
};

export const prettifyFilename = (
  prefix: string,
  baseRefNum: number,
  format: string
) => {
  return `${prefix}_${prettifyRefNum(
    baseRefNum
  )}_${Date.now().toString()}.${format}`;
};

export const prettifyDateString = (dateString: string) => {
  const date = new Date(dateString);
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const dds = dd < 10 ? "0" + dd : `${dd}`;
  const mms = mm < 10 ? "0" + mm : `${mm}`;

  return dds + "/" + mms + "/" + yyyy;
};
