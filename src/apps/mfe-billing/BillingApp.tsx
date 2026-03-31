import { useBills } from "../../utils/api";
import { useTranslationWithScope } from "../../utils/translations";

export default function BillingApp() {
  const { ts } = useTranslationWithScope("billing");
  const { data: bills } = useBills();

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-4xl tracking-tight font-bold">
        {ts("common.title")}
      </h1>
      <ul className="flex flex-col gap-2">
        {bills?.map((bill) => (
          <li key={bill.id}>
            {bill.title} — {bill.amount}€ ({bill.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
