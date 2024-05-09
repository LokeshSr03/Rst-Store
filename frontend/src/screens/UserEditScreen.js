import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Spacer,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { updateUser, getUserById } from "../actions/userActions";
import {
  USER_BY_ID_RESET,
  USER_UPDATE_RESET,
} from "../constants/userConstants";
import FormContainer from "../components/FormContainer";

const UserEditScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const userById = useSelector((state) => state.userById);
  const { loading, user, error } = userById;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate(`/admin/userlist`);
      dispatch({ type: USER_BY_ID_RESET });
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserById(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, navigate, user, userId, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };
  return (
    <>
      <Link as={RouterLink} to="/admin/userlist">
        Go Back
      </Link>
      <Flex w="full" alignItems="center" justifyContent="center" py="5">
        <FormContainer>
          <Heading as="h1" mb="8" fontSize="3xl">
            Edit User
          </Heading>

          {loadingUpdate && <Loader />}
          {errorUpdate && <Message type="error">{errorUpdate}</Message>}

          {loading ? (
            <Loader />
          ) : error ? (
            <Message type="error">{error}</Message>
          ) : (
            <form onSubmit={submitHandler}>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <Spacer h="3" />

              <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <Spacer h="3" />

              <FormControl id="isAdmin">
                <FormLabel>Is Admin?</FormLabel>
                <Checkbox
                  size="lg"
                  colorScheme="teal"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                >
                  Is Admin?
                </Checkbox>
              </FormControl>
              <Spacer h="3" />

              <Button
                type="submit"
                isLoading={loading}
                colorScheme="teal"
                mt="4"
              >
                Update
              </Button>
            </form>
          )}
        </FormContainer>
      </Flex>
    </>
  );
};

export default UserEditScreen;
