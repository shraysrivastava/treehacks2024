import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { signOutUser } from "../../../firebase/auth";
import { auth } from "../../../firebase/firebase";
import {
  DocumentData,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { Colors } from "../../../constants/Colors";

export const ProfileHome = () => {
  const [error, setError] = useState("");
  const [studentData, setStudentData] = useState<DocumentData>();
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    

    fetchStudentData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStudentData().finally(() => setRefreshing(false));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
          progressBackgroundColor="#ffffff"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile Home</Text>
      </View>
      {studentData && (
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{studentData.name}</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{studentData.email}</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Account Type:</Text>
            <Text style={styles.value}>{studentData.accountType}</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Wallet ID:</Text>
            <Text style={styles.value}>{studentData.walletID?.substring(0, 15)}</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Points:</Text>
            <Text style={styles.value}>
              {studentData?.points ? studentData.points : 0}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={() => signOutUser(setError)}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.collectionHeader}>
        <Text style={styles.headerText}>My Collection</Text>
      </View>
      <View style={styles.imagesContainer}>
        {studentData &&
          studentData.wallet.map((item: any, index: any) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.walletImage} />
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.secondary,
  },
  userInfoContainer: {
    width: "90%",
    backgroundColor: Colors.lightgray,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.secondary,
  },
  value: {
    fontSize: 16,
    color: Colors.primary,
  },
  logoutButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.accent2,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  collectionHeader: {
    marginBottom: 20,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  imageContainer: {
    width: 150,
    height: 150,
    margin: 5,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  walletImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});