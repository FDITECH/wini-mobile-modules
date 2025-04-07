import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export const StepCircleProgress = ({
  step = 1,
  totalStep = 3,
  size = 64,
  strokeWidth = 6,
  showTitle = true,
  colorStroke = '#377DFF',
}: {
  step?: number;
  totalStep?: number;
  size?: number;
  strokeWidth?: number;
  showTitle?: boolean;
  colorStroke?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - step / totalStep);

  return (
    <View style={[styles.progressContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E6EAF0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorStroke ?? '#377DFF'}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {/* Centered Progress Text */}
      {!showTitle ? null : (
        <Text style={styles.progressText}>
          {step}/{totalStep}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressText: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#377DFF',
    textAlign: 'center',
  },
});
