import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./index.styles";
import { themeColor } from "./theme";

const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

export default function MajorsScreen() {
  const [majors, setMajors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/majors/`);
      if (!response.ok) throw new Error("Failed to fetch majors");
      const data = await response.json();
      const majorNames = data.map((m: any) => m.name);
      setMajors(majorNames);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMajor = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.majorCard}
      onPress={() => router.push({ pathname: "/advisor", params: { major: item } })}
    >
      <View style={styles.majorInfo}>
        <View style={styles.iconContainer}>
          <Ionicons name="school" size={24} color={themeColor} />
        </View>
        <Text style={styles.majorText}>
          {item.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="briefcase" size={40} color={themeColor} style={styles.headerBriefcaseIcon} />
        <Text style={styles.header} adjustsFontSizeToFit={true} numberOfLines={1}>BETTER CALL SAUL</Text>
        <Text style={styles.subHeader}>Expert Study Consultation. Did you know you have academic rights?</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={themeColor} />
          <Text style={styles.loadingText}>Loading majors...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={32} color="#ff6b6b" />
            <Text style={styles.errorText}>Oops! {error}</Text>
          </View>
          <TouchableOpacity onPress={fetchMajors} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={majors}
          keyExtractor={(item) => item}
          renderItem={renderMajor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
