import type { BookingQRPayload } from "../../types/features/booking";
import QRCode from "qrcode";
import { QRCodeGenerationError } from "./errors";

export function getPayloadString({
  user_firstname: ufs,
  user_secondname: usn,
  route_code: rc,
  terminal_gate: tg,
  booking_cost: cst,
  booking_seats: bs,
  created: dt,
}: BookingQRPayload): string {
  return `Пользователь ${ufs} ${usn}\nМаршрут ${rc}\nВыход на посадку ${tg}\nСтоимость билета ${cst}\nЗабронировано мест ${bs}\nЗабронировано ${dt.toLocaleString()}`;
}

/**
 * Function that generates QR Code for booking
 * @throws {QRCodeGenerationError}
 * @returns QR Code buffer
 */
export async function generateQRCodeImageBuffer(
  payloadString: string,
  version: number,
): Promise<Buffer<ArrayBufferLike>> {
  const qrOptions: QRCode.QRCodeToBufferOptions = {
    errorCorrectionLevel: "M",
    margin: 4,
    version,
  };

  try {
    const qrBuffer = await QRCode.toBuffer(payloadString, qrOptions);
    return qrBuffer;
  } catch (err) {
    console.log(err);
    throw new QRCodeGenerationError("unable to create qr-code");
  }
}
