import { renderToStream } from "@react-pdf/renderer";
import type { RPDFRenderToBufferProps } from "./types";

export const RPDFRenderToBuffer = async ({
  document,
}: RPDFRenderToBufferProps) => {
  let stream = await renderToStream(document);
  // and transform it to a Buffer to send in the Response
  return new Promise((resolve, reject) => {
    let buffers: Uint8Array[] = [];
    stream.on("data", (data) => buffers.push(data));
    stream.on("end", () => resolve(Buffer.concat(buffers)));
    stream.on("error", () =>
      reject({
        code: 500,
        message: "Internal server error: there was a problem generating PDF",
      })
    );
  });
};
