import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import type { TravelPlan } from "@/lib/ai/types";

type TravelPlanPDFProps = {
  plan: TravelPlan;
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },

  overview: {
    lineHeight: 1.5,
  },

  day: {
    marginBottom: 14,
  },

  dayTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
  },

  activity: {
    marginBottom: 4,
  },
});

export function TravelPlanPDF({ plan }: TravelPlanPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Your Travel Plan</Text>

        <Text style={styles.overview}>{plan.overview}</Text>

        <Text style={styles.sectionTitle}>Itinerary</Text>

        {plan.itinerary.map((day) => (
          <View key={day.day} style={styles.day}>
            <Text style={styles.dayTitle}>
              Day {day.day}: {day.title}
            </Text>

            {day.activities.map((activity, index) => (
              <Text key={index} style={styles.activity}>
                • {activity}
              </Text>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
