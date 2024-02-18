import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Button, Image, ActivityIndicator, ScrollView } from "react-native";
import { togetherClient, TogetherImageModel } from 'together-ai-sdk';
import { auth } from "../../../firebase/firebase";
import { getFirestore, updateDoc, doc, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import axios from 'axios';
import { baseDir, togetherAPIKey, uploaderEndpoint, uploaderKey } from "./api";
import queryString from 'query-string';
import { createNFT } from "../../../crossmint/crossmint";

export const RewardStoreHome = () => {
    const [apiResponses, setApiResponses] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        makeApiCall();
    }, []);

    const makeApiCall = async () => {
        try {
            const client = togetherClient({ apiKey: togetherAPIKey });
            console.log('Making API call');
            const result = await client.image({
                model: TogetherImageModel.Stable_Diffusion_XL_1_0,
                prompt: 'A picture of a dog with a hat on',
                width: 1024,
                height: 1024,
                n: 2
            });
            const newResponses = result.output.choices.map(choice => choice.imageBase64);
            setApiResponses(newResponses);
            setLoading(false);

            // Upload each image as soon as it's generated
            newResponses.forEach(response => {
                uploadImageToStorage(response);
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    function generateID() { 
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

            const response = await axios.post(uploaderEndpoint,  queryString.stringify({
                imageBytes: imageBase64,
                id: id,
                secretKey: uploaderKey,
            }));
            
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

    const addToProfileWallet = async (imageBase64: string) => {
        try {
           const downloadURL = await uploadImageToStorage(imageBase64);
            const user = auth.currentUser;
            console.log(user?.email);
            if (user) {
                const db = getFirestore();
                const walletRef = doc(db, "users", user.uid);
                await updateDoc(walletRef, {
                    wallet: [    
                        {imageUrl: downloadURL,
                        // Other wallet data if any
                    }],
                });
                setSelectedImage(downloadURL);
                await addDoc(collection(db, "prenft-images"), { imageUrl: downloadURL });

                createNFT(user.email!, downloadURL);
            }
        } catch (error) {
            console.error("Error adding image to wallet:", error);
        }
    };

    const handleNext = () => {
        // Handle the next action
        console.log("Next button clicked");
        // Pass the url
        addToProfileWallet(selectedImage!);
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    {apiResponses.length > 0 ? (
                        <>
                            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                                <View style={styles.imagesContainer}>
                                    {apiResponses.map((response, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.imageContainer,
                                                selectedImage === response && styles.selectedImageContainer
                                            ]}
                                            onPress={() => setSelectedImage(response)}
                                        >
                                            {selectedImage === response && (
                                                <View style={styles.checkIcon}>
                                                    <Text>✓</Text>
                                                </View>
                                            )}
                                            <Image style={styles.image} source={{ uri: "data:image/png;base64," + response }} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                            {selectedImage && (
                                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                                    <Text style={styles.nextButtonText}>Next</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <Text style={styles.text}>No images available</Text>
                    )}
                </>
            )}
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
        backgroundColor: 'gold',
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
      },
      nextButtonText: {
        color: "#fff", // White text color
        fontSize: 16,
        fontWeight: "bold",
      },
});

export default RewardStoreHome;