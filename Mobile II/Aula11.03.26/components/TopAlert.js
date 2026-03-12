import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

export default function TopAlert({ visible, message, onDismiss, color = '#DC2626' }) {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 6,
      }).start();

      const timer = setTimeout(() => {
        hide();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hide = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onDismiss());
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], backgroundColor: color }]}>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={hide} style={styles.closeBtn}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
