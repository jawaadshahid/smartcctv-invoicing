import { Text, View } from "@react-pdf/renderer";
import { RPDFProdductTableRow } from "./RPDFProdductTableRow";
import { RPDFStyles } from "./RPDFStyles";
import type { RPDFProductTableProps } from "./types";

export const RPDFProductTable = ({ products }: RPDFProductTableProps) => {
  return (
    <>
      <View style={RPDFStyles.table}>
        <View style={[RPDFStyles.tableRow, { borderTop: 0 }]}>
          <View
            style={[
              RPDFStyles.tableCell,
              { textAlign: "left", width: "55%", borderLeftWidth: 0 },
            ]}
          >
            <Text>Product</Text>
          </View>
          <View style={RPDFStyles.tableCell}>
            <Text>Quantity</Text>
          </View>
          <View style={RPDFStyles.tableCell}>
            <Text>Unit price</Text>
          </View>
          <View style={RPDFStyles.tableCell}>
            <Text>Item total</Text>
          </View>
        </View>
        <RPDFProdductTableRow products={products} />
      </View>
    </>
  );
};
