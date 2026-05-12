import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import { Colors, Spacing, Radius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const MAJORS: string[] = [
  'computer_and_systems',
  'physical_education',
  'education',
  'tourism',
  'veterinary',
  'nursing',
  'pharmacy',
  'science',
  'fine_arts',
  'agriculture',
  'law',
  'dentistry',
  'medicine',
  'business',
  'textiles',
  'architectural',
  'nuclear_and_radiation',
  'naval_architecture',
  'production',
  'chemical',
  'mechanical',
  'civil',
  'electrical_power_and_machines',
  'electronics_and_communications',
];

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

function formatMajor(m: string): string {
  return m.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getDifficultyColor(d: string): string {
  switch (d) {
    case 'easy': return Colors.diffEasy;
    case 'medium': return Colors.diffMedium;
    case 'hard': return Colors.diffHard;
    default: return Colors.textMuted;
  }
}

function getDifficultyLabel(d: string): string {
  switch (d) {
    case 'easy': return '🟢 Easy';
    case 'medium': return '🟡 Medium';
    case 'hard': return '🔴 Hard';
    default: return d;
  }
}

export default function HomeScreen() {
  const { token, user, logout } = useAuth();
  const router = useRouter();

  // Form state
  const [major, setMajor] = useState(user?.major || MAJORS[0]);
  const [likedTopics, setLikedTopics] = useState('');
  const [completedCourses, setCompletedCourses] = useState('');
  const [preferredDifficulty, setPreferredDifficulty] = useState<string>('medium');
  const [useProfileCourses, setUseProfileCourses] = useState(!!token);

  // Results
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[] | string | null>(null);
  const [recommendationsType, setRecommendationsType] = useState<'Prolog' | 'AI' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const resultsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (user?.major) setMajor(user.major);
  }, [user?.major]);

  useEffect(() => {
    if (recommendations) {
      resultsAnim.setValue(0);
      Animated.timing(resultsAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [recommendations]);

  const formatString = (str: string) => str.trim().toLowerCase().replace(/\s+/g, '_');
  const parseInput = (input: string) => {
    if (!input.trim()) return [];
    return input.split(',').map(formatString).filter(Boolean);
  };

  const handleRecommend = async (type: 'prolog' | 'ai') => {
    setLoading(true);
    setRecommendations(null);
    setError(null);

    const parsedTopics = parseInput(likedTopics);
    const parsedCompleted = useProfileCourses && token ? undefined : parseInput(completedCourses);

    const payload: any = {
      major,
      liked_topics: parsedTopics,
      preferred_difficulty: preferredDifficulty,
    };

    if (parsedCompleted !== undefined) {
      payload.completed_courses = parsedCompleted;
    }

    // Client-side validation for Prolog (guest mode only)
    if (type === 'prolog' && parsedCompleted) {
      try {
        const courses = await api.getCourses(major);
        const courseNames = courses.map(c => formatString(c.name));
        const invalid = parsedCompleted.filter(c => !courseNames.includes(c));
        if (invalid.length > 0) {
          setError(`Objection! These courses aren't in ${formatMajor(major)}: ${invalid.join(', ')}`);
          setLoading(false);
          return;
        }
      } catch {
        // Continue if validation fails
      }
    }

    setRecommendationsType(type === 'prolog' ? 'Prolog' : 'AI');

    try {
      const data = await api.getRecommendations(type, payload, token);
      setRecommendations(data.recommendations);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderRecommendations = () => {
    if (!recommendations) return null;

    if (Array.isArray(recommendations)) {
      return (
        <Animated.View
          style={[
            styles.resultsSection,
            {
              opacity: resultsAnim,
              transform: [{ translateY: resultsAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            },
          ]}
        >
          <View style={styles.resultsHeader}>
            <View style={styles.verdictBar} />
            <View style={styles.resultsHeaderText}>
              <Text style={styles.resultsTitle}>
                {recommendationsType === 'Prolog' ? '⚖️ Saul\'s Verdict' : '🤖 AI Counsel'}
              </Text>
              <Text style={styles.resultsCount}>
                {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {recommendations.length > 0 ? (
            recommendations.map((rec: any, index: number) => {
              if (typeof rec === 'object' && rec !== null) {
                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.recCard,
                      {
                        opacity: resultsAnim,
                        transform: [{
                          translateX: resultsAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [40, 0],
                          }),
                        }],
                      },
                    ]}
                  >
                    <View style={[styles.recDot, { backgroundColor: getDifficultyColor(rec.difficulty) }]} />
                    <View style={styles.recCardContent}>
                      <Text style={styles.recName}>
                        {(rec.course_name || '').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      </Text>
                      <View style={styles.recMeta}>
                        <View style={[styles.diffBadge, { backgroundColor: getDifficultyColor(rec.difficulty) + '20' }]}>
                          <Text style={[styles.diffBadgeText, { color: getDifficultyColor(rec.difficulty) }]}>
                            {rec.difficulty}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.recCardIndex}>
                      <Text style={styles.recIndexText}>§{index + 1}</Text>
                    </View>
                  </Animated.View>
                );
              }
              return (
                <View key={index} style={styles.recCard}>
                  <View style={styles.recCardContent}>
                    <Text style={styles.recName}>{String(rec)}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyResults}>
              <Text style={styles.emptyIcon}>📂</Text>
              <Text style={styles.emptyResultsText}>Case dismissed — no courses found</Text>
              <Text style={styles.emptyResultsSub}>Try adjusting your preferences, counselor</Text>
            </View>
          )}
        </Animated.View>
      );
    }

    if (typeof recommendations === 'string') {
      return (
        <Animated.View style={[styles.resultsSection, { opacity: resultsAnim }]}>
          <Text style={styles.resultsTitle}>📜 The Ruling</Text>
          <View style={styles.recCard}>
            <View style={styles.recCardContent}>
              <Text style={styles.recName}>{recommendations}</Text>
            </View>
          </View>
        </Animated.View>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: fadeAnim }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {token ? `Client: ${user?.username}` : 'Walk-in Consultation'}
          </Text>
          <Text style={styles.headerTitle}>Better Call Saul</Text>
          <Text style={styles.headerSub}>
            Need academic advice? Let Saul handle your case — powered by Prolog logic or AI counsel.
          </Text>
          {!token && (
            <TouchableOpacity
              style={styles.guestExitButton}
              onPress={() => {
                logout();
                router.replace('/(auth)/login' as any);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="log-in-outline" size={16} color={Colors.accent} />
              <Text style={styles.guestExitText}>Sign in / Create account</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Separator */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>CASE DETAILS</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          {/* Major */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              <Ionicons name="library-outline" size={14} color={Colors.textMuted} />{' '}
              Field of Study
            </Text>
            {token ? (
              <View style={styles.lockedField}>
                <Text style={styles.lockedFieldText}>{formatMajor(major)}</Text>
                <Ionicons name="lock-closed-outline" size={16} color={Colors.textMuted} />
              </View>
            ) : (
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={major}
                  onValueChange={setMajor}
                  style={styles.picker}
                  dropdownIconColor={Colors.textMuted}
                >
                  {MAJORS.map((m) => (
                    <Picker.Item
                      key={m}
                      label={formatMajor(m)}
                      value={m}
                      color={Platform.OS === 'web' ? Colors.textPrimary : undefined}
                      style={Platform.OS === 'web' ? { backgroundColor: '#000000', color: '#F5E6C8' } : {}}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          {/* Topics */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              <Ionicons name="heart-outline" size={14} color={Colors.textMuted} />{' '}
              Interests
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={likedTopics}
                onChangeText={setLikedTopics}
                placeholder="e.g. mathematics, algorithms, programming"
                placeholderTextColor={Colors.textPlaceholder}
              />
            </View>
          </View>

          {/* Completed Courses */}
          {token ? (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                <Ionicons name="checkmark-circle-outline" size={14} color={Colors.textMuted} />{' '}
                Prior Coursework
              </Text>
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => setUseProfileCourses(!useProfileCourses)}
                activeOpacity={0.7}
              >
                <View style={[styles.toggleDot, useProfileCourses && styles.toggleDotActive]} />
                <Text style={styles.toggleLabel}>
                  {useProfileCourses ? 'Using courses from your case file' : 'Manual entry'}
                </Text>
              </TouchableOpacity>
              {!useProfileCourses && (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={completedCourses}
                    onChangeText={setCompletedCourses}
                    placeholder="e.g. intro_to_cs, math_1"
                    placeholderTextColor={Colors.textPlaceholder}
                  />
                </View>
              )}
            </View>
          ) : (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                <Ionicons name="checkmark-circle-outline" size={14} color={Colors.textMuted} />{' '}
                Prior Coursework
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={completedCourses}
                  onChangeText={setCompletedCourses}
                  placeholder="e.g. intro_to_cs, math_1"
                  placeholderTextColor={Colors.textPlaceholder}
                />
              </View>
            </View>
          )}

          {/* Difficulty — Segmented Control */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              <Ionicons name="speedometer-outline" size={14} color={Colors.textMuted} />{' '}
              Preferred Difficulty
            </Text>
            <View style={styles.segmentedControl}>
              {DIFFICULTIES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.segment,
                    preferredDifficulty === d && styles.segmentActive,
                    preferredDifficulty === d && { borderColor: getDifficultyColor(d) },
                  ]}
                  onPress={() => setPreferredDifficulty(d)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.segmentDot,
                      { backgroundColor: getDifficultyColor(d) },
                      preferredDifficulty !== d && { opacity: 0.3 },
                    ]}
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      preferredDifficulty === d && { color: Colors.textPrimary },
                    ]}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.prologButton]}
            onPress={() => handleRecommend('prolog')}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.prologEmoji}>⚖️</Text>
            <Text style={styles.prologButtonText}>Saul's Logic</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.aiButton]}
            onPress={() => handleRecommend('ai')}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.aiEmoji}>🤖</Text>
            <Text style={styles.aiButtonText}>AI Counsel</Text>
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.loadingText}>
              {recommendationsType === 'AI'
                ? 'Consulting the AI associate...'
                : 'Saul is reviewing your case...'}
            </Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={18} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Results */}
        {renderRecommendations()}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.accent,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  guestExitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentGlow,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  guestExitText: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  separatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  formSection: {
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  fieldGroup: {
    gap: Spacing.sm,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lockedField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    opacity: 0.7,
  },
  lockedFieldText: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  picker: {
    color: Colors.textPrimary,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' && { padding: 14, outlineWidth: 0, borderWidth: 0 } as any),
  },
  inputContainer: {
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  textInput: {
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgCard,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleDot: {
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.textMuted,
  },
  toggleDotActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent,
  },
  toggleLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.bgInput,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentActive: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1.5,
  },
  segmentDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 16,
    borderRadius: Radius.md,
  },
  prologButton: {
    backgroundColor: Colors.accentGlow,
    borderWidth: 1.5,
    borderColor: Colors.accent + '50',
  },
  prologEmoji: {
    fontSize: 16,
  },
  prologButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiButton: {
    backgroundColor: Colors.accent,
  },
  aiEmoji: {
    fontSize: 16,
  },
  aiButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.bg,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorBg,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    flex: 1,
  },
  // Results
  resultsSection: {
    gap: Spacing.md,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  verdictBar: {
    width: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  resultsHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  resultsCount: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  recCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  recDot: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
  },
  recCardContent: {
    flex: 1,
    padding: Spacing.md,
    paddingLeft: Spacing.md,
  },
  recName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  recMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  diffBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  recCardIndex: {
    paddingRight: Spacing.md,
  },
  recIndexText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.borderFocus,
    fontStyle: 'italic',
  },
  emptyResults: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyResultsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  emptyResultsSub: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
