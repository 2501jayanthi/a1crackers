import React, { useState } from "react";

import "./index.css";

const ProductCard = (props) => {
  const { productData } = props;
  const { id, title, price } = productData;

  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    props.updateTotalQuantity(productData.id, event.target.value);
  };

  const total = price * quantity;

  return (
    <li className="product-item">
      <div className="product-item-container">
        <h1 className="code">{id}</h1>
        <p className="title-heading">{title}</p>

        <form className="form-container">
          <label htmlFor="quantity"></label>
          <input
            type="number"
            className="input-style"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </form>

        <p className="price">{price}</p>
        <p className="price">{total}</p>
      </div>
    </li>
  );
};

export default ProductCard;
