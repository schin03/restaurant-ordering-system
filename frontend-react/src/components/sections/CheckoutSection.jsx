import { useState } from "react";

import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  RadioGroup,
} from "@chakra-ui/react";

import { useCart } from "../../context/CartContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export function CheckoutSection() {
  const { cartItems } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [orderType, setOrderType] = useState("pickup"); // default is pickup
  const [pickupTime, setPickupTime] = useState("");
  const [address, setAddress] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  // format phone number to (123) 456-7890 format
  const handlePhoneNumber = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 10) value = value.slice(0, 10);

    if (value.length > 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }

    setPhone(value);
  };

  // check for inputs in checkout section boxes
  const validateCheckout = () => {
    if (!customerName || !phone || !email) return false;
    if (orderType === "pickup" && !pickupTime) return false;
    if (orderType === "delivery" && !address) return false;

    return true;
  };

  // send order to backend
  const submitOrder = async () => {
    const orderData = {
      customerName,
      phone,
      email,
      orderType,
      pickupTime: orderType === "pickup" ? pickupTime : null,
      address: orderType === "delivery" ? address : null,
      comments: "",
      items: cartItems,
    };

    const res = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result = await res.text();

    console.log(result);
  };

  const createPaymentIntent = async () => {
    const res = await fetch(
      "http://localhost:8080/api/payments/create-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
        }),
      }
    );

    const data = await res.json();

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.log(result.error.message);
    }

    if (result.paymentIntent.status === "succeeded") {
      console.log("PAYMENT SUCCESS");
      submitOrder();
    }
    console.log(data.clientSecret);
  };

  const handleCheckout = async () => {
    if (!validateCheckout()) {
      alert("Please fill out all fields");
      return;
    }

    createPaymentIntent();
  };

  return (
    <Box py={12} px={4}>
      <Container maxW="3xl">
        <VStack align="stretch" gap={6}>
          <Heading size="xl">Checkout</Heading>

          <Box bg="gray.300" p={6} borderRadius="lg">
            <VStack align="stretch" gap={4}>
              {/* NAME */}
              <Input
                placeholder="Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              {/* EMAIL */}
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* PHONE */}
              <Input
                placeholder="Phone Number"
                value={phone}
                onChange={handlePhoneNumber}
              />

              {/* ORDER TYPE */}
              <Box>
                <Text mb={2}>Order Type</Text>
                <RadioGroup.Root
                  value={orderType}
                  onValueChange={(e) => setOrderType(e.value)}
                >
                  <HStack gap={4}>
                    <RadioGroup.Item value="pickup">
                      <RadioGroup.ItemHiddenInput />

                      <RadioGroup.ItemIndicator
                        borderWidth="2px"
                        borderColor="green.700"
                        bg="white"
                        _checked={{
                          bg: "green.700",
                          borderColor: "green.700",
                        }}
                      />

                      <RadioGroup.ItemText>Pickup</RadioGroup.ItemText>
                    </RadioGroup.Item>

                    <RadioGroup.Item value="delivery">
                      <RadioGroup.ItemHiddenInput />

                      <RadioGroup.ItemIndicator
                        borderWidth="2px"
                        borderColor="green.700"
                        bg="white"
                        _checked={{
                          bg: "green.700",
                          borderColor: "green.700",
                        }}
                      />

                      <RadioGroup.ItemText>Delivery</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </HStack>
                </RadioGroup.Root>
              </Box>

              {/* CONDITIONAL FIELDS */}
              {orderType === "pickup" && (
                <Input
                  placeholder="Pickup Time (e.g. 6:30 PM)"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                />
              )}

              {orderType === "delivery" && (
                <Input
                  placeholder="Delivery Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              )}

              {/* STRIPE */}
              <Box p={4} borderWidth="1px" borderRadius="md">
                <CardElement />
              </Box>

              {/* SUBMIT */}
              <Button colorScheme="green" size="lg" onClick={handleCheckout}>
                Submit Order
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
