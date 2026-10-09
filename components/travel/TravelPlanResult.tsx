"use client";

import {
  CalendarDays,
  MapPin,
  Map,
  Landmark,
  Wallet,
  Hotel,
  Utensils,
  Car,
  Ticket,
  Lightbulb,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TravelPlan } from "@/lib/ai/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";

import { TravelPlanPDF } from "./TravelPlanPDF";
import { Button } from "@/components/ui/button";

interface TravelPlanResultProps {
  plan: TravelPlan;
}

export function TravelPlanResult({ plan }: TravelPlanResultProps) {
  return (
    <div className="mb-8 px-10">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100">
          <Map className="h-5 w-5 text-teal-600" />
        </div>

        <p className="text-sm font-medium text-teal-600">Your Travel Plan</p>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-slate-900">
        Your Trip
      </h2>

      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
        {plan.overview}
      </p>

      <div className="mt-6">
        <PDFDownloadLink
          document={<TravelPlanPDF plan={plan} />}
          fileName="travel-plan.pdf"
        >
          {({ loading }) => (
            <Button variant="outline" disabled={loading}>
              <Download className="mr-2 h-4 w-4" />
              {loading ? "Preparing PDF..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Itinerary Section */}
      <div className="mt-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Map className="h-5 w-5 text-primary text-teal-600" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Itinerary</h3>

            <p className="text-sm text-muted-foreground">
              Your day-by-day travel plan
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {plan.itinerary.map((day) => (
            <Card
              key={day.day}
              className="overflow-hidden border-teal-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="border-b border-teal-100 bg-teal-50/60">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CalendarDays className="h-5 w-5 text-teal-600" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Day {day.day}
                    </p>

                    <CardTitle className="mt-1">{day.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="space-y-4">
                  {day.activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground text-teal-600" />
                      </div>

                      <p className="pt-1 text-sm leading-6">{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Attractions Section */}
      <div className="mt-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Landmark className="h-5 w-5 text-primary text-blue-600" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Places to Visit</h3>

            <p className="text-sm text-muted-foreground">
              Highlights worth exploring
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {plan.attractions.map((attraction) => (
            <Card
              key={attraction.name}
              className="border-blue-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader className="bg-blue-50/40">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>

                  <CardTitle className="pt-1">{attraction.name}</CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {attraction.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div className="mt-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Wallet className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Estimated Budget</h3>

            <p className="text-sm text-muted-foreground">
              Approximate cost breakdown for your trip
            </p>
          </div>
        </div>

        {/* Total */}
        <Card className="mt-6 overflow-hidden border-emerald-100 bg-white shadow-sm">
          <div className="bg-emerald-50/60 px-6 py-6">
            <p className="text-sm font-medium text-emerald-700">
              Estimated Total
            </p>

            <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-800">
              {plan.budget.currency} {plan.budget.total.toLocaleString()}
            </p>
          </div>
        </Card>

        {/* Breakdown */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <Hotel className="h-5 w-5 text-emerald-600" />

              <p className="mt-4 text-sm text-muted-foreground">
                Accommodation
              </p>

              <p className="mt-1 text-lg font-semibold">
                {plan.budget.currency}{" "}
                {plan.budget.accommodation.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <Utensils className="h-5 w-5 text-emerald-600" />

              <p className="mt-4 text-sm text-muted-foreground">Food</p>

              <p className="mt-1 text-lg font-semibold">
                {plan.budget.currency} {plan.budget.food.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <Car className="h-5 w-5 text-emerald-600" />

              <p className="mt-4 text-sm text-muted-foreground">
                Transportation
              </p>

              <p className="mt-1 text-lg font-semibold">
                {plan.budget.currency}{" "}
                {plan.budget.transportation.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <Ticket className="h-5 w-5 text-emerald-600" />

              <p className="mt-4 text-sm text-muted-foreground">Activities</p>

              <p className="mt-1 text-lg font-semibold">
                {plan.budget.currency} {plan.budget.activities.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="pt-6">
              <MoreHorizontal className="h-5 w-5 text-emerald-600" />

              <p className="mt-4 text-sm text-muted-foreground">
                Miscellaneous
              </p>

              <p className="mt-1 text-lg font-semibold">
                {plan.budget.currency}{" "}
                {plan.budget.miscellaneous.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips Section  */}
      <div className="mt-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
            <Lightbulb className="h-5 w-5 text-amber-600" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Travel Tips</h3>

            <p className="text-sm text-muted-foreground">
              Helpful things to know before you go
            </p>
          </div>
        </div>

        <Card className="mt-6 border-amber-100 bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {plan.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg bg-amber-50/60 p-4"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                  </div>

                  <p className="text-sm leading-6 text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
