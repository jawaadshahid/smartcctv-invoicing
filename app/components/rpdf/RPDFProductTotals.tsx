import { Prisma } from "@prisma/client";
import { Text, View } from "@react-pdf/renderer";
import { getCurrencyString } from "~/utils/formatters";
import { RPDFStyles } from "./RPDFStyles";
import type { RPDFProductTotalsProps } from "./types";

export const RPDFProductTotals = ({
  subtotal,
  labour,
  discount,
  grandTotal,
  isVat,
}: RPDFProductTotalsProps) => {
  const vatLabour = Prisma.Decimal.mul(labour, 0.8);
  const vatTotal = Prisma.Decimal.mul(grandTotal, 0.2);
  const vatGrandTotal = Prisma.Decimal.mul(vatTotal, 5);
  return (
    <>
      <View style={RPDFStyles.endRow}>
        <Text style={RPDFStyles.endField}>Subtotal:</Text>
        <Text style={RPDFStyles.endValue}>{getCurrencyString(subtotal)}</Text>
      </View>
      <View style={RPDFStyles.endRow}>
        <Text style={RPDFStyles.endField}>Labour:</Text>
        <Text style={RPDFStyles.endValue}>
          {getCurrencyString(isVat ? vatLabour : labour)}
        </Text>
      </View>
      {discount.toNumber() > 0 ? (
        <View style={RPDFStyles.endRow}>
          <Text style={RPDFStyles.endField}>Discount:</Text>
          <Text style={RPDFStyles.endValue}>
            -{getCurrencyString(discount)}
          </Text>
        </View>
      ) : null}
      {isVat ? (
        <>
          <View style={RPDFStyles.endRow}>
            <Text style={RPDFStyles.endField}>VAT:</Text>
            <Text style={RPDFStyles.endValue}>
              {getCurrencyString(vatTotal)}
            </Text>
          </View>
          <View style={RPDFStyles.endRow}>
            <Text style={RPDFStyles.endField}>Total:</Text>
            <Text style={RPDFStyles.endValue}>
              {getCurrencyString(vatGrandTotal)}
            </Text>
          </View>
        </>
      ) : (
        <View style={RPDFStyles.endRow}>
          <Text style={RPDFStyles.endField}>Total:</Text>
          <Text style={RPDFStyles.endValue}>
            {getCurrencyString(grandTotal)}
          </Text>
        </View>
      )}
    </>
  );
};
