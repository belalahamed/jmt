import { useEffect, useRef, useState } from "react";
import { usePathname, Link } from "expo-router";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors.js";

const menuSections = [
  {
    title: "NAVIGATION",
    items: [
      {
        href: "/",
        label: "Home",
        icon: "home",
        category: "birth",
        available: true,
      },
    ],
  },
  {
    title: "SERVICES",
    items: [
      {
        href: "/birth-download",
        label: "Birth certificate",
        icon: "document",
        category: "birth",
        available: true,
      },
      {
        href: null,
        label: "Death certificate",
        icon: "document",
        category: "death",
        available: false,
      },
    ],
  },
];

export default function NavigationMenu() {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.78, 320);
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
              <View style={styles.drawerHeader}>
                <Image
                  accessibilityLabel="JMT birth and death certificate logo"
                  source={require("../../assets/icon.png")}
                  style={styles.appLogo}
                />
                <View style={styles.appDetails}>
                  <Text style={styles.appName}>JMT</Text>
                  <Text style={styles.appCaption}>JANMA MRITYU TATHYA</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close menu"
                  hitSlop={8}
                  onPress={closeMenu}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>X</Text>
                </Pressable>
              </View>

              {menuSections.map((section, index) => (
                <View
                  key={section.title}
                  style={[
                    styles.navigationSection,
                    index > 0 && styles.navigationSectionSeparated,
                  ]}
                >
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.items.map((item) => {
                    const isSelected = item.available && pathname === item.href;
                    const palette =
                      item.category === "death" ? colors.death : colors.birth;
                    const menuItem = (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                          item.available ? item.label : `${item.label}, coming soon`
                        }
                        accessibilityState={{
                          disabled: !item.available,
                          selected: isSelected,
                        }}
                        disabled={!item.available}
                        onPress={item.available ? closeMenu : undefined}
                        style={({ pressed }) => [
                          styles.menuItem,
                          isSelected && styles.menuItemSelected,
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
                          {item.icon === "home" ? (
                            <Text
                              style={[styles.homeIcon, { color: palette.primary }]}
                            >
                              {"\u2302"}
                            </Text>
                          ) : (
                            <View
                              style={[
                                styles.documentIcon,
                                { borderColor: palette.primary },
                              ]}
                            >
                              <View
                                style={[
                                  styles.documentLine,
                                  { backgroundColor: palette.primary },
                                ]}
                              />
                              <View
                                style={[
                                  styles.documentLineShort,
                                  { backgroundColor: palette.primary },
                                ]}
                              />
                            </View>
                          )}
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
                            <Text style={styles.menuItemHint}>Coming soon</Text>
                          ) : null}
                        </View>
                      </Pressable>
                    );

                    return item.available ? (
                      <Link key={item.label} href={item.href} asChild>
                        {menuItem}
                      </Link>
                    ) : (
                      <View key={item.label}>{menuItem}</View>
                    );
                  })}
                </View>
              ))}
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
    borderBottomLeftRadius: 22,
    borderTopLeftRadius: 22,
    elevation: 12,
    maxWidth: 320,
    shadowColor: colors.navy,
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 76,
    paddingBottom: 14,
    paddingTop: 14,
  },
  appLogo: {
    borderRadius: 12,
    height: 44,
    marginRight: 11,
    width: 44,
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  appCaption: {
    color: colors.secondaryText,
    fontSize: 9,
    letterSpacing: 0.6,
    marginTop: 3,
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: colors.lightCyan,
    borderRadius: 12,
    height: 44,
    justifyContent: "center",
    marginLeft: 8,
    width: 44,
  },
  closeButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  navigationSection: {
    paddingTop: 22,
  },
  navigationSectionSeparated: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 17,
  },
  sectionTitle: {
    color: colors.secondaryText,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 12,
  },
  menuItem: {
    alignItems: "center",
    borderRadius: 14,
    flexDirection: "row",
    marginBottom: 7,
    minHeight: 58,
    paddingHorizontal: 10,
  },
  menuItemSelected: {
    backgroundColor: colors.background,
  },
  menuItemUnavailable: {
    opacity: 0.7,
  },
  menuItemPressed: {
    opacity: 0.72,
  },
  menuItemIcon: {
    alignItems: "center",
    borderRadius: 11,
    height: 38,
    justifyContent: "center",
    marginRight: 12,
    width: 38,
  },
  menuItemCopy: {
    flex: 1,
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
  menuItemText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  menuItemHint: {
    color: colors.secondaryText,
    fontSize: 11,
    marginTop: 3,
  },
});
