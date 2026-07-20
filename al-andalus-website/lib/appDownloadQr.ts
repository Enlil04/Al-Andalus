import QRCode from "qrcode";
import { getUnifiedDownloadUrl } from "@/lib/appDownload";

export async function generateAppDownloadQrDataUrl(): Promise<string> {
  const downloadUrl = getUnifiedDownloadUrl();

  return QRCode.toDataURL(downloadUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 220,
    color: {
      dark: "#0B223D",
      light: "#FFFFFF",
    },
  });
}
