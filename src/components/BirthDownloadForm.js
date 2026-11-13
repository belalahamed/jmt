import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors } from "../theme/colors.js";

export default function BirthDownloadForm({
  birthCertificateNumberValue,
  dateOfBirthValue,
  isDownloadAvailable = true,
  isDownloading,
  onBirthCertificateNumberChange,
  onDateOfBirthChange,
  onMotherFirstNameChange,
  onSubmit,
  birthCertificateNumberInputRef,
  motherFirstNameInputRef,
  motherFirstNameValue,
  unavailableMessage,
}) {
  const [focusedField, setFocusedField] = useState(null);
  const isSubmitDisabled = !isDownloadAvailable || isDownloading;

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>BIRTH CERTIFICATE</Text>
        </View>
        <Text style={styles.title}>Download Birth Certificate</Text>
        <Text style={styles.description}>
          Enter the details below to download your birth certificate.
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>
          Date of Birth
        </Text>
        <TextInput
          accessibilityLabel="Date of Birth"
          autoCapitalize="none"
          onBlur={() => setFocusedField(null)}
          onFocus={() => setFocusedField("dateOfBirth")}
          style={[
            styles.input,
            focusedField === "dateOfBirth" && styles.inputFocused,
          ]}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
          onChangeText={onDateOfBirthChange}
          onSubmitEditing={() => motherFirstNameInputRef.current?.focus()}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={colors.mutedText}
          returnKeyType="next"
          selectionColor={colors.primary}
          value={dateOfBirthValue}
        />

        <Text style={styles.label}>
          Mother's First Name (first 3 characters)
        </Text>
        <TextInput
          accessibilityLabel="Mother's First Name (first 3 characters)"
          autoCapitalize="words"
          autoCorrect={false}
          onBlur={() => setFocusedField(null)}
          onFocus={() => setFocusedField("motherFirstName")}
          style={[
            styles.input,
            focusedField === "motherFirstName" && styles.inputFocused,
          ]}
          onChangeText={onMotherFirstNameChange}
          onSubmitEditing={() =>
            birthCertificateNumberInputRef.current?.focus()
          }
          placeholder="Enter Mother's First Name"
          placeholderTextColor={colors.mutedText}
          ref={motherFirstNameInputRef}
          returnKeyType="next"
          selectionColor={colors.primary}
          value={motherFirstNameValue}
        />

        <Text style={styles.label}>
          Birth Certificate Number
        </Text>
        <TextInput
          accessibilityLabel="Birth Certificate Number"
          autoCapitalize="characters"
          autoCorrect={false}
          onBlur={() => setFocusedField(null)}
          onFocus={() => setFocusedField("birthCertificateNumber")}
          style={[
            styles.input,
            focusedField === "birthCertificateNumber" && styles.inputFocused,
          ]}
          onChangeText={onBirthCertificateNumberChange}
          onSubmitEditing={onSubmit}
          placeholder="Enter Birth Certificate Number"
          placeholderTextColor={colors.mutedText}
          ref={birthCertificateNumberInputRef}
          returnKeyType="done"
          selectionColor={colors.primary}
          value={birthCertificateNumberValue}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityState={{
            busy: isDownloading,
            disabled: isSubmitDisabled,
          }}
          disabled={isSubmitDisabled}
          onPress={onSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            isSubmitDisabled && styles.submitButtonDisabled,
            pressed && !isSubmitDisabled && styles.submitButtonPressed,
          ]}
        >
          {isDownloading ? (
            <ActivityIndicator color={colors.card} />
          ) : (
            <Text
              style={[
                styles.submitButtonText,
                !isDownloadAvailable && styles.submitButtonTextDisabled,
              ]}
            >
              {isDownloadAvailable ? "Download PDF" : "Download unavailable"}
            </Text>
          )}
        </Pressable>
        {unavailableMessage ? (
          <Text style={styles.unavailableMessage}>
            {unavailableMessage}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    maxWidth: 560,
    width: "100%",
  },
  heading: {
    marginBottom: 20,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.birth.background,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  categoryBadgeText: {
    color: colors.birth.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 6,
  },
  description: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 21,
  },
  formCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    padding: 18,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    marginBottom: 17,
    minHeight: 52,
    paddingHorizontal: 13,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.birth.primary,
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 2,
    minHeight: 54,
    paddingHorizontal: 16,
  },
  submitButtonPressed: {
    backgroundColor: colors.darkBlue,
  },
  submitButtonDisabled: {
    backgroundColor: colors.disabledBackground,
  },
  submitButtonText: {
    color: colors.card,
    fontSize: 15,
    fontWeight: "700",
  },
  submitButtonTextDisabled: {
    color: colors.mutedText,
  },
  unavailableMessage: {
    color: colors.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
    textAlign: "center",
  },
});
