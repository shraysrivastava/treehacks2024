import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {Colors} from "../constants/Colors";

interface ProgressBarProps {
  count: number;
  capacity: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ count, capacity }) => {
  const clampedProgress = Math.max(0, Math.min(count / capacity, 1));
  const percentage = Math.round(clampedProgress * 100);
  let progressBarColor;

if (percentage > 70) {
  progressBarColor = '#FF1744'; // Vivid Red for 70-100%
} else if (percentage > 40) {
  progressBarColor = '#FB8C00'; // Deep Orange for 40-70%
} else {
  progressBarColor = '#2bd466'; // Olive Green for 0-40%
}

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.filledProgress, { width: `${percentage}%`, backgroundColor: progressBarColor }]}>
          {/* <CustomText style={styles.progressText}>
            {`${percentage}%`}
          </CustomText> */}
        </View>
        
          <Text style={[styles.progressText, styles.unfilledProgressText]}>
            {`${percentage}%`}
          </Text>
        
      </View>
      <Text style={styles.countCapacityText}>
        {count}/{capacity} questions
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginLeft: 5,
    marginTop: 5,
  },
  progressBar: {
    width: "100%",
    height: 20,
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 10,
    overflow: "hidden",
  },
  filledProgress: {
    justifyContent: "center", // Center text vertically
    alignItems: "flex-end", // Align text to the right
  },
  progressText: {
    fontWeight: 'bold',
    color: 'white', // Ensuring text is visible on colored background
  },
  unfilledProgressText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center', // Center text horizontally
    color: 'white', // Text color for unfilled section
  },
  countCapacityText: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 13,
  },
});
