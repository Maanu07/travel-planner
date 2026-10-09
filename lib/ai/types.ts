export interface TravelPlan {
  overview: string;

  itinerary: {
    day: number;
    title: string;
    activities: string[];
  }[];

  attractions: {
    name: string;
    description: string;
  }[];

  budget: {
    accommodation: number;
    food: number;
    transportation: number;
    activities: number;
    miscellaneous: number;
    total: number;
    currency: string;
  };

  tips: string[];
}
