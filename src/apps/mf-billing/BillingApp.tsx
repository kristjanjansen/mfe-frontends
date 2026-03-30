import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useBills, useBill } from "../../utils/api";
import { useTranslationWithScope } from "../../utils/translations";

function BillList() {
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
            <Link to={`/${bill.id}`} className="underline">
              {bill.title} — {bill.amount}€ ({bill.status})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BillDetail() {
  const { id } = useParams();
  const { data: bill, isLoading } = useBill(id!);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!bill) return <div className="p-4">Not found</div>;

  return (
    <div className="p-4 flex flex-col gap-4">
      <Link to="/" className="underline">Back</Link>
      <h1 className="text-4xl tracking-tight font-bold">{bill.title}</h1>
      <p>Amount: {bill.amount}€</p>
      <p>Status: {bill.status}</p>
    </div>
  );
}

export default function BillingApp({ basePath }: { basePath?: string }) {
  return (
    <BrowserRouter basename={basePath || "/"}>
      <Routes>
        <Route path="/" element={<BillList />} />
        <Route path="/:id" element={<BillDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
