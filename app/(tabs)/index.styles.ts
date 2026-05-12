import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: "#A0A0A0",
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#E0E0E0",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    padding: 14,
    color: "#FFFFFF",
    fontSize: 16,
  },
  pickerContainer: {
    padding: Platform.OS === "web" ? 0 : Platform.OS === "ios" ? 0 : -8,
  },
  picker: {
    color: "#FFFFFF",
    backgroundColor: Platform.OS === "web" ? "#1E1E1E" : "transparent",
    borderWidth: 0,
    ...(Platform.OS === "web" && ({ padding: 14, outlineWidth: 0 } as any)),
  },
  pickerItem: {
    backgroundColor: "#1E1E1E",
    color: "#FFFFFF",
  },
  buttonContainer: {
    marginTop: 10,
    gap: 12,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#2D3748",
    borderWidth: 1,
    borderColor: "#4A5568",
  },
  secondaryButton: {
    backgroundColor: "#1A202C",
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  loadingText: {
    color: "#A0A0A0",
    marginTop: 12,
  },
  errorContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#3b1c1c",
    borderRadius: 8,
  },
  errorText: {
    color: "#ff6b6b",
    fontWeight: "500",
  },
  resultsContainer: {
    marginTop: 32,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  recommendationCard: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4DA8DA",
  },
  recommendationText: {
    color: "#E0E0E0",
    fontSize: 16,
    lineHeight: 24,
  },
  resultText: {
    color: "#A0A0A0",
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    marginRight: 8,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: "#274C5E",
    borderColor: "#4DA8DA",
  },
  optionText: {
    color: "#E0E0E0",
    fontSize: 14,
  },
  helpText: {
    color: "#909090",
    fontSize: 14,
  },
});
