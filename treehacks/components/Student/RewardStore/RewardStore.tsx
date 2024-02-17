import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Button, Image } from "react-native";
import { togetherClient, TogetherImageModel } from 'together-ai-sdk'

export const RewardStoreHome = () => {
    const [apiResponse, setApiResponse] = useState<string | null>(null);

    const makeApiCall = async () => {
        try {
            const client = togetherClient({ apiKey: '77712fb6e31d5284a3c4015b53a49f6c4a9d093e29232cef4ff609c5c935a7d6' })
            console.log('Making API call');
            const result = await client.image({
                model: TogetherImageModel.Stable_Diffusion_XL_1_0,
                prompt: 'A picture of a dog with a hat on',
                width: 1024,
                height: 1024,
                n: 1
            })
            console.log(result.output.choices[0].imageBase64);
            setApiResponse(result.output.choices[0].imageBase64);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {apiResponse ? (
               /*  <Image source={{ uri: apiResponse }} style={styles.image} /> */
               <Image style={styles.image} source={{uri: "data:image/png;base64,"+apiResponse}} />  

            ) : (
                <Text style={styles.text}>No image available</Text>
            )}
            <Button title="Make API Call" onPress={makeApiCall} />
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
    image: {
        width: 200,
        height: 200,
    },
});
