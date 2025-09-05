import {
  type invoiced_products,
  type quoted_products,
  Prisma,
} from "@prisma/client";
import { Text, View } from "@react-pdf/renderer";
import { getCurrencyString } from "~/utils/formatters";
import { RPDFStyles } from "./RPDFStyles";
import type { RPDFProdductTableRowProps } from "./types";

export const RPDFProdductTableRow = ({
  products,
}: RPDFProdductTableRowProps) => {
  return (
    <>
      {products &&
        products.map(
          ({
            invprod_id,
            name,
            quantity,
            price,
          }: invoiced_products | quoted_products) => (
            <View key={invprod_id} style={RPDFStyles.tableRow}>
              <View
                style={[
                  RPDFStyles.tableCell,
                  {
                    textAlign: "left",
                    width: "55%",
                    borderLeftWidth: 0,
                  },
                ]}
              >
                <Text>{name}</Text>
              </View>
              <View style={RPDFStyles.tableCell}>
                <Text>{quantity}</Text>
              </View>
              <View style={RPDFStyles.tableCell}>
                <Text>{getCurrencyString(price)}</Text>
              </View>
              <View style={RPDFStyles.tableCell}>
                <Text>
                  {getCurrencyString(Prisma.Decimal.mul(price, quantity))}
                </Text>
              </View>
            </View>
          )
        )}
    </>
  );
};
