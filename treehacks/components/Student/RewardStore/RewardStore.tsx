import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { togetherClient, TogetherImageModel } from "together-ai-sdk";
import { auth } from "../../../firebase/firebase";
import {
  getFirestore,
  updateDoc,
  doc,
  collection,
  addDoc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";
import { baseDir, togetherAPIKey, uploaderEndpoint, uploaderKey } from "./api";
import queryString from "query-string";
import { createNFT } from "../../../crossmint/crossmint";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { Colors } from "../../../constants/Colors";
import CustomToast, { ToastProps } from "../../../constants/Toast";

export const RewardStoreHome = () => {
  const [apiResponses, setApiResponses] = useState<
    { image: string; price: number }[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
  useEffect(() => {
    setLoading(true);
    makeApiCall();
  }, []);

  const makeApiCall = async () => {
    try {
      const client = togetherClient({ apiKey: togetherAPIKey });
      console.log("Making API call");
      const result = await client.image({
        model: TogetherImageModel.Stable_Diffusion_XL_1_0,
        prompt:
          "Only one animated cute pokemon-style animal with a natural background",
        width: 512,
        height: 512,
        n: 5,
      });
      const newResponses = result.output.choices.map((choice) => ({
        image: choice.imageBase64,
        price: Math.floor(Math.random() * 8) + 3,
      }));
      setApiResponses(newResponses);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  function generateID() {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const uploadImageToStorage = async (imageBase64: string) => {
    try {
      const id = generateID(); // Generate unique ID

      const response = await axios.post(
        uploaderEndpoint,
        queryString.stringify({
          imageBytes: imageBase64,
          id: id,
          secretKey: uploaderKey,
        })
      );
      

      if (response.data === "Saved successfully") {
        const imageURL = `${baseDir}/${id}.jpeg`; // Adjust the URL structure according to your API
        const db = getFirestore();
        await addDoc(collection(db, "prenft-images"), { imageUrl: imageURL });
        return imageURL;
      } else {
        console.log(response.data);
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const addToProfileWallet = async (imageBase64: string, price: number) => {
    try {
      const downloadURL = await uploadImageToStorage(imageBase64);
      const user = auth.currentUser;
      console.log(user?.email);
      if (user) {
        const db = getFirestore();
        const walletRef = doc(db, "users", user.uid);

        const id = await createNFT(user.email!, downloadURL);

        const docSnap = await getDoc(walletRef);
        if (!docSnap.exists()) {
          return;
        }

        const userData = docSnap.data();
        const updatedWallet = [
          ...userData.wallet,
          { imageUrl: downloadURL, id: id },
        ];
        await updateDoc(walletRef, {
          wallet: updatedWallet,
          points: userData.points - price,
        });
        setSelectedImage(downloadURL);
        await addDoc(collection(db, "prenft-images"), {
          imageUrl: downloadURL,
        });
      }
    } catch (error) {
      console.error("Error adding to wallet:", error);
    }
  };

  const handleNext = () => {
    if (selectedImage) {
      const selectedImageData = apiResponses.find(
        (item) => item.image === selectedImage
      );
      if (selectedImageData) {
        const { image, price } = selectedImageData;
        const userPoints = studentData?.points || 0;
        if (price <= userPoints) {
          addToProfileWallet(image, price);
        } else {
          setToast({ message: "Not enough points", color: Colors.toastError });
        }
      }
    }
  };
  const [studentData, setStudentData] = useState<DocumentData>();

  useEffect(() => {
    const fetchStudentData = async () => {
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchStudentData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text>Loading</Text>
        </View>
      ) : (
        <>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBox}>
              <MaterialIcons name={"star"} size={32} color={Colors.primary} />

              <Text style={styles.scoreText}>
                {studentData?.points ? studentData.points : 0}
              </Text>
            </View>
          </View>
          {apiResponses.length > 0 ? (
            <>
              <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.imagesContainer}>
                  {apiResponses.map((response, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.imageContainer,
                        selectedImage === response.image &&
                          styles.selectedImageContainer,
                        index % 2 === 1 && styles.imageContainerRight,
                      ]}
                      onPress={() => setSelectedImage(response.image)}
                    >
                      {selectedImage === response.image && (
                        <View style={styles.checkIcon}>
                          <Text>✓</Text>
                        </View>
                      )}
                      <Image
                        style={styles.image}
                        source={{
                          uri: "data:image/png;base64," + response.image,
                        }}
                      />
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>
                          {response.price} points
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              {selectedImage && (
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNext}
                >
                  <Text style={styles.nextButtonText}>Redeem!</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.text}>No images available</Text>
          )}
        </>
      )}
      <CustomToast message={toast.message} color={toast.color} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  selectedImageContainer: {
    borderWidth: 2,
    borderColor: "blue",
  },
  image: {
    width: 200,
    height: 200,
  },
  button: {
    backgroundColor: "gold",
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
  },
  checkIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ff4757", // A red color for the logout button
    borderRadius: 20, // Rounded corners for the button
    borderWidth: 1,
    borderColor: "#ff6b81", // Slightly lighter red for the border
    elevation: 2, // Adds a slight shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 20,
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainerRight: {
    alignSelf: "flex-end", // Align odd-indexed items to the right
  },
  scoreContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 999, // Ensure it's above other elements
  },
  scoreBox: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  scoreText: {
    fontSize: 16,
  },
  priceContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderTopLeftRadius: 5,
  },
  priceText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default RewardStoreHome;
