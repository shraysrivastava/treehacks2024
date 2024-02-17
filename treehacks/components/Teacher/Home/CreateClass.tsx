import React, { useState } from "react";
import { View, Modal, Text, TouchableHighlight, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Colors } from "../../../constants/Colors";

type CreateClassProps = {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: (className: string) => void;
};

export const CreateClass = ({ isVisible, onCancel, onConfirm }: CreateClassProps) => {
  const [className, setClassName] = useState("");

  const handleConfirm = () => {
    onConfirm(className);
    onCancel();
  };

  const handleClose = () => {
    setClassName("");
    onCancel();
  }

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={onCancel}
      >
        <View style={styles.popupContainer} onStartShouldSetResponder={() => true}>
          <Text style={styles.popupText}>Enter Class Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setClassName}
            value={className}
            placeholder="Class Name"
            placeholderTextColor={Colors.lightgray}
          />
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              style={[styles.button, styles.cancelButton]}
              underlayColor={Colors.lightgray}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.button, styles.confirmButton]}
              underlayColor={Colors.secondary}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableHighlight>
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
    backgroundColor: Colors.lightgray,
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
  },
  input: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    color: "black",
  },
});
