import { Box, HStack, IconButton, VStack } from "@chakra-ui/react";
import {
  MdHome,
  MdLocationOn,
  MdOutlineTakeoutDining,
  MdRestaurantMenu,
  MdShoppingCart,
} from "react-icons/md";
import { useCart } from "../context/CartContext";
import { Link as RouterLink, useLocation } from "react-router-dom";

const navLinkStyles = {
  px: 3,
  py: 2,
  borderRadius: "md",
  minH: "44px",
  display: "inline-flex",
  alignItems: "center",
  fontSize: "sm",
  fontWeight: "medium",
  color: "fg",
  transitionProperty: "background-color, color",
  transitionDuration: "0.2s",
  transitionTimingFunction: "ease",
  _hover: { bg: "bg.muted", color: "green.700" },
};

export function NavLinks({
  onNavigate,
  direction = "row",
  flexWrap,
  justifyContent,
}) {
  const Stack = direction === "row" ? HStack : VStack;
  const gap = direction === "row" ? 1 : 0;

  const link = (to, label, Icon) => (
    <Box
      key={to}
      as={RouterLink}
      to={to}
      onClick={onNavigate}
      {...navLinkStyles}
      w={direction === "column" ? "full" : undefined}
      justifyContent={direction === "column" ? "flex-start" : undefined}
    >
      {/* MOBILE (column): icon + text */}
      {direction === "column" && Icon ? (
        <HStack gap={3} w="full">
          <Box as="span" color="green.700" lineHeight={0} flexShrink={0}>
            <Icon size={22} />
          </Box>
          {label}
        </HStack>
      ) : (
        <>
          {/* DESKTOP SPECIAL CASE: cart icon only */}
          {to === "/cart" && Icon ? (
            <Box
              position="relative"
              display="inline-flex"
              as="span"
              lineHeight={0}
            >
              <Icon size={22} />
              {hasItems && !isCartPage && (
                <Box
                  position="absolute"
                  bottom="-2px"
                  right="-2px"
                  width="8px"
                  height="8px"
                  borderRadius="50%"
                  bg="green.500"
                />
              )}
            </Box>
          ) : (
            label
          )}
        </>
      )}
    </Box>
  );

  const { cartItems } = useCart();
  const hasItems = cartItems.length > 0;
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";
  
  return (
    <Stack
      gap={gap}
      align={direction === "column" ? "stretch" : "center"}
      justify={justifyContent}
      flexWrap={direction === "row" ? flexWrap : undefined}
    >
      {link("/#main", "Home", MdHome)}
      {link("/menu", "Menu", MdRestaurantMenu)}
      {link("/#order-options", "Order Options", MdOutlineTakeoutDining)}
      {link("/#location", "Location & Hours", MdLocationOn)}
      {link("/cart", "Cart", MdShoppingCart)}
    </Stack>
  );
}
