import { Picker } from '@react-native-picker/picker';
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

const API_IP = '192.168.1.7'; // Replaced with your actual local IP address

const MAJORS: string[] = [
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
  "electronics_and_communications"
];

export default function HomeScreen() {
  // State variables for form inputs
  const [major, setMajor] = useState(MAJORS[0]);
  const [likedCourses, setLikedCourses] = useState('');
  const [completedCourses, setCompletedCourses] = useState('');
  const [preferredDifficulty, setPreferredDifficulty] = useState('medium');
  
  // State variables for fetching status, results, and errors
  const [dbCourses, setDbCourses] = useState<string[]>([]);
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

    const parsedLikedCourses = parseInput(likedCourses);
    const parsedCompletedCourses = parseInput(completedCourses);

    // If Prolog, fetch courses for the selected major first, then validate
    if (type === 'prolog') {
      try {
        const getResponse = await fetch(`http://${API_IP}:8000/api/courses/?major=${major}`);
        if (getResponse.ok) {
          const data = await getResponse.json();
          if (Array.isArray(data)) {
            const parsedCourses = data.map((c: string) => formatString(c));
            
            const invalidCourses = [...parsedLikedCourses, ...parsedCompletedCourses].filter(
              c => !parsedCourses.includes(c)
            );

            if (invalidCourses.length > 0) {
              setError(`The following courses are missing from the ${major} major: ${invalidCourses.join(', ')}`);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch courses for validation:', err);
        // Depending on requirements, we can continue or return here. We'll proceed if DB check fails.
      }
    }

    // Request body
    const payload = {
      major: major, // Major is already from the predefined list
      liked_courses: parsedLikedCourses,
      completed_courses: parsedCompletedCourses,
      preferred_difficulty: preferredDifficulty.trim().toLowerCase(),
    };

    const endpoint =
      type === 'prolog'
        ? `http://${API_IP}:8000/api/recommend/prolog/`
        : `http://${API_IP}:8000/api/recommend/ai/`;


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

    // If the response is an array of strings (Prolog) or objects (AI), render each recommendation as a card
    if (Array.isArray(recommendations)) {
      return (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Recommendations:</Text>
          {recommendations.length > 0 ? (
            recommendations.map((rec: any, index: number) => {
              // Handle AI Object Response Format
              if (typeof rec === 'object' && rec !== null) {
                return (
                  <View key={index} style={styles.recommendationCard}>
                    <Text style={styles.recommendationText}>• {rec.course_name} (Difficulty: {rec.difficulty})</Text>
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
                  label={m.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} 
                  value={m} 
                  style={styles.pickerItem} 
                />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Liked Courses (comma-separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. math_1, intro_to_programming"
            placeholderTextColor="#888"
            value={likedCourses}
            onChangeText={setLikedCourses}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Completed Courses (comma-separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. intro_to_cs, physics_1"
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
