import { describe, it, expect, vi, beforeEach } from "vitest";

const mockBills = [
  { id: 1, title: "January 2026", amount: 142.5, status: "paid" },
  { id: 2, title: "February 2026", amount: 138.2, status: "unpaid" },
];

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      if (url.endsWith("/api/v2/bills")) {
        return Promise.resolve({
          json: () => Promise.resolve({ data: mockBills }),
        });
      }
      if (url.match(/\/api\/v2\/bills\/\d+$/)) {
        const id = Number(url.split("/").pop());
        const bill = mockBills.find((b) => b.id === id);
        return Promise.resolve({
          json: () => Promise.resolve({ data: bill ?? null }),
        });
      }
      return Promise.resolve({ json: () => Promise.resolve({}) });
    })
  );

  vi.stubEnv("MFE_API_URL", "http://localhost:5000");
});

describe("API fetch functions", () => {
  it("fetches bills list", async () => {
    const res = await fetch("http://localhost:5000/api/v2/bills");
    const json = await res.json();
    expect(json.data).toHaveLength(2);
    expect(json.data[0].title).toBe("January 2026");
  });

  it("fetches single bill by id", async () => {
    const res = await fetch("http://localhost:5000/api/v2/bills/1");
    const json = await res.json();
    expect(json.data.id).toBe(1);
    expect(json.data.amount).toBe(142.5);
  });

  it("returns null for unknown bill id", async () => {
    const res = await fetch("http://localhost:5000/api/v2/bills/999");
    const json = await res.json();
    expect(json.data).toBeNull();
  });
});
