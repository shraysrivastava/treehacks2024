import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Modal,
} from 'react-native';
import { togetherClient, TogetherImageModel } from 'together-ai-sdk';
import { auth } from '../../../firebase/firebase';
import {
  getFirestore,
  updateDoc,
  doc,
  collection,
  addDoc,
  getDoc,
  DocumentData,
} from 'firebase/firestore';
import axios from 'axios';
import { baseDir, togetherAPIKey, uploaderEndpoint, uploaderKey } from './api';
import queryString from 'query-string';
import { createNFT } from '../../../crossmint/crossmint';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import CustomToast, { ToastProps } from '../../../constants/Toast';

export const RewardStoreHome = () => {
  const [apiResponses, setApiResponses] = useState<{ image: string; price: number }[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastProps>({ message: '', color: '' });
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [studentData, setStudentData] = useState<DocumentData>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [apiMessage, setApiMessage] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    makeApiCall();
    fetchStudentData();
  }, []);

  const makeApiCall = async () => {
    try {
      const client = togetherClient({ apiKey: togetherAPIKey });
      const result = await client.image({
        model: TogetherImageModel.Stable_Diffusion_XL_1_0,
        prompt: 'Only one animated cute pokemon-style animal with a natural background',
        width: 512,
        height: 512,
        n: 5,
      });
      const newResponses = result.output.choices.map((choice) => ({
        image: choice.imageBase64,
        price: Math.floor(Math.random() * 8) + 3,
      }));
      setApiResponses(newResponses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 10 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  };

  const uploadImageToStorage = async (imageBase64: string) => {
    try {
      const id = generateID(); // Generate unique ID
      const response = await axios.post(uploaderEndpoint, queryString.stringify({ imageBytes: imageBase64, id: id, secretKey: uploaderKey }));
      if (response.data === 'Saved successfully') {
        const imageURL = `${baseDir}/${id}.jpeg`; // Adjust the URL structure according to your API
        const db = getFirestore();
        await addDoc(collection(db, 'prenft-images'), { imageUrl: imageURL });
        return imageURL;
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const addToProfileWallet = async (imageBase64: string, price: number) => {
    try {
      const downloadURL = await uploadImageToStorage(imageBase64);
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const walletRef = doc(db, 'users', user.uid);
        const id = await createNFT(user.email!, downloadURL);
        const docSnap = await getDoc(walletRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const updatedWallet = [...userData.wallet, { imageUrl: downloadURL, id: id }];
          await updateDoc(walletRef, { wallet: updatedWallet, points: userData.points - price });
          setSelectedImage(downloadURL);
          setToast({ message: 'Added to wallet', color: Colors.toastSuccess });
        }
      }
    } catch (error) {
      setToast({ message: 'Error adding to wallet', color: Colors.toastError });
      console.error('Error adding to wallet:', error);
    }
  };

  const handleNext = () => {
    if (selectedImage) {
      const selectedImageData = apiResponses.find((item) => item.image === selectedImage);
      if (selectedImageData && studentData) {
        const { image, price } = selectedImageData;
        const userPoints = studentData.points || 0;
        if (price <= userPoints) {
          addToProfileWallet(image, price);
          setToast({ message: 'Redeemed!', color: Colors.toastSuccess });
        } else {
          setToast({ message: 'Not enough points', color: Colors.toastError });
        }
      }
    }
  };

  const fetchStudentData = async () => {
    const db = getFirestore();
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStudentData(docSnap.data());
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudentData().finally(() => setRefreshing(false));
  }, []);

const toggleModal = async () => {
    setModalVisible(!modalVisible);
    if (!modalVisible) {
        try {
        const hint = await getHint();
        setApiMessage(hint);
        } catch (error) {
        console.error('Error getting hint:', error);
        }
    }
};

const url: string = 'https://api.together.xyz/v1/chat/completions';
const apiKey: string = '77712fb6e31d5284a3c4015b53a49f6c4a9d093e29232cef4ff609c5c935a7d6';
const getHint = async () => {
  const headers: HeadersInit = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  });
  const data: { model: string, max_tokens: number, messages: { role: string, content: string }[] } = {
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: 'You are an AI assistant who does not start with greetings, just gets to the point'
      },
      {
        role: 'user',
        content: `Give a hint as to what a NFT marketplace is designed to incentivize learning on an educational app. 
        Students can earn points by answering questions and purchasing cool NFT redeemables. Explain as if you are talking to a 
        student of ${studentData?.gradeLevel} grade level.`
      }
    ]
  };
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
  }
};

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading Prizes...</Text>
        </View>
      ) : (
        <>
        <View style={styles.scoreContainer}>
            <View style={styles.scoreBox}>
                <MaterialIcons name="star" size={32} color={Colors.primary} />
                <Text style={styles.scoreText}>{studentData?.points ? studentData.points : 0}</Text>
            </View>
            <TouchableOpacity onPress={toggleModal}>
                    <MaterialIcons name="help-outline" size={32} color={Colors.primary} />
            </TouchableOpacity>
        </View>
          <ScrollView
            contentContainerStyle={styles.scrollViewContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.secondary]} tintColor={Colors.secondary} progressBackgroundColor="#ffffff" />}
          >
            <View style={styles.imagesContainer}>
              {apiResponses.map((response, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.imageContainer, selectedImage === response.image && styles.selectedImageContainer]}
                  onPress={() => setSelectedImage(response.image)}
                >
                  {selectedImage === response.image && <View style={styles.checkIcon}><Text>✓</Text></View>}
                  <Image style={styles.image} source={{ uri: 'data:image/png;base64,' + response.image }} />
                  <View style={styles.priceContainer}><Text style={styles.priceText}>{response.price} points</Text></View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {selectedImage && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Redeem!</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <CustomToast message={toast.message} color={toast.color} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>{apiMessage}</Text>
            <TouchableOpacity onPress={toggleModal}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectedImageContainer: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  image: {
    width: 200,
    height: 200,
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.accent2,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  nextButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 999,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
  },
  scoreText: {
    fontSize: 16,
    marginLeft: 5,
  },
  priceContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderTopLeftRadius: 5,
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: Colors.secondary,
  },
  introText: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});