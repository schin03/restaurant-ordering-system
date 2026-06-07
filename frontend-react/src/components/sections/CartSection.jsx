import {
  Box,
  Container,
  Flex,
  Heading,
  Separator,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";

import { useCart } from "../../context/CartContext";

export function CartSection() {
  const { cartItems, incrementQuantity, decrementQuantity } = useCart();
  

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  

  return (
    <Box as="section" py={{ base: 12, md: 16 }} px={4} bg="bg" minH="100vh">
      <Container maxW="5xl">
        <VStack align="stretch" gap={8}>
          <Heading size="2xl" fontWeight="bold">
            Your Cart
          </Heading>
          {cartItems.length === 0 ? (
            <Flex w="100%" h="100%" align="center" justify="center">
              <Text fontSize="xl" textAlign="center">
                Your cart is empty
              </Text>
            </Flex>
          ) : (
            <Box
              bg="bg"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border"
              boxShadow="sm"
              overflow="hidden"
            >
              <VStack align="stretch" gap={0} separator={<Separator />}>
                {cartItems.map((item) => (
                  <Flex
                    key={item.menuItemId}
                    justify="space-between"
                    align="center"
                    p={5}
                    gap={4}
                  >
                    {/* LEFT SIDE */}
                    <Box>
                      <Text fontWeight="semibold" fontSize="lg">
                        {item.en}
                      </Text>

                      <Text color="fg.muted" fontSize="sm">
                        {item.size}
                      </Text>

                      <Text color="green.700" fontWeight="medium" mt={1}>
                        ${item.price.toFixed(2)}
                      </Text>
                    </Box>

                    {/* RIGHT SIDE */}
                    <Flex align="center" gap={3}>
                      <Button
                        size="sm"
                        onClick={() => decrementQuantity(item.menuItemId)}
                      >
                        -
                      </Button>

                      <Text minW="20px" textAlign="center">
                        {item.quantity}
                      </Text>

                      <Button
                        size="sm"
                        onClick={() => incrementQuantity(item.menuItemId)}
                        
                      >
                        +
                      </Button>
                    </Flex>
                  </Flex>
                ))}
              </VStack>
            </Box>
          )}
          {/* TOTAL */}
          <Flex justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold">
              Total
            </Text>

            <Text fontSize="2xl" fontWeight="bold" color="green.700">
              ${total.toFixed(2)}
            </Text>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}
