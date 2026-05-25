import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Badge,
  Box,
  Button,
  CloseButton,
  CollapsibleContent,
  CollapsibleRoot,
  Container,
  Dialog,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  FieldLabel,
  FieldRoot,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  Portal,
  SimpleGrid,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import {
  MdClose,
  MdList,
  MdPhotoCamera,
  MdPictureAsPdf,
  MdSearch,
} from "react-icons/md";
import { PiPepperLight } from "react-icons/pi";
import { MENU_SECTION_NOTES, MENU_SECTIONS } from "../../data/menuItems";
import { resolveMenuItemImage } from "../../utils/menuPhotos";

/**
 * English search aliases: `w/` ↔ "with", `&` ↔ "and" (menu copy uses shorthand).
 * Order: normalize `w/` before `&` so strings like "Beef & Ginger w/ …" stay correct.
 */
function normalizeEnglishForSearch(s) {
  return String(s)
    .toLowerCase()
    .replace(/\bw\/\s*/g, "with ")
    .replace(/\s*&\s*/g, " and ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Single-word queries that must not expand an entire section: `&` in titles becomes "and",
 * so e.g. "Western Chow Mein & Fried Rice" would otherwise match the query `and` and list every dish.
 */
const SECTION_TITLE_SINGLETON_STOPWORDS = new Set(["and", "or"]);

function isSingletonSectionTitleStopwordQuery(qNormEn) {
  const t = qNormEn.trim();
  if (!t) return true;
  const tokens = t.split(/\s+/);
  return tokens.length === 1 && SECTION_TITLE_SINGLETON_STOPWORDS.has(t);
}

function dinnerComboItemMatches(item, qNormEn, qRaw) {
  if (item.headlineZh?.includes(qRaw)) return true;
  if (
    item.headlineEn &&
    normalizeEnglishForSearch(item.headlineEn).includes(qNormEn)
  )
    return true;
  if (item.hintEn && normalizeEnglishForSearch(item.hintEn).includes(qNormEn))
    return true;
  if (item.price && normalizeEnglishForSearch(item.price).includes(qNormEn))
    return true;
  for (const opt of item.options || []) {
    if (opt.label && normalizeEnglishForSearch(opt.label).includes(qNormEn))
      return true;
    for (const line of opt.dishes || []) {
      if (normalizeEnglishForSearch(line).includes(qNormEn)) return true;
    }
  }
  for (const line of item.dishes || []) {
    if (normalizeEnglishForSearch(line).includes(qNormEn)) return true;
  }
  return false;
}

function itemMatchesQuery(item, qNormEn, qRaw) {
  if (item.type === "dinner_combo")
    return dinnerComboItemMatches(item, qNormEn, qRaw);
  if (item.en && normalizeEnglishForSearch(item.en).includes(qNormEn))
    return true;
  if (item.zh && item.zh.includes(qRaw)) return true;
  if (item.num && normalizeEnglishForSearch(String(item.num)).includes(qNormEn))
    return true;
  if (item.price && normalizeEnglishForSearch(item.price).includes(qNormEn))
    return true;
  return false;
}

function sectionTitleMatches(section, qNormEn, qRaw) {
  if (
    !isSingletonSectionTitleStopwordQuery(qNormEn) &&
    normalizeEnglishForSearch(section.titleEn).includes(qNormEn)
  ) {
    return true;
  }
  if (section.titleZh.includes(qRaw)) return true;
  return false;
}

function buildSearchResults(trimmed) {
  const qRaw = trimmed;
  const qNormEn = normalizeEnglishForSearch(trimmed);
  const out = [];
  for (const section of MENU_SECTIONS) {
    if (section.id === "dinner-combos") continue;
    const allInSection = sectionTitleMatches(section, qNormEn, qRaw);
    const items = allInSection
      ? section.items
      : section.items.filter((item) => itemMatchesQuery(item, qNormEn, qRaw));
    if (items.length) {
      out.push({ section, items });
    }
  }
  return out;
}

/** Ignore scroll-spy while smooth-scrolling after a nav click (avoids fighting `activeId`). */
const SCROLL_SPY_PAUSE_AFTER_NAV_MS = 1100;

/** Sticky menu toolbar offset below site header on md+; keep in sync with `#menu-sticky-toolbar` `top`. */
const MENU_STICKY_TOOLBAR_TOP_MD = "68px";
const MENU_STICKY_TOOLBAR_TOP_MD_PX = 68;

const SIDEBAR_NAV_EDGE_PAD = 8;

/** Scroll the desktop sections list so the active item stays visible; only mutates `containerEl.scrollTop`. */
function scrollSidebarNavToActiveItem(containerEl, itemEl) {
  if (!containerEl || !itemEl) return;
  const cRect = containerEl.getBoundingClientRect();
  const iRect = itemEl.getBoundingClientRect();
  const pad = SIDEBAR_NAV_EDGE_PAD;
  const visibleTop = cRect.top + pad;
  const visibleBottom = cRect.bottom - pad;
  if (iRect.top >= visibleTop && iRect.bottom <= visibleBottom) return;

  const cH = containerEl.clientHeight;
  const scrollDelta = iRect.top + iRect.height / 2 - (cRect.top + cH / 2);
  const maxScroll = Math.max(0, containerEl.scrollHeight - cH);
  containerEl.scrollTop = Math.max(
    0,
    Math.min(maxScroll, containerEl.scrollTop + scrollDelta)
  );
}

/**
 * Center the active chip in the mobile horizontal strip. Only updates `stripEl.scrollLeft`.
 * Avoid `Element.scrollIntoView` here: it can scroll the window / wrong ancestor (notably under
 * `position: sticky`) and fight the user when scroll-spy updates while scrolling vertically.
 */
function scrollJumpStripToChip(stripEl, chipEl) {
  if (!stripEl || !chipEl) return;
  const sRect = stripEl.getBoundingClientRect();
  const cRect = chipEl.getBoundingClientRect();
  const pad = SIDEBAR_NAV_EDGE_PAD;
  const visibleLeft = sRect.left + pad;
  const visibleRight = sRect.right - pad;
  if (cRect.left >= visibleLeft && cRect.right <= visibleRight) return;

  const chipCenterX = cRect.left + cRect.width / 2;
  const stripMidX = sRect.left + sRect.width / 2;
  const scrollDelta = chipCenterX - stripMidX;
  const maxScroll = Math.max(0, stripEl.scrollWidth - stripEl.clientWidth);
  stripEl.scrollLeft = Math.max(
    0,
    Math.min(maxScroll, stripEl.scrollLeft + scrollDelta)
  );
}

const PRICE_SPLIT_RE = /\s*·\s*/;

const prefetchedMenuPhotoUrls = new Set();

/** Warm HTTP cache for dialog / expand photos before click (same URL as thumbnails). */
function prefetchMenuPhoto(url) {
  if (!url || prefetchedMenuPhotoUrls.has(url)) return;
  prefetchedMenuPhotoUrls.add(url);
  const img = new Image();
  img.src = url;
}

function splitMenuPriceRows(price) {
  if (typeof price !== "string") return [];
  return price
    .split(PRICE_SPLIT_RE)
    .map((s) => s.trim())
    .filter(Boolean);
}

function MenuItemCard({
  num,
  zh,
  en,
  price,
  spicy,
  imageSrc,
  imageAlt,
  showPhotoInline = false,
  hideChinese = false,
}) {
  const hasPhoto = Boolean(imageSrc && imageAlt);
  const [photoOpen, setPhotoOpen] = useState(false);
  const photoExpandInline =
    useBreakpointValue({ base: true, md: false }) ?? false;
  /** Close photos when crossing md so we never paint desktop Dialog open while mobile collapsible was open (avoids focus/portal freeze). */
  const prevPhotoExpandInlineRef = useRef(photoExpandInline);
  if (prevPhotoExpandInlineRef.current !== photoExpandInline) {
    prevPhotoExpandInlineRef.current = photoExpandInline;
    setPhotoOpen(false);
  }
  const priceRows = splitMenuPriceRows(price);
  const multiSizeLayout = priceRows.length > 1;
  const cameraBelowPricesMulti = multiSizeLayout && hasPhoto;

  const hideInlineThumb =
    showPhotoInline && hasPhoto && photoExpandInline && photoOpen;

  // cart button pop-up states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const activatePhoto = () => {
    if (!hasPhoto) return;
    if (photoExpandInline) setPhotoOpen((o) => !o);
    else setPhotoOpen(true);
  };
  //   const onPhotoKeyDown = (e) => {
  //     if (e.key === 'Enter' || e.key === ' ') {
  //       e.preventDefault()
  //       activatePhoto()
  //     }
  //   }
  return (
    <>
      <Box
        /* Disabled entire box as selection and reduced to single button within box */
        // cursor={hasPhoto ? 'pointer' : undefined}
        // onClick={hasPhoto ? activatePhoto : undefined}
        // onKeyDown={hasPhoto ? onPhotoKeyDown : undefined}
        // role={hasPhoto ? 'button' : undefined}
        // tabIndex={hasPhoto ? 0 : undefined}
        bg="bg"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border"
        p={{ base: 4, md: 4 }}
        h="full"
        display="flex"
        flexDirection="column"
        textAlign="left"
        w="full"
        transition={
          hasPhoto ? "border-color 0.2s ease, box-shadow 0.2s ease" : undefined
        }
        _hover={
          hasPhoto ? { borderColor: "green.200", boxShadow: "sm" } : undefined
        }
        onMouseEnter={hasPhoto ? () => prefetchMenuPhoto(imageSrc) : undefined}
        onFocus={hasPhoto ? () => prefetchMenuPhoto(imageSrc) : undefined}
        aria-expanded={hasPhoto && photoExpandInline ? photoOpen : undefined}
        aria-label={
          hasPhoto
            ? photoExpandInline
              ? `${photoOpen ? "Collapse" : "Expand"} photo of ${en}`
              : showPhotoInline
              ? `Enlarge photo of ${en}`
              : `View photo of ${en}`
            : undefined
        }
        _focusVisible={
          hasPhoto
            ? {
                outline: "2px solid",
                outlineColor: "green.600",
                outlineOffset: "2px",
              }
            : undefined
        }
      >
        {showPhotoInline && hasPhoto && !hideInlineThumb ? (
          <Box
            mb={3}
            mx={{ base: -4, md: -4 }}
            mt={{ base: -4, md: -4 }}
            borderTopRadius="lg"
            overflow="hidden"
            flexShrink={0}
            w="auto"
            lineHeight={0}
            bg="bg.muted"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              w="full"
              aspectRatio={4 / 3}
              objectFit="cover"
              maxH={{ base: "200px", sm: "220px", md: "240px" }}
              display="block"
              loading="lazy"
              decoding="async"
            />
          </Box>
        ) : null}
        {multiSizeLayout ? (
          <Flex
            justify="space-between"
            align="flex-start"
            gap={3}
            flexWrap="wrap"
          >
            <VStack align="flex-start" gap={1} flex="1" minW={0}>
              {num ? (
                <Badge
                  colorPalette="green"
                  variant="subtle"
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="md"
                >
                  #{num}
                </Badge>
              ) : null}
              <Flex
                align="center"
                justify="space-between"
                gap={2}
                w="full"
                minW={0}
              >
                <Box
                  fontWeight="semibold"
                  fontSize="md"
                  lineHeight="snug"
                  flex="1"
                  minW={0}
                >
                  <Text
                    as="span"
                    fontWeight="inherit"
                    fontSize="inherit"
                    lineHeight="inherit"
                  >
                    {en}
                  </Text>
                  {spicy ? (
                    <Box
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      ml={2}
                      color="green.700"
                      lineHeight={1}
                      aria-label="Spicy"
                      title="Spicy"
                      css={{
                        "& svg": {
                          display: "block",
                          transform: "translateY(0.14em)",
                        },
                      }}
                    >
                      <PiPepperLight size={18} aria-hidden />
                    </Box>
                  ) : null}
                </Box>
              </Flex>
              {!hideChinese ? (
                <Text
                  color="fg.muted"
                  fontSize="sm"
                  lineHeight="tall"
                  lang="zh-Hant"
                >
                  {zh}
                </Text>
              ) : null}
            </VStack>
            <VStack align="flex-end" gap={0.5} flexShrink={0}>
              {priceRows.map((line, rowIdx) => (
                <Text
                  key={rowIdx}
                  fontWeight="bold"
                  fontSize="sm"
                  color="green.800"
                  whiteSpace="nowrap"
                  lineHeight="short"
                >
                  {line}
                </Text>
              ))}
              {cameraBelowPricesMulti ? (
                <Box
                  as="span"
                  lineHeight={0}
                  flexShrink={0}
                  color="green.700"
                  pt={0.5}
                  aria-hidden
                >
                  <MdPhotoCamera size={17} />
                </Box>
              ) : null}
            </VStack>
          </Flex>
        ) : (
          <>
            <Flex
              align="center"
              justify="space-between"
              gap={3}
              mb={1}
              flexWrap="wrap"
            >
              {num ? (
                <Badge
                  colorPalette="green"
                  variant="subtle"
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="md"
                >
                  #{num}
                </Badge>
              ) : null}
              <Text
                fontWeight="bold"
                fontSize="sm"
                color="green.800"
                flexShrink={0}
                whiteSpace="nowrap"
                ml="auto"
              >
                {price}
              </Text>
            </Flex>
            <Flex
              align="center"
              justify="space-between"
              gap={2}
              w="full"
              minW={0}
            >
              <Box
                fontWeight="semibold"
                fontSize="md"
                lineHeight="snug"
                flex="1"
                minW={0}
              >
                <Text
                  as="span"
                  fontWeight="inherit"
                  fontSize="inherit"
                  lineHeight="inherit"
                >
                  {en}
                </Text>
                {spicy ? (
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    ml={2}
                    color="green.700"
                    lineHeight={1}
                    aria-label="Spicy"
                    title="Spicy"
                    css={{
                      "& svg": {
                        display: "block",
                        transform: "translateY(0.14em)",
                      },
                    }}
                  >
                    <PiPepperLight size={18} aria-hidden />
                  </Box>
                ) : null}
              </Box>

              {hasPhoto ? (
                <Box
                  as="span"
                  lineHeight={0}
                  flexShrink={0}
                  color="green.700"
                  aria-hidden
                >
                  <MdPhotoCamera size={17} />
                </Box>
              ) : null}
            </Flex>
            {!hideChinese ? (
              <Text
                color="fg.muted"
                fontSize="sm"
                mt={1}
                lineHeight="tall"
                lang="zh-Hant"
              >
                {zh}
              </Text>
            ) : null}
          </>
        )}
        <Flex mt={3} gap={2} wrap="wrap">
          <Button
            size="sm"
            onClick={() => {
              setSelectedItem(zh, en, price);
              setIsCartOpen(true);
            }}
          >
            Test Cart
          </Button>
          {hasPhoto && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                activatePhoto();
              }}
            >
              View Photo
            </Button>
          )}
        </Flex>

        <DialogRoot
          open={isCartOpen}
          onOpenChange={(details) => setIsCartOpen(details.open)}
        >
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Cart</DialogTitle>
                <DialogCloseTrigger
                  asChild
                  position="absolute"
                  top="2"
                  insetEnd="2"
                >
                  <IconButton
                    aria-label="Close photo"
                    variant="ghost"
                    size="sm"
                    colorPalette="gray"
                    minW="40px"
                    minH="40px"
                    borderRadius="md"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <Box as="span" lineHeight={0} aria-hidden>
                      <MdClose size={22} />
                    </Box>
                  </IconButton>
                </DialogCloseTrigger>
              </DialogHeader>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>

        {hasPhoto && photoExpandInline ? (
          <CollapsibleRoot
            open={photoOpen}
            onOpenChange={(d) => setPhotoOpen(d.open)}
            w="full"
          >
            <CollapsibleContent overflow="hidden">
              <Box
                mt={3}
                pt={3}
                mx={{ base: -4, md: 0 }}
                borderTopWidth="1px"
                borderTopColor="border"
                lineHeight={0}
                bg="bg.muted"
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  w="full"
                  display="block"
                  maxH="min(58dvh, 480px)"
                  objectFit="contain"
                  borderBottomRadius="md"
                  loading="lazy"
                  decoding="async"
                />
              </Box>
            </CollapsibleContent>
          </CollapsibleRoot>
        ) : null}
      </Box>

      {hasPhoto && !photoExpandInline ? (
        <DialogRoot open={photoOpen} onOpenChange={(e) => setPhotoOpen(e.open)}>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent maxW="min(100vw - 2rem, 42rem)">
              <DialogHeader position="relative" pr={12}>
                <DialogTitle fontWeight="semibold" pr={2}>
                  {en}
                </DialogTitle>
                <DialogCloseTrigger
                  asChild
                  position="absolute"
                  top="2"
                  insetEnd="2"
                >
                  <IconButton
                    aria-label="Close photo"
                    variant="ghost"
                    size="sm"
                    colorPalette="gray"
                    minW="40px"
                    minH="40px"
                    borderRadius="md"
                  >
                    <Box as="span" lineHeight={0} aria-hidden>
                      <MdClose size={22} />
                    </Box>
                  </IconButton>
                </DialogCloseTrigger>
              </DialogHeader>
              <DialogBody pb={6}>
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  w="full"
                  borderRadius="md"
                  maxH="min(70vh, 520px)"
                  objectFit="contain"
                  bg="bg.muted"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="high"
                />
              </DialogBody>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      ) : null}
    </>
  );
}

function ComboDishList({ dishes, dense = false }) {
  return (
    <VStack
      as="ul"
      align="stretch"
      gap={dense ? 1.5 : 2.5}
      listStyleType="none"
      m={0}
      p={0}
    >
      {dishes.map((line, i) => (
        <Box
          as="li"
          key={i}
          display="flex"
          gap={dense ? 2 : 2.5}
          alignItems="flex-start"
        >
          <Text
            as="span"
            color="green.600"
            flexShrink={0}
            mt={dense ? 0 : 0.5}
            aria-hidden
            fontSize={dense ? "xs" : "sm"}
            lineHeight={dense ? 1.25 : undefined}
          >
            •
          </Text>
          <Text
            fontSize={dense ? "xs" : "sm"}
            lineHeight={dense ? "short" : "tall"}
            color="fg"
          >
            {line}
          </Text>
        </Box>
      ))}
    </VStack>
  );
}

/** One Style A/B card; entire box opens the photo dialog when a photo exists (camera icon is decorative). */
function DinnerComboStyleOption({ opt, headlineEn, dense, cardRadius }) {
  const hasPhoto = Boolean(opt.imageSrc && opt.imageAlt);
  const [photoOpen, setPhotoOpen] = useState(false);
  const isDesktop = useBreakpointValue({ base: false, md: true }) ?? false;
  const prevIsDesktopRef = useRef(isDesktop);
  if (prevIsDesktopRef.current !== isDesktop) {
    prevIsDesktopRef.current = isDesktop;
    setPhotoOpen(false);
  }
  const dialogTitle = `${headlineEn} — ${opt.label}`;
  const iconSize = dense ? 20 : 22;

  const openPhoto = () => {
    if (hasPhoto) setPhotoOpen(true);
  };
  const onKeyDown = (e) => {
    if (!hasPhoto) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPhoto();
    }
  };

  return (
    <Box
      bg="bg"
      borderRadius={cardRadius}
      borderWidth="1px"
      borderColor="border"
      boxShadow="sm"
      p={{ base: dense ? 3 : 5, md: dense ? 4 : 6 }}
      cursor={hasPhoto ? "pointer" : undefined}
      onClick={hasPhoto ? openPhoto : undefined}
      onMouseEnter={
        hasPhoto ? () => prefetchMenuPhoto(opt.imageSrc) : undefined
      }
      onFocus={hasPhoto ? () => prefetchMenuPhoto(opt.imageSrc) : undefined}
      onKeyDown={hasPhoto ? onKeyDown : undefined}
      role={hasPhoto ? "button" : undefined}
      tabIndex={hasPhoto ? 0 : undefined}
      aria-label={hasPhoto ? `View photo: ${dialogTitle}` : undefined}
      transition={
        hasPhoto ? "border-color 0.2s ease, box-shadow 0.2s ease" : undefined
      }
      _hover={
        hasPhoto ? { borderColor: "green.200", boxShadow: "md" } : undefined
      }
      _focusVisible={
        hasPhoto
          ? {
              outline: "2px solid",
              outlineColor: "green.600",
              outlineOffset: "2px",
            }
          : undefined
      }
    >
      <Flex
        align="center"
        justify="space-between"
        gap={2}
        mb={dense ? 2 : 4}
        w="full"
      >
        <Text
          fontWeight="bold"
          fontSize={dense ? "sm" : "lg"}
          textAlign="left"
          flex="1"
          minW={0}
          color="fg"
        >
          {opt.label}
        </Text>
        {hasPhoto ? (
          <Box flexShrink={0} lineHeight={0} color="green.700" aria-hidden>
            <MdPhotoCamera size={iconSize} />
          </Box>
        ) : null}
      </Flex>
      <ComboDishList dishes={opt.dishes} dense={dense} />
      {hasPhoto ? (
        <DialogRoot open={photoOpen} onOpenChange={(e) => setPhotoOpen(e.open)}>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent maxW="min(100vw - 2rem, 42rem)">
              <DialogHeader position="relative" pr={12}>
                <DialogTitle fontWeight="semibold" pr={2}>
                  {dialogTitle}
                </DialogTitle>
                <DialogCloseTrigger
                  asChild
                  position="absolute"
                  top="2"
                  insetEnd="2"
                >
                  <IconButton
                    aria-label="Close photo"
                    variant="ghost"
                    size="sm"
                    colorPalette="gray"
                    minW="40px"
                    minH="40px"
                    borderRadius="md"
                  >
                    <Box as="span" lineHeight={0} aria-hidden>
                      <MdClose size={22} />
                    </Box>
                  </IconButton>
                </DialogCloseTrigger>
              </DialogHeader>
              <DialogBody pb={6}>
                <Image
                  src={opt.imageSrc}
                  alt={opt.imageAlt}
                  w="full"
                  borderRadius="md"
                  maxH="min(70vh, 520px)"
                  objectFit="contain"
                  bg="bg.muted"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="high"
                />
              </DialogBody>
            </DialogContent>
          </DialogPositioner>
        </DialogRoot>
      ) : null}
    </Box>
  );
}

function DinnerComboCard({
  combo,
  compact = false,
  dense = false,
  hideChinese = false,
}) {
  const { headlineEn, headlineZh, price, hintEn, layout, options, dishes } =
    combo;
  const headingSize = compact || dense ? "sm" : "md";
  const priceSize = compact || dense ? "md" : "lg";
  const cardRadius = dense ? "md" : "lg";

  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius={cardRadius}
      overflow="hidden"
      bg="bg"
      boxShadow="sm"
      w="full"
    >
      <Flex
        bg="green.50"
        borderWidth="1px"
        borderColor="green.800"
        borderTopRadius={cardRadius}
        px={{ base: dense ? 3 : 4, md: dense ? 4 : 5 }}
        py={dense ? 2 : 3}
        justify="space-between"
        align="flex-start"
        gap={dense ? 2 : 3}
        flexWrap="wrap"
      >
        <VStack align="flex-start" gap={dense ? 0 : 0.5}>
          <Heading
            as="h4"
            size={headingSize}
            fontWeight="bold"
            lineHeight={dense ? "short" : undefined}
            color="green.900"
          >
            {headlineEn}
          </Heading>
          {!hideChinese ? (
            <Text
              fontSize={dense ? "xs" : "sm"}
              lang="zh-Hant"
              lineHeight={dense ? "short" : undefined}
              color="green.800"
            >
              {headlineZh}
            </Text>
          ) : null}
        </VStack>
        <Text
          fontWeight="bold"
          fontSize={priceSize}
          whiteSpace="nowrap"
          color="green.900"
        >
          {price}
        </Text>
      </Flex>
      <Box p={{ base: dense ? 3 : 4, md: dense ? 4 : 5 }}>
        {hintEn ? (
          <Text
            fontSize={dense ? "xs" : "sm"}
            color="fg.muted"
            mb={dense ? 2 : 4}
            fontWeight="medium"
            lineHeight={dense ? "short" : undefined}
          >
            {hintEn}
          </Text>
        ) : null}
        {layout === "fixed" ? (
          <ComboDishList dishes={dishes || []} dense={dense} />
        ) : (
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap={{ base: dense ? 2 : 3, md: dense ? 3 : 4 }}
          >
            {(options || []).map((opt) => (
              <DinnerComboStyleOption
                key={opt.label}
                opt={opt}
                headlineEn={headlineEn}
                dense={dense}
                cardRadius={cardRadius}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
}

function DinnerCombosColumn({ sectionId, items, hideChinese = false }) {
  const blocks = [];
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    if (item.type !== "dinner_combo") {
      const { imageSrc, imageAlt } = resolveMenuItemImage(sectionId, item);
      blocks.push(
        <MenuItemCard
          key={`${sectionId}-${item.num || "x"}-${i}`}
          num={item.num}
          zh={item.zh}
          en={item.en}
          price={item.price}
          spicy={item.spicy}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          hideChinese={hideChinese}
        />
      );
      i += 1;
      continue;
    }
    const next = items[i + 1];
    const pairFourSix =
      item.headlineEn === "Dinner For Four" &&
      next?.type === "dinner_combo" &&
      next.headlineEn === "Dinner For Six";
    if (pairFourSix) {
      blocks.push(
        <SimpleGrid
          key={`${sectionId}-dinner-four-six-${i}`}
          columns={{ base: 1, md: 2 }}
          gap={{ base: 4, md: 5 }}
          w="full"
          alignItems="stretch"
        >
          <DinnerComboCard combo={item} dense hideChinese={hideChinese} />
          <DinnerComboCard combo={next} dense hideChinese={hideChinese} />
        </SimpleGrid>
      );
      i += 2;
    } else {
      blocks.push(
        <DinnerComboCard
          key={`${sectionId}-dinner-${i}`}
          combo={item}
          dense
          hideChinese={hideChinese}
        />
      );
      i += 1;
    }
  }
  return (
    <VStack align="stretch" gap={{ base: 4, md: 5 }} w="full">
      {blocks}
    </VStack>
  );
}

/** Horizontal section labels (mobile only); list control opens a bottom sheet. Sticky chrome lives on the parent toolbar. */
function SectionJumpStrip({ activeSectionId, onPick, hideChinese = false }) {
  const [sectionsOpen, setSectionsOpen] = useState(false);

  /**
   * Call onPick immediately in the same event so React batches the drawer close + section pick
   * into a single render. The actual page scroll is deferred inside pickSection via queueMicrotask
   * so it always runs after Zag's scroll-lock cleanup microtask (child effects fire before parent
   * effects in React, so Zag's child-effect microtask is queued first and runs first — FIFO).
   */
  const pickFromDrawer = (id) => {
    setSectionsOpen(false);
    onPick(id);
  };

  return (
    <Box display={{ base: "block", md: "none" }}>
      <DrawerRoot
        open={sectionsOpen}
        restoreFocus={false}
        onOpenChange={(e) => setSectionsOpen(e.open)}
        placement="bottom"
      >
        <Flex align="stretch" gap={0} minH="40px" py={2.5}>
          <Box
            flexShrink={0}
            position="sticky"
            left={0}
            zIndex={2}
            display="flex"
            alignItems="center"
            alignSelf="stretch"
            bg="bg.subtle/95"
          >
            <DrawerTrigger asChild>
              <IconButton
                type="button"
                aria-label="View all menu sections"
                variant="ghost"
                colorPalette="gray"
                size="md"
                minW="44px"
                minH="44px"
                color="fg.muted"
                _hover={{ bg: "blackAlpha.50", color: "fg" }}
              >
                <Box as="span" lineHeight={0} aria-hidden>
                  <MdList size={22} />
                </Box>
              </IconButton>
            </DrawerTrigger>
          </Box>
          <Flex
            id="menu-jump-strip-inner"
            role="navigation"
            aria-label="Jump to menu section"
            align="center"
            gap={1}
            flex="1"
            minW={0}
            overflowX="auto"
            pb={0.5}
            css={{
              overscrollBehaviorX: "contain",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {MENU_SECTIONS.map((s) => {
              const selected = s.id === activeSectionId;
              return (
                <Button
                  key={s.id}
                  type="button"
                  data-menu-section-chip={s.id}
                  flexShrink={0}
                  size="sm"
                  variant="ghost"
                  colorPalette="gray"
                  borderWidth={0}
                  borderRadius="md"
                  position="relative"
                  px={3}
                  minH="40px"
                  whiteSpace="nowrap"
                  fontWeight={selected ? "semibold" : "medium"}
                  color={selected ? "black" : "fg.muted"}
                  _hover={{ bg: "blackAlpha.50" }}
                  css={
                    selected
                      ? {
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: "2px",
                            backgroundColor: "black",
                            borderRadius: "1px",
                          },
                        }
                      : undefined
                  }
                  aria-current={selected ? "true" : undefined}
                  title={
                    hideChinese ? s.titleEn : `${s.titleEn} · ${s.titleZh}`
                  }
                  onClick={() => onPick(s.id)}
                >
                  {s.titleEn}
                </Button>
              );
            })}
          </Flex>
        </Flex>

        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent
            maxH="85dvh"
            minH={0}
            borderTopRadius="xl"
            display="flex"
            flexDirection="column"
            overflow="hidden"
            css={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <DrawerHeader position="relative" pr={14} flexShrink={0}>
              <DrawerTitle fontWeight="bold">All sections</DrawerTitle>
              <DrawerCloseTrigger
                asChild
                position="absolute"
                top="3"
                insetEnd="3"
              >
                <CloseButton
                  size="md"
                  aria-label="Close sections list"
                  variant="ghost"
                  colorPalette="gray"
                />
              </DrawerCloseTrigger>
            </DrawerHeader>
            <DrawerBody
              flex="1"
              minH={0}
              overflowY="auto"
              pt={0}
              pb={20}
              css={{
                /* Large scrollable inset so the last row stays visible after rubber-band scroll and above rounded corners / home indicator. */
                paddingBottom:
                  "calc(4.5rem + env(safe-area-inset-bottom, 0px))",
                WebkitOverflowScrolling: "touch",
                overscrollBehaviorY: "contain",
              }}
            >
              <VStack
                as="ul"
                align="stretch"
                gap={0}
                listStyleType="none"
                m={0}
                p={0}
              >
                {MENU_SECTIONS.map((s) => {
                  const selected = s.id === activeSectionId;
                  return (
                    <Box key={s.id} as="li">
                      <Button
                        type="button"
                        variant="ghost"
                        colorPalette="gray"
                        justifyContent="flex-start"
                        textAlign="left"
                        h="auto"
                        minH="52px"
                        w="full"
                        py={3}
                        px={3}
                        borderRadius="md"
                        fontWeight="normal"
                        onClick={() => pickFromDrawer(s.id)}
                      >
                        <VStack align="start" gap={0.5} w="full">
                          <Text
                            fontSize="md"
                            fontWeight={selected ? "semibold" : "medium"}
                            color={selected ? "black" : "fg.muted"}
                          >
                            {s.titleEn}
                          </Text>
                          {!hideChinese ? (
                            <Text
                              fontSize="sm"
                              lineHeight="short"
                              color="fg.muted"
                              fontWeight="normal"
                              lang="zh-Hant"
                              opacity={selected ? 0.85 : 1}
                            >
                              {s.titleZh}
                            </Text>
                          ) : null}
                        </VStack>
                      </Button>
                    </Box>
                  );
                })}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </Box>
  );
}

function SectionNavList({ activeSectionId, onPick, hideChinese = false }) {
  return (
    <VStack
      align="stretch"
      gap={1}
      role="navigation"
      aria-label="Menu section categories"
    >
      {MENU_SECTIONS.map((s) => {
        const selected = s.id === activeSectionId;
        return (
          <Button
            key={s.id}
            type="button"
            data-menu-section-nav={s.id}
            aria-current={selected ? "true" : undefined}
            variant={selected ? "subtle" : "ghost"}
            colorPalette="green"
            justifyContent="flex-start"
            textAlign="left"
            h="auto"
            minH="44px"
            py={2.5}
            px={3}
            fontWeight={selected ? "semibold" : "medium"}
            borderLeftWidth="3px"
            borderLeftColor={selected ? "green.700" : "transparent"}
            rounded="md"
            onClick={() => onPick(s.id)}
          >
            <VStack align="start" gap={0.5} w="full">
              <Text fontSize="sm" lineHeight="short">
                {s.titleEn}
              </Text>
              {!hideChinese ? (
                <Text
                  fontSize="xs"
                  lineHeight="short"
                  color={selected ? "green.800" : "fg.muted"}
                  fontWeight="normal"
                  lang="zh-Hant"
                  opacity={selected ? 0.92 : 1}
                >
                  {s.titleZh}
                </Text>
              ) : null}
            </VStack>
          </Button>
        );
      })}
    </VStack>
  );
}

function MenuSectionPanel({ section, hideChinese = false }) {
  if (!section) {
    return null;
  }

  return (
    <Box
      id={`menu-${section.id}`}
      scrollMarginTop={{ base: "14rem", md: "10rem" }}
      w="full"
    >
      <Box
        bg="green.700"
        color="white"
        borderRadius="md"
        px={{ base: 4, md: 5 }}
        py={3}
        mb={4}
        boxShadow="sm"
      >
        <Heading as="h3" size="lg" fontWeight="bold">
          <Text as="span">{section.titleEn}</Text>
          {!hideChinese ? (
            <>
              <Text as="span" mx={2} opacity={0.85} aria-hidden>
                ·
              </Text>
              <Text as="span" lang="zh-Hant">
                {section.titleZh}
              </Text>
            </>
          ) : null}
        </Heading>
      </Box>

      {MENU_SECTION_NOTES[section.id] ? (
        <VStack align="stretch" gap={2} mb={4}>
          <Text fontSize="sm" color="fg.muted" fontStyle="italic">
            {MENU_SECTION_NOTES[section.id]}
          </Text>
        </VStack>
      ) : null}

      {section.id === "dinner-combos" ? (
        <DinnerCombosColumn
          sectionId={section.id}
          items={section.items}
          hideChinese={hideChinese}
        />
      ) : (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          gap={{ base: 2, md: 3, lg: 4 }}
        >
          {section.items.map((item, idx) => {
            const { imageSrc, imageAlt } = resolveMenuItemImage(
              section.id,
              item
            );
            return (
              <MenuItemCard
                key={`${section.id}-${item.num || "x"}-${idx}`}
                num={item.num}
                zh={item.zh}
                en={item.en}
                price={item.price}
                spicy={item.spicy}
                imageSrc={imageSrc}
                imageAlt={imageAlt}
                showPhotoInline={section.id === "highlights"}
                hideChinese={hideChinese}
              />
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
}

function menuSearchResultCells(section, items, hideChinese = false) {
  const cells = [];
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    if (section.id === "dinner-combos" && item.type === "dinner_combo") {
      const next = items[i + 1];
      const pairFourSix =
        item.headlineEn === "Dinner For Four" &&
        next?.type === "dinner_combo" &&
        next.headlineEn === "Dinner For Six";
      if (pairFourSix) {
        cells.push(
          <Box
            key={`search-${section.id}-dinner-four-six-${i}`}
            gridColumn={{ sm: "1 / -1" }}
            w="full"
          >
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              gap={{ base: 2, sm: 3, md: 4 }}
              alignItems="stretch"
            >
              <DinnerComboCard combo={item} compact hideChinese={hideChinese} />
              <DinnerComboCard combo={next} compact hideChinese={hideChinese} />
            </SimpleGrid>
          </Box>
        );
        i += 2;
        continue;
      }
    }
    if (item.type === "dinner_combo") {
      cells.push(
        <Box
          key={`search-${section.id}-dinner-${i}`}
          gridColumn={{ sm: "1 / -1" }}
          w="full"
        >
          <DinnerComboCard combo={item} compact hideChinese={hideChinese} />
        </Box>
      );
    } else {
      const { imageSrc, imageAlt } = resolveMenuItemImage(section.id, item);
      cells.push(
        <MenuItemCard
          key={`search-${section.id}-${item.num || "x"}-${i}`}
          num={item.num}
          zh={item.zh}
          en={item.en}
          price={item.price}
          spicy={item.spicy}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          showPhotoInline={section.id === "highlights"}
          hideChinese={hideChinese}
        />
      );
    }
    i += 1;
  }
  return cells;
}

function MenuSearchResultsPanel({ blocks, query, hideChinese = false }) {
  if (!blocks.length) {
    return (
      <Box
        borderRadius="md"
        borderWidth="1px"
        borderColor="border"
        bg="bg"
        px={4}
        py={8}
        textAlign="center"
      >
        <Text color="fg.muted" fontSize="md">
          No dishes match &ldquo;{query}&rdquo;. Try another name, menu number,
          or category.
        </Text>
      </Box>
    );
  }

  return (
    <VStack align="stretch" gap={{ base: 8, md: 10 }}>
      {blocks.map(({ section, items }) => (
        <Box key={section.id} scrollMarginTop={{ base: "14rem", md: "10rem" }}>
          <Flex
            align="baseline"
            flexWrap="wrap"
            gapX={2}
            gapY={1}
            mb={3}
            pb={2}
            borderBottomWidth="1px"
            borderColor="border"
          >
            <Heading as="h3" size="md" fontWeight="bold">
              {section.titleEn}
            </Heading>
            {!hideChinese ? (
              <Text fontSize="sm" color="fg.muted" lang="zh-Hant">
                {section.titleZh}
              </Text>
            ) : null}
          </Flex>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            gap={{ base: 2, md: 3, lg: 4 }}
          >
            {menuSearchResultCells(section, items, hideChinese)}
          </SimpleGrid>
        </Box>
      ))}
    </VStack>
  );
}

export function MenuSection({ hideChinese = false }) {
  const [activeId, setActiveId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const scrollSpySuspendedRef = useRef(false);
  const scrollSpyResumeTimerRef = useRef(null);

  /**
   * Scroll target set by pickSection. Consumed by the useEffect below.
   * Using a ref (not state) avoids an extra render; the effect is triggered via scrollNonce.
   */
  const pendingScrollIdRef = useRef(null);
  const [scrollNonce, setScrollNonce] = useState(0);
  const menuStickyToolbarRef = useRef(null);
  /** Header offset + sticky toolbar height (px); desktop sidebar `top` / `maxH` so nav clears the search bar. */
  const [desktopNavStickyInsetPx, setDesktopNavStickyInsetPx] = useState(null);

  const pauseScrollSpyAfterNav = useCallback(() => {
    scrollSpySuspendedRef.current = true;
    if (scrollSpyResumeTimerRef.current != null) {
      clearTimeout(scrollSpyResumeTimerRef.current);
    }
    scrollSpyResumeTimerRef.current = window.setTimeout(() => {
      scrollSpySuspendedRef.current = false;
      scrollSpyResumeTimerRef.current = null;
    }, SCROLL_SPY_PAUSE_AFTER_NAV_MS);
  }, []);

  const trimmedSearch = searchQuery.trim();
  const isSearching = trimmedSearch.length > 0;

  useEffect(() => {
    return () => {
      if (scrollSpyResumeTimerRef.current != null) {
        clearTimeout(scrollSpyResumeTimerRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const toolbar = menuStickyToolbarRef.current;
    if (!toolbar || typeof ResizeObserver === "undefined") return undefined;

    const mq = window.matchMedia("(min-width: 48em)");
    const update = () => {
      if (!mq.matches) {
        setDesktopNavStickyInsetPx(null);
        return;
      }
      setDesktopNavStickyInsetPx(
        MENU_STICKY_TOOLBAR_TOP_MD_PX + toolbar.offsetHeight
      );
    };

    const ro = new ResizeObserver(() => update());
    ro.observe(toolbar);
    mq.addEventListener("change", update);
    update();

    return () => {
      ro.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const applyHash = () => {
      const raw = window.location.hash?.replace(/^#/, "");
      if (raw && MENU_SECTIONS.some((s) => s.id === raw)) {
        setActiveId(raw);
        setSearchQuery("");
        const el = document.getElementById(`menu-${raw}`);
        if (el) {
          pauseScrollSpyAfterNav();
          requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: "auto", block: "start" });
          });
        }
      } else {
        setActiveId("");
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [pauseScrollSpyAfterNav]);

  /** Highlight the chip for whichever section has crossed below the sticky header + menu toolbar. */
  useEffect(() => {
    if (isSearching) return undefined;

    /** Viewport Y (px) at or below which the active section updates; derived from the sticky toolbar bottom edge. */
    const activationLinePx = () => {
      const el = menuStickyToolbarRef.current;
      if (el) {
        const bottom = el.getBoundingClientRect().bottom;
        if (Number.isFinite(bottom)) return Math.max(0, bottom);
      }
      return window.matchMedia("(max-width: 767px)").matches ? 252 : 152;
    };

    let rafId = 0;
    const tick = () => {
      rafId = 0;
      if (scrollSpySuspendedRef.current) return;
      const line = activationLinePx();
      let next = "";
      for (const s of MENU_SECTIONS) {
        const el = document.getElementById(`menu-${s.id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) next = s.id;
      }
      setActiveId((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isSearching]);

  /** Keep the active chip visible inside the horizontal strip (mobile only). */
  useLayoutEffect(() => {
    if (isSearching || !activeId) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const strip = document.getElementById("menu-jump-strip-inner");
    const chip = strip?.querySelector(`[data-menu-section-chip="${activeId}"]`);
    if (strip && chip) scrollJumpStripToChip(strip, chip);
  }, [activeId, isSearching]);

  /** Keep the active row visible inside the sticky sections sidebar (desktop only). */
  useLayoutEffect(() => {
    if (isSearching || !activeId) return;
    if (!window.matchMedia("(min-width: 48em)").matches) return;
    const scrollEl = document.getElementById("menu-sections-nav-scroll");
    const item = scrollEl?.querySelector(
      `[data-menu-section-nav="${activeId}"]`
    );
    if (scrollEl && item) scrollSidebarNavToActiveItem(scrollEl, item);
  }, [activeId, isSearching]);

  const searchBlocks = useMemo(
    () => (isSearching ? buildSearchResults(trimmedSearch) : []),
    [isSearching, trimmedSearch]
  );

  const searchResultCount = useMemo(
    () => searchBlocks.reduce((n, b) => n + b.items.length, 0),
    [searchBlocks]
  );

  /**
   * Perform the page scroll after effects have flushed.
   *
   * Why queueMicrotask instead of scrollIntoView directly:
   * When called from the bottom sheet, `setSectionsOpen(false)` and `pickSection(id)` are
   * batched into the same React render. Zag's scroll-lock cleanup runs inside a microtask that
   * is queued from a `useEffect` in the child SectionJumpStrip component. React runs child
   * effects before parent effects, so Zag's child-effect microtask is enqueued first.
   * Our parent-effect microtask is enqueued second — FIFO order ensures Zag's cleanup
   * (scroll-lock release + iOS scroll restore) finishes before we call scrollIntoView. Without
   * this, scrollIntoView can no-op because body scroll is still locked, or the iOS restore
   * undoes the jump.
   *
   * Desktop: temporarily forcing `scroll-behavior: auto` keeps the jump instant so it cannot be
   * cancelled by a concurrent smooth-scroll animation.
   * Mobile: use native smooth scrolling so section changes feel fluid (still no extra delays;
   * same microtask ordering as above).
   */
  useEffect(() => {
    if (!pendingScrollIdRef.current) return;
    const id = pendingScrollIdRef.current;
    pendingScrollIdRef.current = null;
    queueMicrotask(() => {
      const el = document.getElementById(`menu-${id}`);
      if (!el) return;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (isMobile) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const html = document.documentElement;
      html.style.scrollBehavior = "auto";
      el.scrollIntoView({ block: "start" });
      html.style.scrollBehavior = "";
    });
  }, [scrollNonce]);

  const pickSection = useCallback(
    (id) => {
      pauseScrollSpyAfterNav();
      pendingScrollIdRef.current = id;
      setActiveId(id);
      setSearchQuery("");
      window.history.replaceState(null, "", `#${id}`);
      setScrollNonce((n) => n + 1);
    },
    [pauseScrollSpyAfterNav]
  );

  const sectionNavActiveId = isSearching ? "" : activeId;

  return (
    <Box
      as="section"
      id="menu"
      scrollMarginTop="5rem"
      py={4}
      px={4}
      bg="bg.subtle"
    >
      <Container maxW="7xl">
        <VStack align="stretch" gap={{ base: 6, md: 8 }}>
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "flex-end" }}
            justify="space-between"
            gap={4}
          >
            <Box>
              <Heading as="h2" size="2xl" fontWeight="bold">
                Menu
              </Heading>
            </Box>
            <Button
              asChild
              size="lg"
              minH="48px"
              fontWeight="semibold"
              variant="outline"
              borderColor="green.700"
              color="green.700"
              bg="green.50"
              _hover={{
                bg: "green.100",
                borderColor: "green.800",
                color: "green.800",
              }}
              alignSelf={{ base: "stretch", md: "center" }}
            >
              <Box
                as="a"
                href="/bamboo-menu.pdf"
                target="_blank"
                rel="noopener noreferrer"
                display="inline-flex"
                alignItems="center"
                gap={2}
              >
                <Box as="span" lineHeight={0} aria-hidden>
                  <MdPictureAsPdf size={20} />
                </Box>
                View Full Menu
              </Box>
            </Button>
          </Flex>

          <Box
            ref={menuStickyToolbarRef}
            id="menu-sticky-toolbar"
            position="sticky"
            zIndex={11}
            top={{ base: "52px", md: MENU_STICKY_TOOLBAR_TOP_MD }}
            mx={{ base: -8, md: 0 }}
            px={{ base: 4, md: 0 }}
            pt={{ base: 2, md: 2 }}
            pb={{ base: 0, md: 2 }}
            bg="bg.subtle/95"
            backdropFilter="blur(10px)"
            borderBottomWidth="1px"
            borderColor="border"
          >
            <VStack align="stretch" gap={{ base: 1, md: 0 }}>
              <FieldRoot
                maxW={{ base: "full", md: "36rem" }}
                px={{ base: 4, md: 0 }}
              >
                <InputGroup
                  startElement={
                    <Box as="span" lineHeight={0} color="fg.muted" aria-hidden>
                      <MdSearch size={20} />
                    </Box>
                  }
                  endElement={
                    trimmedSearch ? (
                      <IconButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label="Clear search"
                        colorPalette="gray"
                        onClick={() => setSearchQuery("")}
                      >
                        <Box as="span" lineHeight={0} aria-hidden>
                          <MdClose size={20} />
                        </Box>
                      </IconButton>
                    ) : undefined
                  }
                >
                  <Input
                    id="menu-search-input"
                    placeholder="Search by dish name or menu number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                  />
                </InputGroup>
                {isSearching ? (
                  <Text
                    fontSize="sm"
                    color="fg.muted"
                    mt={2}
                    aria-live="polite"
                  >
                    {searchResultCount === 0
                      ? "No matches"
                      : `${searchResultCount} match${
                          searchResultCount === 1 ? "" : "es"
                        }`}
                  </Text>
                ) : null}
              </FieldRoot>

              <SectionJumpStrip
                activeSectionId={sectionNavActiveId}
                onPick={pickSection}
                hideChinese={hideChinese}
              />
            </VStack>
          </Box>

          <Flex
            align="flex-start"
            gap={{ base: 6, md: 10 }}
            direction={{ base: "column", md: "row" }}
            mx={{ base: -4, md: 0 }}
            px={{ base: 4, md: 0 }}
            pt={{ base: 4, md: 0 }}
          >
            <Box
              as="nav"
              display={{ base: "none", md: "flex" }}
              flexDirection="column"
              aria-label="Menu sections"
              position={{ md: "sticky" }}
              top={{
                md:
                  desktopNavStickyInsetPx != null
                    ? `${desktopNavStickyInsetPx}px`
                    : `calc(${MENU_STICKY_TOOLBAR_TOP_MD} + 4.5rem)`,
              }}
              alignSelf={{ md: "flex-start" }}
              maxH={{
                md:
                  desktopNavStickyInsetPx != null
                    ? `calc(100dvh - ${desktopNavStickyInsetPx}px - 1rem)`
                    : "calc(100dvh - 5rem)",
              }}
              minH={0}
              w="260px"
              flexShrink={0}
              borderRightWidth="1px"
              borderColor="border"
              pr={6}
              pb={{ md: 2 }}
            >
              <Text
                flexShrink={0}
                fontSize="sm"
                fontWeight="semibold"
                color="fg.muted"
                mb={3}
                mt={3}
              >
                Sections
              </Text>
              <Box
                id="menu-sections-nav-scroll"
                flex="1"
                minH={0}
                overflowY={{ md: "auto" }}
                overflowX="hidden"
                css={{
                  scrollbarWidth: "thin",
                  overscrollBehavior: "contain",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <SectionNavList
                  activeSectionId={sectionNavActiveId}
                  onPick={pickSection}
                  hideChinese={hideChinese}
                />
              </Box>
            </Box>

            <Box
              flex="1"
              minW={0}
              w={{ base: "full", md: "auto" }}
              id="menu-section-panel"
              aria-label={
                isSearching
                  ? `Search results for ${trimmedSearch}`
                  : "Full menu by section"
              }
            >
              {isSearching ? (
                <MenuSearchResultsPanel
                  blocks={searchBlocks}
                  query={trimmedSearch}
                  hideChinese={hideChinese}
                />
              ) : (
                <VStack align="stretch" gap={{ base: 10, md: 14 }} w="full">
                  {MENU_SECTIONS.map((section) => (
                    <MenuSectionPanel
                      key={section.id}
                      section={section}
                      hideChinese={hideChinese}
                    />
                  ))}
                </VStack>
              )}
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
}
