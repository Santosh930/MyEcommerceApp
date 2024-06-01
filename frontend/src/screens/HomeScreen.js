import React, { useEffect, useReducer } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


import axios from "axios";
import Product from "../Components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loaindg: false, error: action.payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  // const [products,setProducts]=useState([]);
  //by using use reducer
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error:"",
    products: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      //By using fetch method
      // const res=await fetch('/api/products');
      // const data=await res.json();

      //by using axios
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        // console.log(result.data);
        // setProducts(result.data);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>MyEcommerceApp</title>
      </Helmet>
      
      <h1>All Products</h1>
      <div className="products">
        {loading ? (
          // <div>Loading...</div>
          <LoadingBox/>
        ) : error ? (
          
          
          <MessageBox varient="danger" >{error}</MessageBox>
        ) : (
          <Row>
          {products.map((product) => (
            <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
              <Product product={product} />
            </Col>
          ))}
          </Row>
          )
          
        }
        
      </div>
    </div>
  );
};

export default HomeScreen;
