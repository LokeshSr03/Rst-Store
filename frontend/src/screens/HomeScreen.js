import { Grid, Heading, Divider } from "@chakra-ui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCard from "../components/ProductCard";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, products, error } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <>
      <Heading
        as="h2"
        fontSize="35"
        mb="8"
        fontWeight="bold"
        color="gray.700"
        mt="3"
      >
        Latest Products
        <Divider
          h="1.5"
          w="15rem"
          bgColor="red.500"
          mt="1"
          borderRadius="3"
          ml="2"
          mb="2"
          border="none"
        />
      </Heading>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <Grid templateColumns="1fr 1fr 1fr 1fr" gap="8">
          {products.map((prod) => {
            return <ProductCard key={prod._id} product={prod} />;
          })}
        </Grid>
      )}
    </>
  );
};

export default HomeScreen;
