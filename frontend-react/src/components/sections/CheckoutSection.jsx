import { useState } from "react";

import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useCart } from "../../context/CartContext";

import  { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export function CheckoutSection() {
  const { cartItems } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const stripe = useStripe();
  const elements = useElements();


  const submitOrder = async () => {
    const orderData = {
      customerName,
      phone,
      pickupDate: "2026-06-01",
      pickupTime: "6:30 PM",
      comments: "",
      items: cartItems,
    };

    const response = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.text();

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

    const result = await stripe.confirmCardPayment(
        data.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        }
    );

    if (result.error) {
        console.log(result.error.message);
    } else {
        if (result.paymentIntent.status === "succeeded") {
            console.log("PAYMENT SUCCESS");
            submitOrder();
        }
    }

    console.log(data.clientSecret);
  };

  const handleCheckout = async () => {
    createPaymentIntent();
  }

  return (
    <Box as="section" py={{ base: 12, md: 16 }} px={4} bg="bg" minH="100vh">
      <Container maxW="3xl">
        <VStack align="stretch" gap={8}>
          {/* TITLE */}
          <Heading size="2xl" fontWeight="bold">
            Checkout
          </Heading>

          {/* FORM CARD */}
          <Box
            bg="gray.300"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="border"
            boxShadow="sm"
            p={6}
          >
            <VStack align="stretch" gap={5}>
              {/* NAME */}
              <Box>
                <Text mb={2} fontWeight="medium">
                  Name
                </Text>

                <Input
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </Box>

              {/* PHONE */}
              <Box>
                <Text mb={2} fontWeight="medium">
                  Phone Number
                </Text>

                <Input
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Box>
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md">
                <CardElement/>
              </Box>
              
              
              {/* SUBMIT */}
              <Button
                colorScheme="green"
                size="lg"
                mt={4}
                onClick={handleCheckout}
              >
                Submit Order
              </Button>
              
              
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
