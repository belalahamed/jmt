import { useEffect, useRef, useState } from "react";
import { usePathname, Link } from "expo-router";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors.js";

const appVersion = Constants.expoConfig?.version ?? "1.0.0";

const menuSections = [
  {
    title: "MENU",
    items: [
      {
        href: "/",
        label: "Home",
        icon: "home",
        category: "general",
        available: true,
      },
    ],
  },
  {
    title: "CERTIFICATE SERVICES",
    items: [
      {
        href: "/birth-download",
        label: "Download Birth Certificate",
        icon: "document",
        category: "birth",
        available: true,
      },
      {
        href: null,
        label: "Download Death Certificate",
        icon: "document",
        category: "death",
        available: false,
      },
    ],
  },
  {
    title: "INFORMATION",
    items: [
      {
        href: null,
        label: "About Application",
        icon: "info",
        category: "general",
        available: false,
      },
      {
        href: null,
        label: "Help & Support",
        icon: "help",
        category: "general",
        available: false,
      },
    ],
  },
  {
    title: "LEGAL",
    items: [
      {
        href: null,
        label: "Privacy Policy",
        icon: "privacy",
        category: "general",
        available: false,
      },
      {
        href: null,
        label: "Terms & Conditions",
        icon: "terms",
        category: "general",
        available: false,
      },
    ],
  },
];

function MenuIcon({ name, color }) {
  if (name === "home") {
    return <Text style={[styles.homeIcon, { color }]}>{"\u2302"}</Text>;
  }

  if (name === "info" || name === "help") {
    return (
      <View style={[styles.roundIcon, { borderColor: color }]}>
        <Text style={[styles.roundIconText, { color }]}>
          {name === "info" ? "i" : "?"}
        </Text>
      </View>
    );
  }

  if (name === "privacy") {
    return (
      <View style={[styles.shieldIcon, { borderColor: color }]}>
        <Text style={[styles.shieldIconText, { color }]}>{"\u2713"}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.documentIcon, { borderColor: color }]}>
      <View style={[styles.documentLine, { backgroundColor: color }]} />
      <View style={[styles.documentLineShort, { backgroundColor: color }]} />
    </View>
  );
}

export default function NavigationMenu() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.84, 420);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const translateX = useRef(new Animated.Value(drawerWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  function openMenu() {
    translateX.setValue(drawerWidth);
    backdropOpacity.setValue(0);
    setIsVisible(true);
    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    const opening = isOpen;
    const animation = Animated.parallel([
      Animated.timing(translateX, {
        toValue: opening ? 0 : drawerWidth,
        duration: opening ? 260 : 220,
        easing: opening ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: opening ? 0.42 : 0,
        duration: opening ? 240 : 200,
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished && !opening) {
        setIsVisible(false);
      }
    });

    return () => animation.stop();
  }, [backdropOpacity, drawerWidth, isOpen, isVisible, translateX]);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isOpen ? "Close menu" : "Open menu"}
        accessibilityState={{ expanded: isOpen }}
        hitSlop={8}
        onPress={openMenu}
        style={({ pressed }) => [
          styles.menuButton,
          pressed && styles.menuButtonPressed,
        ]}
      >
        <View style={styles.menuBar} />
        <View style={styles.menuBar} />
        <View style={styles.menuBar} />
      </Pressable>

      <Modal
        animationType="none"
        navigationBarTranslucent
        onRequestClose={closeMenu}
        statusBarTranslucent
        transparent
        visible={isVisible}
      >
        <View style={styles.overlay}>
          <Animated.View
            pointerEvents="none"
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close menu"
            onPress={closeMenu}
            style={StyleSheet.absoluteFill}
          />
          <Animated.View
            accessibilityViewIsModal
            style={[
              styles.drawer,
              {
                transform: [{ translateX }],
                width: drawerWidth,
              },
            ]}
          >
            <SafeAreaView edges={["top", "bottom"]} style={styles.drawerContent}>
              <LinearGradient
                colors={[colors.cyan, colors.primary, colors.darkBlue]}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                style={styles.drawerHeader}
              >
                <View style={styles.headerTopRow}>
                  <Image
                    accessibilityLabel="JMT birth and death certificate logo"
                    source={require("../../assets/icon.png")}
                    style={styles.appLogo}
                  />
                  <View style={styles.appDetails}>
                    <Text style={styles.appName}>JMT</Text>
                    <Text style={styles.appCaption}>
                      Birth &amp; Death Certificate Services
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close navigation menu"
                    hitSlop={8}
                    onPress={closeMenu}
                    style={({ pressed }) => [
                      styles.closeButton,
                      pressed && styles.closeButtonPressed,
                    ]}
                  >
                    <Text style={styles.closeButtonText}>{"\u00d7"}</Text>
                  </Pressable>
                </View>
              </LinearGradient>

              <View style={styles.drawerBody}>
                <ScrollView
                  contentContainerStyle={styles.menuList}
                  showsVerticalScrollIndicator={false}
                >
                  {menuSections.map((section) => (
                    <View key={section.title} style={styles.navigationSection}>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                      {section.items.map((item) => {
                        const isSelected =
                          item.available && pathname === item.href;
                        const palette =
                          item.category === "death"
                            ? colors.death
                            : item.category === "birth"
                              ? colors.birth
                              : {
                                  primary: colors.primary,
                                  background: colors.lightCyan,
                                };
                        const menuItem = (
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={
                              item.available
                                ? item.label
                                : `${item.label}, coming soon`
                            }
                            accessibilityState={{
                              disabled: !item.available,
                              selected: isSelected,
                            }}
                            disabled={!item.available}
                            onPress={item.available ? closeMenu : undefined}
                            style={({ pressed }) => [
                              styles.menuItem,
                              isSelected && {
                                backgroundColor: palette.background,
                              },
                              !item.available && styles.menuItemUnavailable,
                              pressed && styles.menuItemPressed,
                            ]}
                          >
                            <View
                              style={[
                                styles.menuItemIcon,
                                { backgroundColor: palette.background },
                              ]}
                            >
                              <MenuIcon name={item.icon} color={palette.primary} />
                            </View>
                            <View style={styles.menuItemCopy}>
                              <Text
                                style={[
                                  styles.menuItemText,
                                  isSelected && { color: palette.primary },
                                ]}
                              >
                                {item.label}
                              </Text>
                              {!item.available ? (
                                <Text style={styles.menuItemHint}>
                                  Coming soon
                                </Text>
                              ) : null}
                            </View>
                          </Pressable>
                        );

                        const menuEntry = item.available ? (
                          <Link href={item.href} asChild>
                            {menuItem}
                          </Link>
                        ) : (
                          menuItem
                        );

                        return (
                          <View
                            key={item.label}
                            style={styles.menuItemWrapper}
                          >
                            {menuEntry}
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.footer}>
                  <Text style={styles.version}>Version {appVersion}</Text>
                  <View style={styles.footerDivider} />
                  <Text style={styles.footerMessage}>
                    Made with care for citizens.
                  </Text>
                </View>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    alignItems: "center",
    backgroundColor: colors.lightCyan,
    borderRadius: 13,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  menuButtonPressed: {
    opacity: 0.7,
  },
  menuBar: {
    backgroundColor: colors.primary,
    borderRadius: 2,
    height: 2,
    marginVertical: 2,
    width: 18,
  },
  overlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.navy,
  },
  drawer: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 24,
    borderTopLeftRadius: 24,
    elevation: 12,
    maxWidth: 420,
    shadowColor: colors.navy,
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: colors.card,
    borderBottomLeftRadius: 24,
    borderTopLeftRadius: 24,
    overflow: "hidden",
  },
  drawerHeader: {
    paddingHorizontal: 18,
    paddingBottom: 20,
    paddingTop: 18,
  },
  headerTopRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 12,
  },
  appLogo: {
    borderRadius: 12,
    height: 46,
    marginRight: 11,
    width: 46,
  },
  appDetails: {
    flex: 1,
    paddingRight: 4,
  },
  appName: {
    color: colors.card,
    fontSize: 18,
    fontWeight: "700",
  },
  appCaption: {
    color: "rgba(255, 255, 255, 0.88)",
    fontSize: 12,
    lineHeight: 17,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderColor: "rgba(255, 255, 255, 0.45)",
    borderRadius: 13,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    marginLeft: 6,
    width: 42,
  },
  closeButtonText: {
    color: colors.card,
    fontSize: 26,
    fontWeight: "400",
    lineHeight: 30,
  },
  closeButtonPressed: {
    opacity: 0.7,
  },
  drawerBody: {
    flex: 1,
    paddingHorizontal: 18,
  },
  menuList: {
    paddingBottom: 12,
    paddingTop: 8,
  },
  menuItemWrapper: {
    alignSelf: "stretch",
    width: "100%",
  },
  navigationSection: {
    paddingTop: 12,
  },
  sectionTitle: {
    color: colors.secondaryText,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.9,
    marginBottom: 7,
    marginLeft: 10,
  },
  menuItem: {
    alignSelf: "stretch",
    alignItems: "center",
    borderRadius: 14,
    flexDirection: "row",
    marginBottom: 4,
    minHeight: 54,
    paddingHorizontal: 10,
    width: "100%",
  },
  menuItemUnavailable: {
    opacity: 0.56,
  },
  menuItemPressed: {
    opacity: 0.72,
  },
  menuItemIcon: {
    alignItems: "center",
    borderRadius: 10,
    height: 36,
    justifyContent: "center",
    marginRight: 11,
    width: 36,
  },
  menuItemCopy: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  homeIcon: {
    fontSize: 24,
    lineHeight: 26,
  },
  documentIcon: {
    alignItems: "center",
    borderRadius: 3,
    borderWidth: 1.5,
    height: 19,
    justifyContent: "center",
    paddingHorizontal: 3,
    width: 15,
  },
  documentLine: {
    height: 1.5,
    marginTop: 3,
    width: 7,
  },
  documentLineShort: {
    height: 1.5,
    marginTop: 3,
    width: 5,
  },
  roundIcon: {
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1.5,
    height: 19,
    justifyContent: "center",
    width: 19,
  },
  roundIconText: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  shieldIcon: {
    alignItems: "center",
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderWidth: 1.5,
    height: 20,
    justifyContent: "center",
    width: 17,
  },
  shieldIconText: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
  },
  menuItemText: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "600",
    includeFontPadding: false,
    lineHeight: 20,
  },
  menuItemHint: {
    color: colors.secondaryText,
    fontSize: 11,
    marginTop: 3,
  },
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: 12,
    paddingTop: 12,
  },
  version: {
    color: colors.secondaryText,
    fontSize: 11,
    marginBottom: 9,
  },
  footerDivider: {
    backgroundColor: colors.border,
    height: 1,
    marginBottom: 9,
  },
  footerMessage: {
    color: colors.secondaryText,
    fontSize: 12,
  },
});
