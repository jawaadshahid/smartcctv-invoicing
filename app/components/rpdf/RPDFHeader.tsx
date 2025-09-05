import { Image, View } from "@react-pdf/renderer";
import { logo } from "~/utils/formatters";
import { RPDFStyles } from "./RPDFStyles";
import type { RPDFHeaderProps } from "./types";

export const RPDFHeader = ({ children }: RPDFHeaderProps) => {
  return (
    <View style={RPDFStyles.header} fixed>
      <Image src={logo} style={RPDFStyles.logo} />
      {children}
    </View>
  );
};
