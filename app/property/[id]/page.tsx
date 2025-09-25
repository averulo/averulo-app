// app/property/[id]/page.tsx
"use client";

import PropertyBookingCard from "@/components/PropertyBookingCard";
import { getProperty } from "@/lib/api";
import { useEffect, useState } from "react";

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default function PropertyPage({ params }: Props) {
  const propertyId = params.id;
  const token =
    typeof window !== "undefined"
      ? (localStorage.getItem("token") || undefined)
      : undefined;

  const [prop, setProp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const p = await getProperty(propertyId, token);
        if (!cancelled) setProp(p);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load property");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [propertyId, token]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err || !prop) return <div className="p-6 text-red-600">{err || "Not found"}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{prop.title}</h1>
        <p className="text-sm text-gray-500">{prop.city}</p>
        {prop.avgRating > 0 && (
          <p className="text-sm">★ {prop.avgRating.toFixed(1)} · {prop.reviewsCount} review(s)</p>
        )}
      </header>

      {prop.description && (
        <p className="text-gray-700 leading-relaxed">{prop.description}</p>
      )}

      <PropertyBookingCard
        propertyId={prop.id}
        nightlyPrice={prop.nightlyPrice}
        initialIsFavorite={Boolean(prop.isFavorite)}
        token={token}
      />
    </div>
  );
}