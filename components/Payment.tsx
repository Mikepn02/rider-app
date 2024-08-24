import { View, Text, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { useStripe } from "@stripe/stripe-react-native";

const Payment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const initializePaymentSheet = async () => {
    try {
      const confirmHandler = async (paymentMethod: any, shouldSavePaymentMethod: any, intentCreationCallback: any) => {
        // Add logic for handling payment confirmation
      };

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        intentConfiguration: {
          mode: {
            amount: 1099,
            currencyCode: "USD",
          },
          confirmHandler: confirmHandler,
        },
      });

      if (error) {
        Alert.alert("Initialization Error", error.message);
        return;
      }
      setLoading(true);
    } catch (error: any) {
      Alert.alert("Initialization Error", error.message);
    }
  };

  const openPaymentSheet = async () => {
    setLoading(true);
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <CustomButton
        title="Confirm Ride"
        className="my-2"
        onPress={openPaymentSheet}
      />
      {success && <Text>Payment Successful!</Text>}
    </View>
  );
};

export default Payment;
