import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdCameraAlt, MdAdd, MdClose } from "react-icons/md";
import { MENU_SECTIONS } from "../data/menuItems";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:8080";

const ALL_MENU_ITEMS = MENU_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    sectionId: section.id,
    sectionTitle: section.titleEn,
  }))
);

export function FoodRecognitionButton() {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (file) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
      setRecommendations([]);
      setError("");
    }
  }

  async function handleRecognizeFood() {
    if (!image?.file) return;

    const formData = new FormData();
    formData.append("image", image.file);

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/recognizeFood`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Food recognition failed");
      }

      const recommendedIds = await response.json();

      const matchingItems = recommendedIds
        .map(Number)
        .map((id) => ALL_MENU_ITEMS.find((item) => Number(item.num) === id))
        .filter(Boolean)
        .slice(0, 3);

      setRecommendations(matchingItems);

      if (matchingItems.length === 0) {
        setError("No matching menu items were found.");
      }
    } catch (recognitionError) {
      console.error(recognitionError);
      setError("Unable to find recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setRecommendations([]);
    setError("");
  }

  function handleViewMenuItem(item) {
    const targetId = `menu-item-${item.num}`;

    setOpen(false);

    // If already on /menu, scroll immediately.
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element.classList.add("menu-item-highlight");

      setTimeout(() => {
        element.classList.remove("menu-item-highlight");
      }, 1800);

      return;
    }

    // If on another page, navigate to MenuPage with the target hash.
    navigate(`/menu#${targetId}`);
  }
  return (
    <>
      {open && (
        <Box
          position="fixed"
          bottom="100px"
          right="24px"
          w={{ base: "calc(100vw - 48px)", md: "420px" }}
          maxH="calc(100vh - 130px)"
          overflowY="auto"
          bg="bg"
          borderWidth="1px"
          borderColor="border"
          borderRadius="lg"
          boxShadow="xl"
          p={6}
          zIndex={1000}
        >
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontWeight="bold" fontSize="lg">
              Find something similar
            </Text>

            <Button size="sm" variant="ghost" onClick={handleClose}>
              <MdClose />
            </Button>
          </Flex>

          <VStack gap={4} align="stretch">
            {!recommendations.length && (
              <Box
                as="label"
                cursor="pointer"
                borderWidth="2px"
                borderStyle="dashed"
                borderColor="gray.300"
                borderRadius="lg"
                h="180px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
              >
                {image ? (
                  <Image
                    src={image.preview}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    alt="Uploaded food"
                  />
                ) : (
                  <VStack gap={3}>
                    <MdCameraAlt size={42} />
                    <Text color="fg.muted">Click to upload an image</Text>
                  </VStack>
                )}

                <Input
                  type="file"
                  accept="image/*"
                  display="none"
                  onChange={handleImageUpload}
                />
              </Box>
            )}

            {!recommendations.length && (
              <Button
                bg="green.700"
                color="white"
                disabled={!image || loading}
                loading={loading}
                onClick={handleRecognizeFood}
                _hover={{ bg: "green.600" }}
              >
                {loading ? "Finding dishes..." : "Find Similar Items"}
              </Button>
            )}

            {error && (
              <Text color="red.500" textAlign="center">
                {error}
              </Text>
            )}

            {recommendations.length > 0 && (
              <>
                <Text fontWeight="semibold">Recommended dishes</Text>

                {recommendations.map((item) => (
                  <Box
                    key={item.num}
                    borderWidth="1px"
                    borderColor="border"
                    borderRadius="md"
                    overflow="hidden"
                  >
                    {item.imageSrc && (
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt || item.en}
                        w="100%"
                        h="130px"
                        objectFit="cover"
                      />
                    )}

                    <Box p={3}>
                      <Text fontWeight="bold">{item.en}</Text>
                      <Text fontSize="sm" color="fg.muted">
                        {item.zh}
                      </Text>
                      <Text mt={1}>{item.price}</Text>

                      <Flex gap={2} mt={3}>
                        <Button
                          size="sm"
                          flex={1}
                          bg="green.700"
                          color="white"
                          variant="outline"
                          onClick={() => handleViewMenuItem(item)}
                        >
                          View on Menu
                        </Button>
                      </Flex>
                    </Box>
                  </Box>
                ))}

                <Button
                  variant="outline"
                  onClick={() => {
                    setRecommendations([]);
                    setImage(null);
                  }}
                >
                  Try Another Image
                </Button>
              </>
            )}
          </VStack>
        </Box>
      )}

      <Box position="fixed" bottom="24px" right="24px" zIndex={1001}>
        <Button
          onClick={() => setOpen((previous) => !previous)}
          w="60px"
          h="60px"
          borderRadius="full"
          bg="green.700"
          color="white"
          boxShadow="lg"
          _hover={{ bg: "green.600" }}
        >
          {open ? <MdAdd size={30} /> : <MdCameraAlt size={28} />}
        </Button>
      </Box>
    </>
  );
}
