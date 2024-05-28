import axios from "axios";
import React, { useContext } from "react";
import { useEffect, useReducer } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useParams } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Rating from "../Components/Rating";
import Button from "react-bootstrap/esm/Button";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";
import {useNavigate} from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loaindg: false, error: action.payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  const navigate=useNavigate()
  const param = useParams();
  const { slug } = param;
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    product: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      //By using fetch method
      // const res=await fetch('/api/products');
      // const data=await res.json();

      //by using axios
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        // console.log(result.data);
        // setProducts(result.data);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);
  //useContext Hook
  const { state,dispatch:ctxdispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `/api/products/${product._id}`
    );
    if (data.countInStock < quantity) {
      window.alert("Sorry This Product is Out of Stock!❤");
      return;
    }

    ctxdispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    navigate('/cart') ;
  };

  return loading ? (
    // <div>Loading...</div>
    <LoadingBox />
  ) : error ? (
    // <div>{error}</div>
    <MessageBox varient="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img className="img-large" src={product.image} alt={product.name} />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>
              Price:<strong>${product.price}</strong>
            </ListGroup.Item>
            <ListGroup.Item>Description:{product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stok</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;
