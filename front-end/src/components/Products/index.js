import { Component } from "react";

import { Audio } from "react-loader-spinner";
import ProductCard from "../ProductCard";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class Products extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 0,
    discount: 0,
  };

  componentDidMount() {
    this.getProducts();
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    });
    const apiUrl = `https://a1-crackers-backend-production.up.railway.app/products`;
    const options = {
      method: "GET",
    };
    const response = await fetch(apiUrl, options);
    if (response.ok) {
      const fetchedData = await response.json();
      console.log(fetchedData);
      const updatedData = fetchedData.map((product) => ({
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        quantity: 0,
      }));
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  calculateTotal = () => {
    const { productsList } = this.state;
    return productsList.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  updateTotalQuantity = (productId, newQuantity) => {
    const { productsList } = this.state;

    // Update the quantity for the specific product
    const updatedProducts = productsList.map((product) => {
      if (product.id === productId) {
        return { ...product, quantity: parseInt(newQuantity, 10) || 0 }; // Parse as integer, default to 0 if NaN
      }
      return product;
    });

    this.setState({
      productsList: updatedProducts,
    });
  };

  updateDiscount = (newDiscount) => {
    this.setState({ discount: parseInt(newDiscount, 10) || 0 });
  };

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://sitechecker.pro/wp-content/uploads/2023/06/404-status-code.png"
        alt="products failure"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  renderProductsListView = () => {
    const { productsList, discount } = this.state;
    const selectedProducts = productsList.filter(
      (product) => product.quantity > 0
    );
    const totalCost = this.calculateTotal();
    const netAmount = totalCost - discount;

    return (
      <div>
        <div class="row table-container">
          <h1 className="heading">A1 Crackers</h1>
          <div class="col-md-12 ">
            <label>
              Customer Name:
              <input type="text" />
            </label>
            <p>Total Cost: {totalCost}</p>
            <label>
              Discount:
              <input
                type="text"
                value={discount}
                onChange={(e) => this.updateDiscount(e.target.value)}
              />
            </label>
            <p>Net Amount: {netAmount >= 0 ? netAmount : 0}</p>
            <button onClick={this.showSelectedItems}>Purchased Items</button>
            <table>
              <thead className="table-heading">
                <th className="table-head">Code</th>
                <th className="table-head">Name</th>
                <th className="table-head">Quantity</th>
                <th className="table-head">Price</th>
                <th className="table-head">Total</th>
              </thead>
              {/* Render selected items */}
              {selectedProducts.map((product) => (
                <tr className="table-row" key={product.id}>
                  <td className="table-data">{product.title}</td>
                  <td className="table-data">{product.quantity}</td>
                  <td className="table-data">{product.price}</td>
                  <td className="table-data">
                    {product.price * product.quantity}
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
        <ul className="products-list">
          {productsList.map((product) => (
            <ProductCard
              productData={product}
              key={product.id}
              updateTotalQuantity={this.updateTotalQuantity}
            />
          ))}
        </ul>
      </div>
    );
  };

  // Function to calculate total for selected items
  calculateSelectedTotal = () => {
    const { productsList } = this.state;
    const selectedProducts = productsList.filter(
      (product) => product.quantity > 0
    );
    return selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  // Function to show selected items
  showSelectedItems = () => {
    const { productsList } = this.state;
    const selectedProducts = productsList.filter(
      (product) => product.quantity > 0
    );

    // Display total for selected items
    console.log(
      "Total Cost for Selected Items:",
      this.calculateSelectedTotal()
    );

    // Display list of selected items
    console.log("Selected Items:", selectedProducts);
  };

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Audio
        height="80"
        width="80"
        radius="9"
        color="green"
        ariaLabel="loading"
        wrapperStyle
        wrapperClass
      />
    </div>
  );

  renderAllProducts = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="all-products-section">{this.renderAllProducts()}</div>
    );
  }
}

export default Products;
