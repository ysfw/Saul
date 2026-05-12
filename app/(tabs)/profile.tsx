import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/contexts/AuthContext';
import { api, CourseInfo, ProfileData } from '@/utils/api';
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

export default function ProfileScreen() {
  const { token, user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add courses modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<CourseInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addingCourses, setAddingCourses] = useState(false);

  // Major editing
  const [editingMajor, setEditingMajor] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.getProfile(token);
      setProfile(data);
      setError('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fetchProfile]);

  const handleChangeMajor = async () => {
    if (!token || !selectedMajor) return;
    try {
      const updated = await api.updateMajor(token, selectedMajor);
      setProfile(updated);
      updateUser({ major: selectedMajor });
      setEditingMajor(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const openAddCourses = async () => {
    const majorName = profile?.major_name;
    if (!majorName) {
      setError('Set your field of study first to build your case record');
      return;
    }
    try {
      const courses = await api.getCourses(majorName);
      const completedNames = new Set(profile?.completed_courses.map(c => c.name) || []);
      setAvailableCourses(courses.filter(c => !completedNames.has(c.name)));
      setShowAddModal(true);
      setSearchQuery('');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const addCourse = async (courseName: string) => {
    if (!token) return;
    setAddingCourses(true);
    try {
      await api.addCompletedCourses(token, [courseName]);
      setAvailableCourses(prev => prev.filter(c => c.name !== courseName));
      await fetchProfile();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAddingCourses(false);
    }
  };

  const removeCourse = async (courseName: string) => {
    if (!token) return;
    try {
      await api.removeCompletedCourses(token, [courseName]);
      await fetchProfile();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const filteredCourses = availableCourses.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const completedCount = profile?.completed_courses.length || 0;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.screenTitle}>Client File</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Ionicons name="log-out-outline" size={20} color={Colors.error} />
              <Text style={styles.logoutText}>Close case</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar + name */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.username || '?')[0].toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.username}>{user?.username}</Text>
              <Text style={styles.majorLabel}>
                {profile?.major_name ? formatMajor(profile.major_name) : 'No major set'}
              </Text>
            </View>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Cases Closed</Text>
          </View>
        </View>

        {/* Major section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Field of Study</Text>
          </View>

          <View style={styles.majorDisplay}>
            <Ionicons name="library-outline" size={20} color={Colors.accent} />
            <Text style={styles.majorDisplayText}>
              {profile?.major_name ? formatMajor(profile.major_name) : 'Not declared during registration'}
            </Text>
            <Ionicons name="lock-closed-outline" size={16} color={Colors.textMuted} />
          </View>
        </View>

        {/* Completed Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Case Record {completedCount > 0 ? `(${completedCount})` : ''}
            </Text>
            <TouchableOpacity onPress={openAddCourses} style={styles.addButton}>
              <Ionicons name="add" size={18} color={Colors.accent} />
              <Text style={styles.addButtonText}>Add to Record</Text>
            </TouchableOpacity>
          </View>

          {completedCount === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={36} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No courses on record</Text>
              <Text style={styles.emptySubtext}>
                Tap "Add to Record" to log your completed coursework
              </Text>
            </View>
          ) : (
            <View style={styles.coursesList}>
              {profile?.completed_courses.map((course) => (
                <View key={course.id} style={styles.courseItem}>
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseName}>
                      {course.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Text>
                    <View style={styles.courseMetaRow}>
                      <View style={[styles.badge, { backgroundColor: getDifficultyColor(course.difficulty) + '20' }]}>
                        <Text style={[styles.badgeText, { color: getDifficultyColor(course.difficulty) }]}>
                          {course.difficulty}
                        </Text>
                      </View>
                      <Text style={styles.courseTopic}>{course.topic}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeCourse(course.name)}
                  >
                    <Ionicons name="close-circle-outline" size={22} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Courses Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Case Record</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search courses..."
                placeholderTextColor={Colors.textPlaceholder}
              />
            </View>

            <FlatList
              data={filteredCourses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalCourseItem}
                  onPress={() => addCourse(item.name)}
                  disabled={addingCourses}
                >
                  <View style={styles.modalCourseInfo}>
                    <Text style={styles.modalCourseName}>
                      {item.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Text>
                    <View style={styles.courseMetaRow}>
                      <View style={[styles.badge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
                        <Text style={[styles.badgeText, { color: getDifficultyColor(item.difficulty) }]}>
                          {item.difficulty}
                        </Text>
                      </View>
                      <Text style={styles.courseTopic}>{item.topic}</Text>
                    </View>
                  </View>
                  <Ionicons name="add-circle-outline" size={22} color={Colors.accent} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'No matching courses' : 'All courses completed!'}
                  </Text>
                </View>
              }
              style={styles.modalList}
            />
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: Colors.errorBg,
  },
  logoutText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.accent,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  majorLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorBanner: {
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
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  editLink: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '500',
  },
  majorEditContainer: {
    gap: Spacing.md,
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
  saveButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.bg,
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  majorDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  majorDisplayText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    backgroundColor: Colors.accentGlow,
  },
  addButtonText: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  coursesList: {
    gap: Spacing.sm,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  courseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  courseTopic: {
    fontSize: 13,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  removeButton: {
    padding: Spacing.sm,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.bgElevated,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    margin: Spacing.md,
    backgroundColor: Colors.bgInput,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  modalList: {
    paddingHorizontal: Spacing.md,
  },
  modalCourseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  modalCourseInfo: {
    flex: 1,
  },
  modalCourseName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
});
