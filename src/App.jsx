import { Box, SimpleGrid, Button, Text, VStack, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Card from './components/card/card';

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [victoryMessages, setVictoryMessages] = useState([]);
  const [victoryMessage, setVictoryMessage] = useState('');
  const [hasWon, setHasWon] = useState(false);
  const [centerCard, setCenterCard] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [showVictoryCard, setShowVictoryCard] = useState(true);
  // const [showMemoryTitle, setShowMemoryTitle] = useState(true);
  const [showTitle, setShowTitle] = useState(true);


  useEffect(() => {
    fetch('/backgrounds.json')
      .then(res => res.json())
      .then(data => {
        sessionStorage.setItem('backgrounds', JSON.stringify(data));
      });
  }, []);

  useEffect(() => {
    const storedBackgrounds = JSON.parse(sessionStorage.getItem('backgrounds') || '[]');

    if (storedBackgrounds.length > 0) {
      const randomIndex = Math.floor(Math.random() * storedBackgrounds.length);
      setBackgroundImage(storedBackgrounds[randomIndex]);
    } else {
      setBackgroundImage('/images/bg.jpg');
    }

    fetch('/victoryMessages.json')
      .then(res => res.json())
      .then(data => {
        setVictoryMessages(data);
        const duplicatedCards = data.flatMap(item => [
          { title: item.nom, description: item.condition_victoire, image: item.image },
          { title: item.nom, description: item.condition_victoire, image: item.image },
        ]);
        setCards(shuffleArray(duplicatedCards));
      });
  }, []);

  const handleFlip = (index) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index) ||
      hasWon
    ) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const isMatch = cards[first].title === cards[second].title;

      if (isMatch) {
        const message = victoryMessages.find(msg => msg.nom === cards[first].title)?.condition_victoire || '';
        setVictoryMessage(message);

        setTimeout(() => {
          setMatchedCards(prev => [...prev, first, second]);
          setFlippedCards([]);

          if (matchedCards.length + 2 === cards.length) {
            setCenterCard(cards[first]);
            setHasWon(true);
            setShowVictoryCard(true);
          }
        }, 2000);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const toggleVictoryCard = () => {
  setShowVictoryCard(prev => {
    const newState = !prev;
    setShowTitle(newState); // ✅ Sync title with victory card visibility
    return newState;
  });
  };

  const resetGame = () => {
  setCards(shuffleArray(cards));
  setFlippedCards([]);
  setMatchedCards([]);
  setVictoryMessage('');
  setHasWon(false);
  setCenterCard(null);
  setShowVictoryCard(true);
  setShowTitle(true); // ✅ Rétablit le titre

  const storedBackgrounds = JSON.parse(sessionStorage.getItem('backgrounds') || '[]');
  if (storedBackgrounds.length > 0) {
    const randomIndex = Math.floor(Math.random() * storedBackgrounds.length);
    setBackgroundImage(storedBackgrounds[randomIndex]);
  }
  };

  const isFlipped = (index) => flippedCards.includes(index) || matchedCards.includes(index);

  const handleGlobalClick = () => {
  if (hasWon) {
    toggleVictoryCard();  // bascule la carte victoire
    // setShowTitle(false);  // cache aussi le titre
  }
  };

  return (
    <Box
      // w="100vw"
      // h="100vh"
      // backgroundImage={`url(${backgroundImage})`}
      // backgroundPosition="center"
      // backgroundRepeat="no-repeat"
      // backgroundSize="cover"
      // overflow="hidden"
      // boxSizing="border-box"
      // onClick={hasWon ? handleGlobalClick : undefined}

  w="100vw"
  h="100vh"
  backgroundImage={`url(${backgroundImage})`}
  backgroundPosition="center"
  backgroundRepeat="no-repeat"
  backgroundSize={["contain", "contain", "contain", "contain"]} // reste contain partout
  backgroundColor="black"
  overflow="hidden"
  boxSizing="border-box"
  onClick={hasWon ? handleGlobalClick : undefined}
>


      
      {/* Bouton Rejouer */}
      <Box position="fixed" top="10px" left="10px" zIndex="1000">
        <Button
          onClick={(e) => {
            e.stopPropagation(); // ✅ Stoppe le clic ici
            resetGame();
          }}
          bg="black"
          color="red"
          border="2px solid gold"
          _hover={{ bg: "gray.800" }}
        >
          Rejouer
        </Button>

      </Box>

      {/* {TITRE} */}
      {showTitle && (
      <Box
        position="fixed"
        top="0px"
        left="50%"
        transform="translateX(-50%)"
        fontSize={["3xl", "4xl", "5xl", "6xl"]}  // Responsive: mobile → desktop
        // fontSize="6xl"
        fontWeight="bold"
        color="gold"
        textShadow="2px 2px 0 red, -2px -2px 0 red, 2px -2px 0 red, -2px 2px 0 red"
        cursor="pointer"
        zIndex="1000"
        maxW="90vw"            // Limite largeur max à 90% viewport width
        whiteSpace="nowrap"    // Empêche retour à la ligne
        onClick={() => setShowTitle(false)} // clique direct pour cacher le titre
        userSelect="none"
      >
        MEMORY GAME
      </Box>
      )}

     {/* Cartes et message */}
      <VStack spacing={4} p={6} justify="center" mt="60px" width="100%">
        {hasWon && showVictoryCard && (
          <Box
            bg="rgba(128, 128, 128, 0.9)" // gris transparent
            p={4}
            borderRadius="md"
            border="2px solid gold"
            width="100%"
            maxW="800px"
          >
            <Text
              fontSize="2xl"
              color="#FFD600"
              fontWeight="bold"
              textAlign="center"
              mt={4}
            >
              Ton Destin
              <br />
              {victoryMessage}
            </Text>
          </Box>
        )}

        <SimpleGrid columns={5} spacing={4} width="100%">
          {cards.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              // description={item.description}
              image={item.image}
              isFlipped={isFlipped(index)}
              onFlip={() => handleFlip(index)}
              opacity={matchedCards.includes(index) ? 0 : 1}
              pointerEvents={matchedCards.includes(index) ? 'none' : 'auto'}
              isMatched={matchedCards.includes(index)}
            />
          ))}
        </SimpleGrid>
      </VStack>

      {/* Carte de victoire centrale */}
      {/* {hasWon && centerCard && showVictoryCard && (
        <Box
          position="fixed"
          top="65%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="9999"
          bg="rgba(128, 128, 128, 0.9)"
          p={6}
          border="2px solid gold"
          borderRadius="lg"
          boxShadow="2xl"
          maxW={["90vw", "400px", "320px"]} // responsive max width
          width="100%"
          maxH={["auto", "350px", "300px"]} // responsive max height
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            textAlign="center"
            gap={4}
          >
            <Text fontSize={["lg", "xl", "2xl"]} color="#FFD700" fontWeight="bold">
              {centerCard.title}
            </Text>
            <Text fontSize={["sm", "md", "md"]} color="#FFD700">
              {centerCard.description}
            </Text>
            {centerCard.image && (
              <Image
                src={centerCard.image}
                alt={centerCard.title}
                boxSize={["100px", "130px", "150px"]} // responsive image size
                objectFit="cover"
                borderRadius="md"
              />
            )}
          </Box>
        </Box>
      )} */}

      {/* Carte de victoire centrale */}
{hasWon && centerCard && showVictoryCard && (
  <Box
    position="fixed"
    top="65%"
    left="50%"
    transform="translate(-50%, -50%)"
    zIndex="9999"
    bg="rgba(128, 128, 128, 0.9)"
    p={6}
    border="2px solid gold"
    borderRadius="lg"
    boxShadow="2xl"
    maxW={["90vw", "400px", "320px"]}
    width="100%"
    maxH={["auto", "350px", "300px"]}
  >
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      textAlign="center"
      gap={4}
    >
      <Text fontSize={["sm", "md", "2xl"]} color="#FFD700" fontWeight="bold">
        {centerCard.title}
      </Text>
      <Text fontSize={["xs", "sm", "md"]} color="#FFD700">
        {centerCard.description}
      </Text>
      {centerCard.image && (
        <Image
          src={centerCard.image}
          alt={centerCard.title}
          boxSize={["80px", "120px", "150px"]}
          objectFit="cover"
          borderRadius="md"
        />
      )}
    </Box>
  </Box>
)}

    </Box>
  );
};

export default App;
