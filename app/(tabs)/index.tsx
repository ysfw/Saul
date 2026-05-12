import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./index.styles";

const API_IP = "192.168.1.2"; // Replaced with your actual local IP address

const MAJORS: string[] = [
  "computer_and_systems",
  "physical_education",
  "education",
  "tourism",
  "veterinary",
  "nursing",
  "pharmacy",
  "science",
  "fine_arts",
  "agriculture",
  "law",
  "dentistry",
  "medicine",
  "business",
  "textiles",
  "architectural",
  "nuclear_and_radiation",
  "naval_architecture",
  "production",
  "chemical",
  "mechanical",
  "civil",
  "electrical_power_and_machines",
  "electronics_and_communications",
];

export default function HomeScreen() {
  // State variables for form inputs
  const [major, setMajor] = useState(MAJORS[0]);
  const [likedTopics, setLikedTopics] = useState<string[]>([]);
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [preferredDifficulty, setPreferredDifficulty] = useState("");

  // Available options based on selected major
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [prologFilterMessage, setPrologFilterMessage] = useState<string | null>(
    null,
  );

  // State variables for fetching status, results, and errors
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<
    string[] | string | null
  >(null);
  const [recommendationsType, setRecommendationsType] = useState<
    "Prolog" | "AI" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  // Format individual string: lowercase, replace spaces with underscores, trim whitespace
  const formatString = (str: string) => {
    return str.trim().toLowerCase().replace(/\s+/g, "_");
  };

  // Helper to convert comma-separated strings into an array of formatted items
  const parseInput = (input: string) => {
    if (!input.trim()) return [];
    return input
      .split(",")
      .map((item: string) => formatString(item))
      .filter(Boolean);
  };

  // Handles the API request based on the selected recommendation type (Prolog/AI)
  const handleFetchRecommendations = async (type: "prolog" | "ai") => {
    setLoading(true);
    setRecommendations(null);
    setError(null);

    const parsedLikedTopics = likedTopics.map(formatString);
    const parsedCompletedCourses = completedCourses.map(formatString);

    // If Prolog, fetch courses for the selected major first, then validate
    if (type === "prolog") {
      try {
        const getResponse = await fetch(
          `http://${API_IP}:8000/api/courses/?major=${major}`,
        );
        if (getResponse.ok) {
          const data = await getResponse.json();
          if (Array.isArray(data)) {
            const parsedCourses = data.map((c: string) => formatString(c));

            const invalidCourses = [...parsedCompletedCourses].filter(
              (c) => !parsedCourses.includes(c),
            );

            if (invalidCourses.length > 0) {
              setError(
                `The following completed courses are missing from the ${major} major: ${invalidCourses.join(", ")}`,
              );
              setLoading(false);
              return;
            }
          }
        }
        setRecommendationsType("Prolog");
      } catch (err) {
        console.error("Failed to fetch courses for validation:", err);
        // Depending on requirements, we can continue or return here. We'll proceed if DB check fails.
      }
    } else {
      setRecommendationsType("AI");
    }

    // Request body
    const payload: any = {
      major: major,
      liked_topics: parsedLikedTopics,
      completed_courses: parsedCompletedCourses,
    };

    if (preferredDifficulty && preferredDifficulty.trim()) {
      payload.preferred_difficulty = preferredDifficulty.trim().toLowerCase();
    }

    const endpoint =
      type === "prolog"
        ? `http://${API_IP}:8000/api/recommend/prolog/`
        : `http://${API_IP}:8000/api/recommend/ai/`;

    // send POST request to the appropriate endpoint and handle the response
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response:", data);
      // If Prolog returns structured result, capture filter message
      if (type === "prolog" && data.filter_message) {
        setPrologFilterMessage(data.filter_message);
      } else {
        setPrologFilterMessage(null);
      }
      setRecommendations(data.recommendations);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || "Something went wrong while fetching.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamically renders the list of strings (Prolog) or single text block (AI) based on the response type
  const renderRecommendations = () => {
    if (!recommendations) return null;

    // If the response is an array of strings (Prolog) or objects (AI), render each recommendation as a card
    if (Array.isArray(recommendations)) {
      return (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>
            {recommendationsType} Recommendations:
          </Text>
          {prologFilterMessage ? (
            <Text style={[styles.resultText, { marginBottom: 16 }]}>
              Note: {prologFilterMessage}
            </Text>
          ) : null}
          {recommendations.length > 0 ? (
            recommendations.map((rec: any, index: number) => {
              // Handle AI Object Response Format
              if (typeof rec === "object" && rec !== null) {
                return (
                  <View key={index} style={styles.recommendationCard}>
                    <Text style={styles.recommendationText}>
                      • {rec.course_name} (Difficulty: {rec.difficulty})
                    </Text>
                  </View>
                );
              }
            })
          ) : (
            <Text style={styles.resultText}>No recommendations found.</Text>
          )}
        </View>
      );
    } // If the response is a single string, render it as a block of text
    else if (typeof recommendations === "string") {
      return (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Expected Advice:</Text>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationText}>{recommendations}</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  // Fetch available courses and topics for the selected major
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const coursesResp = await fetch(
          `http://${API_IP}:8000/api/courses/?major=${major}`,
        );
        if (coursesResp.ok) {
          const coursesData = await coursesResp.json();
          setAvailableCourses(coursesData.map((c: string) => formatString(c)));
        } else {
          setAvailableCourses([]);
        }

        const topicsResp = await fetch(
          `http://${API_IP}:8000/api/topics/?major=${major}`,
        );
        if (topicsResp.ok) {
          const topicsData = await topicsResp.json();
          setAvailableTopics(topicsData.map((t: string) => formatString(t)));
        } else {
          setAvailableTopics([]);
        }
        // clear selections when major changes
        setLikedTopics([]);
        setCompletedCourses([]);
      } catch (e) {
        console.error("Failed to load options for major", e);
      }
    };

    loadOptions();
  }, [major]);

  const toggleSelection = (
    value: string,
    list: string[],
    setter: (v: string[]) => void,
  ) => {
    const normalized = formatString(value);
    if (list.includes(normalized)) {
      setter(list.filter((i) => i !== normalized));
    } else {
      setter([...list, normalized]);
    }
  };

  // Main UI render code (Form inputs, Action Buttons, States, and Results container)
  return (
    // KeyboardAvoidingView ensures that the form is not hidden by the keyboard on mobile devices
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ScrollView allows the content to be scrollable, especially when the keyboard is open or on smaller screens */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header and Subheader for the app */}
        <Text style={styles.header}>Smart Study Advisor</Text>
        <Text style={styles.subHeader}>Find your next path</Text>

        {/* Form inputs for user data */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Major</Text>
          <View style={[styles.input, styles.pickerContainer]}>
            <Picker
              selectedValue={major}
              onValueChange={(itemValue) => setMajor(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
            >
              {MAJORS.map((m) => (
                <Picker.Item
                  key={m}
                  label={m
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  value={m}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Liked Topics</Text>
          <View style={styles.optionsContainer}>
            {availableTopics.length === 0 ? (
              <Text style={styles.helpText}>
                No topics available for this major.
              </Text>
            ) : (
              availableTopics.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.optionItem,
                    likedTopics.includes(t) ? styles.optionSelected : null,
                  ]}
                  onPress={() =>
                    toggleSelection(t, likedTopics, setLikedTopics)
                  }
                >
                  <Text style={styles.optionText}>{t.replace(/_/g, " ")}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Completed Courses</Text>
          <View style={styles.optionsContainer}>
            {availableCourses.length === 0 ? (
              <Text style={styles.helpText}>
                No courses available for this major.
              </Text>
            ) : (
              availableCourses.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.optionItem,
                    completedCourses.includes(c) ? styles.optionSelected : null,
                  ]}
                  onPress={() =>
                    toggleSelection(c, completedCourses, setCompletedCourses)
                  }
                >
                  <Text style={styles.optionText}>{c.replace(/_/g, " ")}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Preferred Difficulty (optional)</Text>
          <View style={[styles.input, styles.pickerContainer]}>
            <Picker
              selectedValue={preferredDifficulty}
              onValueChange={(itemValue) => setPreferredDifficulty(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="No preference" value="" />
              <Picker.Item label="Easy" value="easy" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="Hard" value="hard" />
            </Picker>
          </View>
        </View>

        {/* Action Buttons for fetching recommendations */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => handleFetchRecommendations("prolog")}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get Prolog Recommendations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handleFetchRecommendations("ai")}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get AI Recommendations</Text>
          </TouchableOpacity>
        </View>

        {/* Conditional rendering for loading state, error messages, and recommendations results */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4DA8DA" />
            <Text style={styles.loadingText}>Fetching recommendations...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {renderRecommendations()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
