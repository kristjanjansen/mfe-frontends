import { useBilling } from "../../utils/api";
import { useTranslationWithScope } from "../../utils/translations";

export default function BillingApp() {
  const { ts } = useTranslationWithScope("billing");
  const billing = useBilling();
  return (
    <div>
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-4xl tracking-tight font-bold">
          {ts("common.title")}
        </h1>
        <pre>{JSON.stringify(billing.data, null, 2)}</pre>
      </div>
    </div>
  );
}
