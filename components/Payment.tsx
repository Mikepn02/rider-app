import { View, Text, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import { useStripe } from "@stripe/stripe-react-native";
import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";

const Payment = ({fullName , email ,amount , driverId , rideTime} : PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const initializePaymentSheet = async () => {
    try {
      const confirmHandler = async (paymentMethod: any, shouldSavePaymentMethod: any, intentCreationCallback: any) => {
        const { paymentIntent , customer} = await fetchAPI("/(api)/(create)/create", {
          method: "POST",
          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            name: fullName || email.split("@")[0].slice(0,7),
            email: email,
            amount: amount,
            paymentMethodId: paymentMethod.id
          })
        })

        if(paymentIntent.client_secret){
          const { result } = await fetchAPI("/(api)/(stripe)/pay", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              payment_method_id: paymentMethod.id,
              payment_intent_id: paymentIntent.id,
              customer_id: customer
            })
          })
          if(result.client_secret){
            
          }
        }
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
