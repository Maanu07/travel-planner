"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { generateTravelPlan } from "@/lib/api/travelPlan";
import type { TravelPlan } from "@/lib/ai/types";
import "./globals.css";
import { TravelPlanResult } from "@/components/travel/TravelPlanResult";
import {
  TravelPlannerForm,
  TravelPlannerFormValues,
} from "@/components/travel/TravelPlannerForm";

export default function Home() {
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(formData: TravelPlannerFormValues) {
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const plan = await generateTravelPlan(formData, (message) => {
        setStatus(message);
      });

      console.log(plan, "API response");

      setPlan(plan);

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");

      return false;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (plan) {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [plan]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dff6ff_0%,#f8fafc_28%,#f8fafc_100%)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Compass size={19} />
          </div>
          <span className="text-base font-bold tracking-tight">
            Travel<span className="text-blue-600">AI</span>
          </span>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
          <Sparkles size={13} className="text-blue-600" /> AI trip planner
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-14 pt-7 lg:px-8 lg:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <Sparkles size={14} /> Plan less. Explore more.
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Your next trip,
            <br />
            <span className="text-blue-600">planned by AI.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Tell us where you want to go, your budget, and what you love.
            We&apos;ll turn it into a practical day-by-day travel plan.
          </p>
        </div>

        <section className={plan ? "py-8" : "flex items-center justify-center"}>
          <Card className="mx-auto mt-10 max-w-3xl shadow-slate-200/60 border-sky-200/70 bg-white shadow-sm">
            <CardContent className="p-5 sm:p-8">
              <TravelPlannerForm
                isLoading={isLoading}
                status={status}
                error={error}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>
        </section>

        <div className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-x-7 gap-y-2 text-xs font-medium text-slate-400">
          <span>✓ Personalized itinerary</span>
          <span>✓ Weather overview</span>
          <span>✓ Budget breakdown</span>
          <span>✓ Local recommendations</span>
        </div>

        {plan && (
          <section
            className="mt-8 border-t border-slate-200/70 bg-slate-50/95 py-12 space-y-8"
            ref={resultRef}
          >
            <TravelPlanResult plan={plan} />
          </section>
        )}
      </section>
    </main>
  );
}
