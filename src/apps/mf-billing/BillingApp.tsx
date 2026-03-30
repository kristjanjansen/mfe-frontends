import { useBilling } from "../../utils/api";
import { useTranslationWithScope } from "../../utils/translations";

export default function BillingApp() {
  const { ts } = useTranslationWithScope("billing");
  const billing = useBilling();
  return (
    <div className="bg-surface text-on-surface">
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-4xl tracking-tight font-bold text-on-surface">
          {ts("common.title")}
        </h1>
        <pre>{JSON.stringify(billing.data, null, 2)}</pre>
      </div>
    </div>
  );
}
