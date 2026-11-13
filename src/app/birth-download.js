import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Directory } from "expo-file-system";
import BirthDownloadForm from "../components/BirthDownloadForm.js";
import { birthDownloadSchema } from "../schemas/birthDownload.schema.js";
import BirthDownloadService from "../services/birthDownloadService.js";
import { colors } from "../theme/colors.js";
import toPdfBytes from "../utils/toPdfBytes.util.js";

const birthCertificateService = new BirthDownloadService();

export default function BirthCertificateDownloadScreen() {
  const motherFirstNameInput = useRef(null);
  const birthCertificateNoInput = useRef(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [motherFirstName, setMotherFirstName] = useState("");
  const [birthCertificateNo, setBirthCertificateNo] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  async function handleDownload() {
    const validation = birthDownloadSchema.safeParse({
      dateOfBirth: dateOfBirth.trim(),
      motherFirstName: motherFirstName.trim(),
      birthCertificateNo: birthCertificateNo.trim(),
    });

    if (!validation.success) {
      const issue = validation.error.issues[0];
      const titleByField = {
        dateOfBirth: "Check the date",
        motherFirstName: "Check the mother's name",
        birthCertificateNo: "Check the certificate number",
      };
      const field = issue.path[0];
      Alert.alert(titleByField[field] || "Check the information", issue.message);
      return;
    }

    setIsDownloading(true);
    let savedFile;

    try {
      const response = await birthCertificateService.downloadBirthCertificate(
        validation.data.dateOfBirth,
        validation.data.motherFirstName,
        validation.data.birthCertificateNo,
      );
      const bytes = toPdfBytes(response);

      if (
        bytes.length < 5 ||
        bytes[0] !== 0x25 ||
        bytes[1] !== 0x50 ||
        bytes[2] !== 0x44 ||
        bytes[3] !== 0x46 ||
        bytes[4] !== 0x2d
      ) {
        throw new Error(
          "The response was not a PDF. Check the details and try again.",
        );
      }

      const saveDirectory = await Directory.pickDirectoryAsync();
      const fileName = `birth-certificate-${Date.now()}.pdf`;
      savedFile = saveDirectory.createFile(fileName, "application/pdf");
      await savedFile.write(bytes);

      Alert.alert("PDF saved", `Saved as ${fileName}.`);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("cancelled by the user")
      ) {
        return;
      }

      const message =
        error instanceof Error
          ? error.message
          : "Please check the details and try again.";
      Alert.alert(
        savedFile?.exists ? "Save failed" : "Download failed",
        savedFile?.exists
          ? `The PDF could not be saved to the selected folder. ${message}`
          : message,
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          keyboardVisible && styles.scrollContentKeyboard,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <BirthDownloadForm
            birthCertificateNumberValue={birthCertificateNo}
            dateOfBirthValue={dateOfBirth}
            isDownloading={isDownloading}
            onBirthCertificateNumberChange={setBirthCertificateNo}
            onDateOfBirthChange={setDateOfBirth}
            onInputFocus={() => setKeyboardVisible(true)}
            onMotherFirstNameChange={setMotherFirstName}
            onSubmit={handleDownload}
            birthCertificateNumberInputRef={birthCertificateNoInput}
            motherFirstNameInputRef={motherFirstNameInput}
            motherFirstNameValue={motherFirstName}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 2,
  },
  scrollContentKeyboard: {
    paddingBottom: 140,
  },
  content: {
    alignSelf: "center",
    flexGrow: 1,
    maxWidth: 600,
    paddingHorizontal: 20,
    paddingVertical: 24,
    width: "100%",
  },
});
