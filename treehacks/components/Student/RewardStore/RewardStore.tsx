import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, SafeAreaView, Button, Image } from "react-native";
import { togetherClient, TogetherImageModel } from 'together-ai-sdk';
import { auth } from "../../../firebase/firebase";
import { FirebaseError } from "firebase/app";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
export const RewardStoreHome = () => {
    const [apiResponses, setApiResponses] = useState<string[]>([]);

    const makeApiCall = async () => {
        try {
            const client = togetherClient({ apiKey: '77712fb6e31d5284a3c4015b53a49f6c4a9d093e29232cef4ff609c5c935a7d6' });
            console.log('Making API call');
            const result = await client.image({
                model: TogetherImageModel.Stable_Diffusion_XL_1_0,
                prompt: 'A picture of a dog with a hat on',
                width: 1024,
                height: 1024,
                n: 5
            });
            const newResponses = result.output.choices.map(choice => choice.imageBase64);
            setApiResponses(newResponses);
        } catch (error) {
            console.error(error);
        }
    };

    const addToProfileWallet = (imageBase64: string) => {
        // Add the image to the user's profile wallet in Firestore
        const user = auth.currentUser;
        console.log(user?.email);
        if (user) {
            const db = getFirestore();
            updateDoc(doc(db, "users", user.uid), {
                wallet: {imageBase64},
              });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {apiResponses.length > 0 ? (
                <View style={styles.imagesContainer}>
                    {apiResponses.map((response, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.imageContainer}
                            onPress={() => addToProfileWallet(response)}
                        >
                            <Image style={styles.image} source={{ uri: "data:image/png;base64," + response }} />
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <Text style={styles.text}>No images available</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={makeApiCall}>
                <Text style={styles.text}>Generate Images</Text>
            </TouchableOpacity>
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
    imagesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
    },
    imageContainer: {
        margin: 10,
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
});
