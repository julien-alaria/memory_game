import { Box, Text, Image } from '@chakra-ui/react';

const Card = ({ title, description, image, isFlipped, onFlip, opacity = 1 }) => {
  return (
    <Box
      onClick={onFlip}
      perspective="1000px"
      cursor="pointer"
      width="100%"
      height="250px"
      opacity={opacity}
      transition="opacity 0.5s ease"
    >
      <Box
        position="relative"
        width="100%"
        height="100%"
        transformStyle="preserve-3d"
        transition="transform 0.6s"
        transform={isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}
      >
        {/* Face avant de la carte */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          backfaceVisibility="hidden"
          bg="gray.200"
          borderRadius="lg"
          boxShadow="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundImage="url(/images/back2.jpg)"
          backgroundSize="contain"
          backgroundPosition="center"
          border="2px solid gold"
        >
          <Text fontSize="2xl" color="gray.600">?</Text>
        </Box>

        {/* Face arrière de la carte */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          backfaceVisibility="hidden"
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          transform="rotateY(180deg)"
          overflow="hidden"
          border="2px solid gold"
        >
          {/* Image de fond */}
          {image && (
            <Image
              src={image}
              alt={title}
              width="100%"
              height="100%"
              objectFit="cover"
              position="absolute"
              top="0"
              left="0"
              zIndex="1"
            />
          )}

          {/* Superposition du texte */}
          <Box
            position="relative"
            zIndex="2"
            p={2}
            width="100%"
            textAlign="center"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
          >
            <Text fontSize="md" fontWeight="bold" color="#FFD700" mb={4}>
              {title}
            </Text>
            <Text fontSize="sm" mt="10px" color="#FFC107">
              {description}
            </Text>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default Card;