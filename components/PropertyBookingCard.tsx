import { createBooking, getPublicBlocks, initPayment, quote, toggleFavorite } from "@/lib/api";
import { useEffect, useState } from "react";

export default function PropertyBookingCard({
  propertyId, nightlyPrice, initialIsFavorite, token,
}: { propertyId: string; nightlyPrice: number; initialIsFavorite: boolean; token?: string; }) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [blocked, setBlocked] = useState<any[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [pricing, setPricing] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);
  const authed = Boolean(token);

  useEffect(() => {
    getPublicBlocks(propertyId).then(setBlocked).catch(() => setBlocked([]));
  }, [propertyId]);

  useEffect(() => {
    if (checkIn && checkOut) {
      quote(propertyId, checkIn, checkOut).then(setPricing).catch(() => setPricing(null));
    } else {
      setPricing(null);
    }
  }, [propertyId, checkIn, checkOut]);

  async function onBook() {
    if (!authed) return alert("Please sign in first");
    try {
      setBusy(true);
      const b = await createBooking(token!, propertyId, checkIn, checkOut);
      const p = await initPayment(token!, b.id);
      window.location.href = p.authorization_url; // hand off to Paystack
    } catch (e:any) {
      alert(e.message || "Booking failed");
    } finally { setBusy(false); }
  }

  async function onToggleFav() {
    if (!authed) return alert("Please sign in first");
    try {
      await toggleFavorite(propertyId, token!, !isFavorite);
      setIsFavorite(!isFavorite);
    } catch { /* noop */ }
  }

  return (
    <div className="space-y-3 p-4 rounded-xl border">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">₦{nightlyPrice.toLocaleString()} / night</div>
        <button onClick={onToggleFav} className="text-sm underline">
          {isFavorite ? "★ Favorited" : "☆ Add to favorites"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} className="border p-2 rounded"/>
        <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} className="border p-2 rounded"/>
      </div>

      {blocked.length > 0 && (
        <p className="text-xs text-gray-500">
          Blocked: {blocked.map(b => `${b.startDate.slice(0,10)}→${b.endDate.slice(0,10)}`).join(", ")}
        </p>
      )}

      {pricing && (
        <div className="text-sm">
          <div>Nights: {pricing.nights}</div>
          <div>Base: ₦{pricing.base.toLocaleString()}</div>
          <div>Cleaning: ₦{pricing.cleaning.toLocaleString()}</div>
          <div>Service: ₦{pricing.service.toLocaleString()}</div>
          <div>Tax: ₦{pricing.tax.toLocaleString()}</div>
          <div className="font-semibold">Total: ₦{(pricing.total/100).toLocaleString()} </div>
        </div>
      )}

      <button disabled={!pricing || busy} onClick={onBook} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
        {busy ? "Redirecting…" : "Book & Pay"}
      </button>
    </div>
  );
}