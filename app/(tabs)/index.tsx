import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './index.styles';

const API_IP = '192.168.1.100'; // Replace with your computer's local IP address

export default function HomeScreen() {
  // State variables for form inputs
  const [major, setMajor] = useState('');
  const [likedCourses, setLikedCourses] = useState('');
  const [completedCourses, setCompletedCourses] = useState('');
  const [preferredDifficulty, setPreferredDifficulty] = useState('medium');
  
  // State variables for fetching status, results, and errors
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[] | string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Format individual string: lowercase, replace spaces with underscores, trim whitespace
  const formatString = (str: string) => {
    return str.trim().toLowerCase().replace(/\s+/g, '_');
  };

  // Helper to convert comma-separated strings into an array of formatted items
  const parseInput = (input: string) => {
    if (!input.trim()) return [];
    return input.split(',').map((item: string) => formatString(item)).filter(Boolean);
  };

  // Handles the API request based on the selected recommendation type (Prolog/AI)
  const handleFetchRecommendations = async (type: 'prolog' | 'ai') => {
    setLoading(true);
    setRecommendations(null);
    setError(null);

    // Request body
    const payload = {
      major: formatString(major),
      liked_courses: parseInput(likedCourses),
      completed_courses: parseInput(completedCourses),
      preferred_difficulty: preferredDifficulty.trim().toLowerCase(),
    };

    const endpoint =
      type === 'prolog'
        ? `http://${API_IP}:8000/api/recommend/prolog/`
        : `http://${API_IP}:8000/api/recommend/ai/`;

    // // Simulated hardcoded response (COMMENT THIS OUT LATER)
    // setTimeout(() => {
    //   if (type === 'prolog') {
    //     // Hardcoded example for Prolog (Array of strings)
    //     setRecommendations([
    //       'CS301: Introduction to Artificial Intelligence',
    //       'CS302: Software Engineering Basics',
    //       'CS405: Advanced Algorithms'
    //     ]);
    //   } else {
    //     // Hardcoded example for AI (String of text)
    //     setRecommendations(
    //       'Based on your liked courses and preferred "medium" difficulty, I highly recommend looking into the Software Engineering or Intro to AI tracks. They perfectly align with your background!'
    //     );
    //   }
    //   setLoading(false);
    // }, 1500);

    // send POST request to the appropriate endpoint and handle the response
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received response:', data);
      setRecommendations(data.recommendations);
    } catch (err: any) {
      console.error('Fetch Error:', err);
      setError(err.message || 'Something went wrong while fetching.');
    } finally {
      setLoading(false);
    }
  };

  // Dynamically renders the list of strings (Prolog) or single text block (AI) based on the response type
  const renderRecommendations = () => {
    if (!recommendations) return null;

    // If the response is an array of strings (Prolog), render each recommendation as a bullet point
    if (Array.isArray(recommendations)) {
      return (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Recommendations:</Text>
          {recommendations.length > 0 ? (
            recommendations.map((rec: string, index: number) => (
              <View key={index} style={styles.recommendationCard}>
                <Text style={styles.recommendationText}>• {rec}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.resultText}>No recommendations found.</Text>
          )}
        </View>
      );
    } // If the response is a single string (AI), render it as a block of text
    else if (typeof recommendations === 'string') {
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

  // Main UI render code (Form inputs, Action Buttons, States, and Results container) 
  return (
    // KeyboardAvoidingView ensures that the form is not hidden by the keyboard on mobile devices
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ScrollView allows the content to be scrollable, especially when the keyboard is open or on smaller screens */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header and Subheader for the app */}
        <Text style={styles.header}>Smart Study Advisor</Text>
        <Text style={styles.subHeader}>Find your next path</Text>

        {/* Form inputs for user data */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Major</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Computer Science"
            placeholderTextColor="#888"
            value={major}
            onChangeText={setMajor}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Liked Courses (comma-separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. CS101, Math202"
            placeholderTextColor="#888"
            value={likedCourses}
            onChangeText={setLikedCourses}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Completed Courses (comma-separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Intro to CS, Physics 1"
            placeholderTextColor="#888"
            value={completedCourses}
            onChangeText={setCompletedCourses}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Preferred Difficulty</Text>
          <TextInput
            style={styles.input}
            placeholder="easy, medium, hard"
            placeholderTextColor="#888"
            value={preferredDifficulty}
            onChangeText={setPreferredDifficulty}
          />
        </View>

        {/* Action Buttons for fetching recommendations */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => handleFetchRecommendations('prolog')}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get Prolog Recommendations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handleFetchRecommendations('ai')}
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
