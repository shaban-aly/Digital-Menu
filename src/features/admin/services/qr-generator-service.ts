import QRCode from "qrcode";

export interface QRCodeGenerateOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export async function generateQRCodeDataUrl(
  text: string,
  options: QRCodeGenerateOptions = {}
): Promise<string> {
  const defaultOptions: QRCode.QRCodeToDataURLOptions = {
    width: options.width || 512,
    margin: options.margin ?? 2,
    color: {
      dark: options.color?.dark || "#000000",
      light: options.color?.light || "#ffffff",
    },
    errorCorrectionLevel: "M",
  };

  try {
    return await QRCode.toDataURL(text, defaultOptions);
  } catch (err) {
    console.error("Error generating QR code:", err);
    throw new Error("فشل توليد رمز QR");
  }
}

