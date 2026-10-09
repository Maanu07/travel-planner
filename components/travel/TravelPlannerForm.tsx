import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalendarDays,
  Check,
  IndianRupee,
  Loader2,
  MapPin,
  Wallet,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { travelPlanRequestSchema } from "@/lib/ai/schema";

const interests = [
  "Nature",
  "Food",
  "Culture",
  "Adventure",
  "Beaches",
  "Shopping",
  "History",
  "Nightlife",
];

const travelStyles = ["Relaxed", "Balanced", "Packed"];

export type TravelPlannerFormValues = z.infer<typeof travelPlanRequestSchema>;

type TravePlannerFormProps = {
  isLoading: boolean;
  error: string | null;
  status: string;
  onSubmit: (values: TravelPlannerFormValues) => Promise<boolean>;
};

export function TravelPlannerForm({
  isLoading,
  error,
  status,
  onSubmit,
}: TravePlannerFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TravelPlannerFormValues>({
    resolver: zodResolver(travelPlanRequestSchema),
    defaultValues: {
      destination: "",
      duration: 1,
      budget: "",
      interests: ["Nature", "Food"],
      travelStyle: "Relaxed",
    },
  });

  const selectedInterests = watch("interests");
  const selectedTravelStyle = watch("travelStyle");

  const handleFormSubmit = async (values: TravelPlannerFormValues) => {
    try {
      const success = await onSubmit(values);

      // Successful submission → make these values the new baseline
      if (success) {
        reset(values);
      }
    } catch {
      // Don't reset the form if submission failed
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
      <div>
        <Label htmlFor="destination">Where do you want to go?</Label>
        <div className="relative">
          <MapPin
            className="absolute left-3.5 top-3.5 text-slate-400"
            size={18}
          />
          <Input
            id="destination"
            placeholder="e.g. Bali, Vietnam, Kashmir"
            className="pl-10"
            {...register("destination")}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="budget">Budget per person</Label>
          <div className="relative">
            <IndianRupee
              className="absolute left-3.5 top-3.5 text-slate-400"
              size={17}
            />
            <Input
              id="budget"
              type="number"
              min="1"
              placeholder="50,000"
              className="pl-10"
              {...register("budget")}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Include flights, stay & activities
          </p>
        </div>
        <div>
          <Label htmlFor="duration">Trip duration</Label>
          <div className="relative">
            <CalendarDays
              className="absolute left-3.5 top-3.5 text-slate-400"
              size={17}
            />
            <Input
              id="duration"
              type="number"
              min="1"
              max="60"
              placeholder="5"
              className="pl-10 pr-16"
              {...register("duration", {
                valueAsNumber: true,
              })}
            />
            <span className="absolute right-3.5 top-3 text-sm text-slate-400">
              days
            </span>
          </div>
        </div>
      </div>

      <div>
        <Label>What are you into?</Label>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest) => {
            const active = selectedInterests.includes(interest);
            return (
              <button
                type="button"
                key={interest}
                onClick={() => {
                  const updatedInterests = active
                    ? selectedInterests.filter((item) => item !== interest)
                    : [...selectedInterests, interest];

                  setValue("interests", updatedInterests, {
                    shouldValidate: true,
                  });
                }}
                className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {active && <Check size={14} className="mr-1.5 inline" />}

                {interest}
              </button>
            );
          })}
        </div>
        {errors.interests && (
          <p className="mt-2 text-sm text-red-400">
            {errors.interests.message}
          </p>
        )}
      </div>

      <div>
        <Label>How do you like to travel?</Label>

        <div className="mt-2 flex flex-wrap gap-2">
          {travelStyles.map((style) => {
            const active = selectedTravelStyle === style;

            return (
              <button
                type="button"
                key={style}
                onClick={() => {
                  setValue("travelStyle", style, {
                    shouldValidate: true,
                  });
                }}
                className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {active && <Check size={14} className="mr-1.5 inline" />}

                {style}
              </button>
            );
          })}
        </div>

        {errors.travelStyle && (
          <p className="mt-2 text-sm text-red-400">
            {errors.travelStyle.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <Wallet size={18} className="mt-0.5 shrink-0 text-blue-600" />
        <div>
          <p className="font-semibold text-slate-800">
            We&apos;ll keep your budget in mind
          </p>
          <p className="mt-0.5 text-xs leading-5">
            Your final plan will include a transparent budget breakdown so you
            know where your money goes.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isLoading || isSubmitting || !isDirty}
        className="w-full"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

        {isLoading ? status : "Plan My Trip"}
      </Button>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
