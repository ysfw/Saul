import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 12,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2D3748',
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  secondaryButton: {
    backgroundColor: '#1A202C',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loadingText: {
    color: '#A0A0A0',
    marginTop: 12,
  },
  errorContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#3b1c1c',
    borderRadius: 8,
  },
  errorText: {
    color: '#ff6b6b',
    fontWeight: '500',
  },
  resultsContainer: {
    marginTop: 32,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  recommendationCard: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4DA8DA',
  },
  recommendationText: {
    color: '#E0E0E0',
    fontSize: 16,
    lineHeight: 24,
  },
  resultText: {
    color: '#A0A0A0',
    fontSize: 16,
  },
});
