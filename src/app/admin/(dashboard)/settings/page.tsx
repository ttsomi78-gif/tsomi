import { getShippingRates } from "@/lib/settings";
import { ShippingRatesForm } from "./shipping-form";

export default async function AdminSettingsPage() {
  const rates = await getShippingRates();

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Shop-wide options that don&apos;t need a deploy.</p>

      <h2 className="mt-8 text-[15px] font-semibold tracking-tight">Delivery rates</h2>
      <p className="mb-4 mt-0.5 text-sm text-gray-500">
        What the customer pays for delivery, by destination. Picked up at checkout
        from the country they choose, shown on product pages and the delivery
        policy page. Countries outside these zones can&apos;t be ordered to — the
        checkout asks them to message you on Instagram.
      </p>
      <ShippingRatesForm rates={rates} />
    </div>
  );
}
