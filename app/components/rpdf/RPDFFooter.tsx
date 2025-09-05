import { Text, View } from "@react-pdf/renderer";
import { RPDFStyles } from "./RPDFStyles";

export const RPDFFooter = () => {
  return (
    <View style={RPDFStyles.footer} fixed>
      <Text
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
};
