import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({
  progress = 0,
  height = 8,
  backgroundColor = 'rgba(255,255,255,0.3)',
  progressColor = '#FFF',
  showPercentage = true,
  percentageColor = '#FFF',
  borderRadius = 4,
  label = null,
  labelColor = '#FFF'
}) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: labelColor }]}>
          {label}
        </Text>
      )}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBackground,
            {
              height,
              backgroundColor,
              borderRadius
            }
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                width: `${normalizedProgress}%`,
                backgroundColor: progressColor,
                borderRadius
              }
            ]}
          />
        </View>
        {showPercentage && (
          <Text
            style={[
              styles.percentageText,
              { color: percentageColor }
            ]}
          >
            {Math.round(normalizedProgress)}%
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  progressBackground: {
    flex: 1,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%'
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'right'
  }
});
