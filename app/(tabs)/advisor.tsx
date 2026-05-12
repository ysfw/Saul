import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { themeColor } from "./theme";
import { styles } from "./advisor.styles";

const API_BASE_URL = "https://pacifism-gallstone-recliner.ngrok-free.dev";

export default function AdvisorScreen() {
  const params = useLocalSearchParams<{ major: string }>();
  const major = params.major || "computer_and_systems";
  const router = useRouter();

  // --- 1. STATE MANAGEMENT ---
  // Store form inputs (topics, courses) and UI states (loading, errors, results).
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

  // --- 2. HELPER FUNCTIONS ---
  // Format individual string for backend compatibility (lowercase, replace spaces with underscores)
  const formatString = (str: string) => {
    return str.trim().toLowerCase().replace(/\s+/g, "_");
  };

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

  // --- 3. DATA FETCHING (ON MOUNT) ---
  // Fetches available courses/topics when the major changes.
  // It also completely resets the form state so old selections don't bleed over.
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [coursesResp, topicsResp] = await Promise.all([
          fetch(`${API_BASE_URL}/api/courses/?major=${major}`, {
            headers: { "ngrok-skip-browser-warning": "true" }
          }),
          fetch(`${API_BASE_URL}/api/topics/?major=${major}`, {
            headers: { "ngrok-skip-browser-warning": "true" }
          })
        ]);

        if (coursesResp.ok) {
          const coursesData = await coursesResp.json();
          setAvailableCourses(coursesData.map((c: string) => formatString(c)));
        } else {
          setAvailableCourses([]);
        }

        if (topicsResp.ok) {
          const topicsData = await topicsResp.json();
          setAvailableTopics(topicsData.map((t: string) => formatString(t)));
        } else {
          setAvailableTopics([]);
        }

        // clear selections when major changes
        setLikedTopics([]);
        setCompletedCourses([]);
        setRecommendations(null);
        setRecommendationsType(null);
        setPrologFilterMessage(null);
        setError(null);
        setPreferredDifficulty("");
      } catch (e) {
        console.error("Failed to load options for major", e);
      }
    };

    loadOptions();
  }, [major]);

  // --- 4. API SUBMISSION ---
  // Validates user input synchronously, then sends a POST request to either Prolog or AI backend.
  const handleFetchRecommendations = async (type: "prolog" | "ai") => {
    setLoading(true);
    setRecommendations(null);
    setError(null);

    const parsedLikedTopics = likedTopics.map(formatString);
    const parsedCompletedCourses = completedCourses.map(formatString);

    if (type === "prolog") {
      // Validate completed courses using locally fetched available courses
      const parsedCourses = availableCourses.map(formatString);
      const invalidCourses = parsedCompletedCourses.filter(
        (c) => !parsedCourses.includes(c),
      );

      if (invalidCourses.length > 0) {
        setError(
          `The following completed courses are missing from the ${major} major: ${invalidCourses.join(", ")}`,
        );
        setLoading(false);
        return;
      }
      setRecommendationsType("Prolog");
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

    const url = type === "prolog"
      ? `${API_BASE_URL}/api/recommend/prolog/`
      : `${API_BASE_URL}/api/recommend/ai/`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true"
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

  // --- 5. RESULT RENDERING ---
  // Parses the backend response and renders either styled course cards or a text block for advice.
  const renderRecommendations = () => {
    if (!recommendations) return null;

    // If the response is an array of strings (Prolog) or objects (AI), render each recommendation as a card
    if (Array.isArray(recommendations)) {
      return (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsTitleContainer}>
            <Ionicons name="list" size={28} color={themeColor} style={styles.resultsTitleIcon} />
            <Text style={styles.resultsTitleNoMargin}>
              {recommendationsType} Recommendations:
            </Text>
          </View>
          {prologFilterMessage ? (
            <Text style={styles.filterMessageText}>
              Note: {prologFilterMessage}
            </Text>
          ) : null}
          {recommendations.length > 0 ? (
            recommendations.map((rec: any, index: number) => {
              if (typeof rec === "object" && rec !== null) {
                return (
                  <View key={index} style={styles.recommendationCard}>
                    <View style={styles.cardContent}>
                      <View style={styles.cardIconContainer}>
                        <Ionicons name="ribbon" size={24} color={themeColor} />
                      </View>
                      <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>{rec.course_name}</Text>
                        <View style={styles.cardDifficultyRow}>
                          <Ionicons name="speedometer-outline" size={16} color="#A0A0A0" style={styles.difficultySpeedometerIcon} />
                          <View style={[styles.cardDifficultyDot, {
                            backgroundColor: rec.difficulty?.toLowerCase() === 'easy' ? '#4ADE80' :
                              rec.difficulty?.toLowerCase() === 'medium' ? '#FACC15' :
                                rec.difficulty?.toLowerCase() === 'hard' ? '#F87171' : '#A0A0A0'
                          }]} />
                          <Text style={styles.cardDifficulty}>{rec.difficulty ? rec.difficulty.charAt(0).toUpperCase() + rec.difficulty.slice(1) : 'Unknown'}</Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="star" size={24} color={themeColor} />
                  </View>
                );
              }
              // Handle string Prolog Response Format (fallback if needed)
              return (
                <View key={index} style={styles.recommendationCard}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardIconContainer}>
                      <Ionicons name="ribbon" size={24} color={themeColor} />
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle}>{rec}</Text>
                    </View>
                  </View>
                  <Ionicons name="star" size={24} color={themeColor} />
                </View>
              );
            })
          ) : (
            <Text style={styles.resultText}>No recommendations found.</Text>
          )}
        </View>
      );
    } // If the response is a single string, render it as a block of text
    // else if (typeof recommendations === "string") {
    //   return (
    //     <View style={styles.resultsContainer}>
    //       <View style={styles.resultsTitleContainer}>
    //         <Ionicons name="sparkles" size={28} color={themeColor} style={styles.resultsTitleIcon} />
    //         <Text style={styles.resultsTitleNoMargin}>Expected Advice:</Text>
    //       </View>
    //       <View style={styles.aiRecommendationCard}>
    //         <View style={styles.aiInsightHeader}>
    //           <Ionicons name="chatbubbles" size={24} color={themeColor} style={styles.aiInsightIcon} />
    //           <Text style={styles.aiInsightTitle}>AI Insight</Text>
    //         </View>
    //         <Text style={styles.recommendationText}>{recommendations}</Text>
    //       </View>
    //     </View>
    //   );
    // }

    return null;
  };

  // --- 6. MAIN UI COMPONENT ---
  // Renders the form inputs, action buttons, and handles keyboard behaviors on mobile.
  return (
    // KeyboardAvoidingView ensures that the form is not hidden by the keyboard on mobile devices
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* ScrollView allows the content to be scrollable, especially when the keyboard is open or on smaller screens */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header and Subheader for the app */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.header} adjustsFontSizeToFit={true} numberOfLines={1}>BETTER CALL SAUL</Text>
        </View>
        <Text style={styles.subHeader}>Need academic advice? Let Saul handle your case - powered by Prolog logic or AI counsel.</Text>

        {/* --- MAJOR HEADER --- */}
        {/* Displays the currently selected major passed from the index screen */}
        <View style={styles.labelContainer}>
          <Ionicons name="school" size={24} color={themeColor} style={styles.labelIcon} />
          <Text style={styles.label}>Selected Major</Text>
        </View>
        <Text style={styles.majorTitle}>
          {major.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </Text>
        {/* --- LIKED TOPICS CHIPS --- */}
        {/* Renders interactive chips that let the user toggle their favorite subjects */}
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="heart" size={24} color={themeColor} style={styles.labelIcon} />
            <Text style={styles.label}>Liked Topics</Text>
          </View>
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
                  <Text style={[
                    styles.optionText,
                    likedTopics.includes(t) ? styles.optionTextSelected : null
                  ]}>{t.replace(/_/g, " ")}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* --- COMPLETED COURSES CHIPS --- */}
        {/* Renders interactive chips for courses the user has already passed */}
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="checkmark-circle" size={24} color={themeColor} style={styles.labelIcon} />
            <Text style={styles.label}>Completed Courses</Text>
          </View>
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
                  <Text style={[
                    styles.optionText,
                    completedCourses.includes(c) ? styles.optionTextSelected : null
                  ]}>{c.replace(/_/g, " ")}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        {/* --- DIFFICULTY SELECTOR --- */}
        {/* Separate buttons with dynamic colored dots to pick a difficulty level */}
        <View style={styles.formGroup}>
          <View style={styles.labelContainer}>
            <Ionicons name="speedometer" size={24} color={themeColor} style={styles.labelIcon} />
            <Text style={styles.label}>Preferred Difficulty (optional)</Text>
          </View>
          <View style={styles.difficultyContainer}>
            {['easy', 'medium', 'hard'].map((level) => {
              const dotColor = level === 'easy' ? '#4ADE80' : level === 'medium' ? '#FACC15' : '#F87171';
              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    preferredDifficulty === level && styles.difficultyButtonActive
                  ]}
                  onPress={() => setPreferredDifficulty(preferredDifficulty === level ? "" : level)}
                >
                  <View style={[styles.difficultyDot, { backgroundColor: dotColor }]} />
                  <Text style={[
                    styles.difficultyButtonText,
                    preferredDifficulty === level && styles.difficultyButtonTextActive
                  ]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Action Buttons for fetching recommendations */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => handleFetchRecommendations("prolog")}
            disabled={loading}
          >
            <Ionicons name="flash" size={24} color="#000000" />
            <Text style={styles.primaryButtonText}>Get Prolog Recommendations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handleFetchRecommendations("ai")}
            disabled={loading}
          >
            <Ionicons name="hardware-chip" size={24} color={themeColor} />
            <Text style={styles.secondaryButtonText}>Get AI Recommendations</Text>
          </TouchableOpacity>
        </View>

        {/* Conditional rendering for loading state, error messages, and recommendations results */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColor} />
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
