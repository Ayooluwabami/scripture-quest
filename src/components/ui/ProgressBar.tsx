import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showPercentage?: boolean;
  color?: string[];
  backgroundColor?: string;
  label?: string;
  style?: any;
}

export default function ProgressBar({ 
  progress, 
  height = 8, 
  showPercentage = false,
  color = ['#3B82F6', '#1D4ED8'],
  backgroundColor = '#E5E7EB',
  label,
  style 
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={[styles.container, style]}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
          )}
        </View>
      )}
      
      <View style={[styles.track, { height, backgroundColor }]}>
        <LinearGradient
          colors={color}
          style={[
            styles.fill,
            { 
              width: `${clampedProgress}%`,
              height,
              borderRadius: height / 2
            }
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  track: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
});