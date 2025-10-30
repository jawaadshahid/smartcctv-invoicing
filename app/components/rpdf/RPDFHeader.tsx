import fs from "fs";
import path from "path";
import { Image, View } from "@react-pdf/renderer";
import { RPDFStyles } from "./RPDFStyles";
import type { RPDFHeaderProps } from "./types";

const resolveLogoLight = (): string | undefined => {
  try {
    const p = path.join(process.cwd(), "app", "assets", "logo-light.png");
    if (!fs.existsSync(p)) return undefined;
    const buf = fs.readFileSync(p);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("RPDFHeader: failed to load logo-light.png:", e);
    return undefined;
  }
};

const LOGO_SRC = resolveLogoLight();

export const RPDFHeader = ({ children }: RPDFHeaderProps) => {
  return (
    <View style={RPDFStyles.header} fixed>
      {LOGO_SRC ? <Image src={LOGO_SRC} style={RPDFStyles.logo} /> : null}
      {children}
    </View>
  );
};
