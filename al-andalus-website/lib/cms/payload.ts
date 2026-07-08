import { getPayload, type Payload } from "payload";
import configPromise from "@/payload.config";

let payloadPromise: Promise<Payload> | null = null;

export function getCMSPayload(): Promise<Payload> {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config: configPromise });
  }
  return payloadPromise;
}
