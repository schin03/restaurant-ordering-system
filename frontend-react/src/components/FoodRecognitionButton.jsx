import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Input,
} from '@chakra-ui/react'
import { MdCameraAlt, MdAdd } from 'react-icons/md'


export function FoodRecognitionButton() {
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(null)

  function handleImageUpload(e) {
    const file = e.target.files[0]

    if (file) {
      setImage(URL.createObjectURL(file))
    }
  }


  return (
    <>
      {/* Popup */}
      {open && (
        <Box
          position="fixed"
          bottom="100px"
          right="24px"
          w={{ base: "300px", md: "380px" }}
          bg="bg"
          borderWidth="1px"
          borderColor="border"
          borderRadius="lg"
          boxShadow="sm"
          p={6}
          zIndex={1000}
        >
          <VStack gap={5} align="stretch">

            <Text
              fontWeight="bold"
              fontSize="lg"
              textAlign="center"
            >
              Upload an image to find something similar in our menu
            </Text>


            {/* Upload Box */}
            <Box
              as="label"
              cursor="pointer"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor="gray.300"
              borderRadius="lg"
              h="220px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              _hover={{
                bg: "gray.50"
              }}
            >

              {image ? (
                <Box
                  as="img"
                  src={image}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              ) : (
                <VStack gap={3}>
                  <MdCameraAlt size={45}/>
                  <Text color="fg.muted">
                    Click to upload image
                  </Text>
                </VStack>
              )}


              <Input
                type="file"
                accept="image/*"
                display="none"
                onChange={handleImageUpload}
              />

            </Box>


            <Button
              bg="green.700"
              color="white"
              fontWeight="semibold"
              _hover={{
                bg:"green.600"
              }}
              disabled={!image}
            >
              Find Similar Items
            </Button>

          </VStack>
        </Box>
      )}



      {/* Floating Button */}
      <Box
        position="fixed"
        bottom="24px"
        right="24px"
        zIndex={1001}
      >

        <Button
          onClick={() => setOpen(!open)}
          w="60px"
          h="60px"
          borderRadius="full"
          bg="green.700"
          color="white"
          boxShadow="lg"

          _hover={{
            bg:"green.600"
          }}

          group
        >

          <Box
            transition="transform .2s"
            _groupHover={{
              transform:"rotate(90deg)"
            }}
          >

            {open ? (
              <MdAdd size={30}/>
            ) : (
              <MdCameraAlt size={28}/>
            )}

          </Box>

        </Button>

      </Box>

    </>
  )
}