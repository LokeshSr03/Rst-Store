import { Box, Flex, Heading, Image, Link, Text, Icon } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Rating from "./Rating";
import { FaRupeeSign } from "react-icons/fa";

const ProductCard = ({ product }) => {
  return (
    <Link
      href={`/product/${product._id}`}
      _hover={{ textDecor: "none" }}
      mb="4"
    >
      <Box
        color="gray.200"
        borderRadius="lg"
        _hover={{ shadow: "md" }}
        w="18rem"
        h="29rem"
      >
        <Image
          src={product.image}
          alt={product.name}
          borderTopLeftRadius="10"
          borderTopRightRadius="10"
          objectFit="cover"
          w="18rem"
          h="24rem"
        ></Image>
        <Flex
          direction="column"
          justifyContent="space-between"
          py="5"
          px="4"
          h="6"
        >
          <Text
            fontSize="16"
            fontWeight="medium"
            color="gray.700"
            fontFamily="sans-serif"
            mt="-1"
          >
            {product.name}
          </Text>
          <Flex justifyContent="space-between" alignItems="center">
            <Rating value={product.rating} />
            <Text
              fontSize="17"
              color="gray.700"
              fontWeight="bold"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Icon as={FaRupeeSign}></Icon>
              {product.price}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Link>
  );
};

export default ProductCard;
