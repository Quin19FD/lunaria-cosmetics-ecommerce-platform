import type { Metadata } from "next";

import { AddressManager } from "@/features/account/components/address-manager";
import { listAddresses } from "@/modules/account/address.actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sổ địa chỉ",
};

export default async function AddressesPage() {
  const addresses = await listAddresses();
  return <AddressManager initialAddresses={addresses} />;
}
