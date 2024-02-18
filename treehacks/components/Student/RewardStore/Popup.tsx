import React from "react";
import { View, Modal, Text, TouchableHighlight, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../../../constants/Colors";

interface RemovePopupProps {
    message: string
  isVisible: boolean;
  onCancel: () => void;
}

export const QuestionPopup: React.FC<RemovePopupProps> = ({ isVisible, onCancel, message }) => {
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onCancel} 
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onCancel}
      >
        <View style={styles.popupContainer} onStartShouldSetResponder={() => true}>
          <Text style={styles.popupText}>
            {message}
          </Text>
          <View style={styles.buttonContainer}>
            
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  
  popupContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    // Add other styling as needed
  },
  popupContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popupText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "500",
    color: "black",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: Colors.accent1,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  }
});
