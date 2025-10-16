import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  warningThreshold?: number; // seconds when to show warning
  style?: any;
}

export default function Timer({ initialTime, onTimeUp, warningThreshold = 60, style }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    setIsWarning(timeRemaining <= warningThreshold);

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp, warningThreshold]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 10) return '#DC2626'; // Critical
    if (isWarning) return '#F59E0B'; // Warning
    return '#10B981'; // Normal
  };

  const getBackgroundColor = () => {
    if (timeRemaining <= 10) return '#FEF2F2'; // Critical
    if (isWarning) return '#FFFBEB'; // Warning
    return '#ECFDF5'; // Normal
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }, style]}>
      {isWarning ? (
        <AlertTriangle size={16} color={getTimerColor()} />
      ) : (
        <Clock size={16} color={getTimerColor()} />
      )}
      <Text style={[styles.timeText, { color: getTimerColor() }]}>
        {formatTime(timeRemaining)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
  },
});