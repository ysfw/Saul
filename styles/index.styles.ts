import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    padding: 24,
    paddingTop: 80,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    alignItems: "center",
  },
  headerBriefcaseIcon: {
    marginBottom: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.primary,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subHeader: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  majorCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  majorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryAlpha10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  majorText: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: "600",
    flex: 1,
    flexWrap: "wrap",
    paddingRight: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: 16,
    fontSize: 18,
  },
  errorContainer: {
    alignItems: "center",
    marginBottom: 20,
    padding: 16,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff6b6b",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  retryText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});
