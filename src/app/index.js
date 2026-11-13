import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../theme/colors.js";

function CertificateIcon({ color }) {
  return (
    <View style={[styles.documentIcon, { borderColor: color }]}>
      <View style={[styles.documentLine, { backgroundColor: color }]} />
      <View style={[styles.documentLineShort, { backgroundColor: color }]} />
    </View>
  );
}

function ServiceCard({ tone, title, description, available }) {
  const palette = tone === "birth" ? colors.birth : colors.death;

  return (
    <View
      style={[
        styles.serviceCard,
        { borderColor: palette.border },
        !available && styles.serviceCardUnavailable,
      ]}
    >
      <View style={[styles.serviceIcon, { backgroundColor: palette.background }]}>
        <CertificateIcon color={palette.primary} />
      </View>
      <View style={styles.serviceText}>
        <View style={styles.serviceTitleRow}>
          <Text style={styles.serviceTitle}>{title}</Text>
          {!available ? (
            <View style={[styles.comingSoonBadge, { backgroundColor: palette.background }]}>
              <Text style={[styles.comingSoonText, { color: palette.primary }]}>
                COMING SOON
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.serviceDescription}>{description}</Text>
      </View>
      <View style={[styles.arrowCircle, { backgroundColor: palette.background }]}>
        <Text style={[styles.arrow, { color: palette.primary }]}>
          {available ? "›" : "–"}
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      <View style={styles.brandRow}>
        <Image
          accessibilityLabel="JMT birth and death certificate logo"
          source={require("../../assets/icon.png")}
          style={styles.brandLogo}
        />
        <View>
          <Text style={styles.brand}>JMT</Text>
          <Text style={styles.brandCaption}>JANMA MRITYU TATHYA</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrowText}>CERTIFICATE SERVICES</Text>
        </View>
        <Text style={styles.heading}>Important records, made simpler</Text>
        <Text style={styles.intro}>
          Find the certificate service you need, with a clear and secure
          experience.
        </Text>
      </View>

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Choose a service</Text>
        <Text style={styles.sectionCaption}>Select a certificate type</Text>
      </View>

      <Link href="/birth-download" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Download birth certificate"
          style={({ pressed }) => [pressed && styles.serviceCardPressed]}
        >
          <ServiceCard
            tone="birth"
            title="Birth"
            description="Find and download a birth certificate"
            available
          />
        </Pressable>
      </Link>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Death certificate downloads, coming soon"
        accessibilityState={{ disabled: true }}
        disabled
      >
        <ServiceCard
          tone="death"
          title="Death"
          description="Death certificate downloads are not available yet"
          available={false}
        />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 32,
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 30,
  },
  brandLogo: {
    borderRadius: 15,
    height: 54,
    marginRight: 12,
    width: 54,
  },
  brand: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  brandCaption: {
    color: colors.secondaryText,
    fontSize: 10,
    letterSpacing: 0.8,
    marginTop: 3,
  },
  hero: {
    backgroundColor: colors.lightCyan,
    borderColor: colors.birth.border,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 28,
    padding: 20,
  },
  eyebrow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 12,
  },
  eyebrowDot: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 7,
    marginRight: 8,
    width: 7,
  },
  eyebrowText: {
    color: colors.darkBlue,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  heading: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 8,
  },
  intro: {
    color: colors.secondaryText,
    fontSize: 14,
    lineHeight: 21,
  },
  sectionHeading: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionCaption: {
    color: colors.secondaryText,
    fontSize: 13,
  },
  serviceCard: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
    flexDirection: "row",
    marginBottom: 12,
    minHeight: 104,
    paddingHorizontal: 15,
    paddingVertical: 16,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  serviceCardPressed: {
    opacity: 0.8,
  },
  serviceCardUnavailable: {
    elevation: 0,
    shadowOpacity: 0,
  },
  serviceIcon: {
    alignItems: "center",
    borderRadius: 14,
    height: 50,
    justifyContent: "center",
    marginRight: 13,
    width: 50,
  },
  documentIcon: {
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1.7,
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 3,
    width: 19,
  },
  documentLine: {
    height: 1.5,
    marginTop: 3,
    width: 9,
  },
  documentLineShort: {
    height: 1.5,
    marginTop: 3,
    width: 6,
  },
  serviceText: {
    flex: 1,
    paddingRight: 8,
  },
  serviceTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  serviceTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  serviceDescription: {
    color: colors.secondaryText,
    fontSize: 12,
    lineHeight: 17,
  },
  comingSoonBadge: {
    borderRadius: 7,
    marginTop: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  comingSoonText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  arrowCircle: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  arrow: {
    fontSize: 25,
    lineHeight: 28,
  },
});
