import { useContext } from "react"
import Modal from "./UI/Modal"
import CartContext from "../store/CartContext"
import { currencyFormatter } from "../utils/formatting"
import Input from "./UI/Input"
import Button from "./UI/Button"
import UserProgressContext from "../store/UserProgressContext"
import useHttp from "../hooks/useHttp"
import Error from "./Error"

const requestConfig = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

export default function Checkout() {
  const cartCtx = useContext(CartContext)
  const userProgressCtx = useContext(UserProgressContext)

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData
  } = useHttp('http://localhost:3000/orders', requestConfig)

  const totalAmount = cartCtx.items.reduce((total, item) => total + item.quantity * item.price, 0)

  function handleClose() {
    userProgressCtx.hideCheckout()
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart()
    clearData()
  }

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const customerData = Object.fromEntries(formData.entries())

    sendRequest(JSON.stringify({
      order: {
        items: cartCtx.items,
        customer: customerData
      }
    }))
  }

  if (data && !error) {
    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <h2>Success!</h2>
      <p>Your order was submitted successfully.</p>
      <p>We will get back to you with more details via email within the next few minutes.</p>
      <p className="modal-actions">
        <Button onClick={handleFinish}>Okay</Button>
      </p>
    </Modal>
  }

  return <Modal
    open={userProgressCtx.progress === 'checkout'}
    onClose={handleClose}
  >
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <p>Total Amount: {currencyFormatter.format(totalAmount)}</p>

      <Input label="Full Name" type="text" required id="name" />
      <Input label="E-mail Address" type="email" required id="email" />
      <Input label="Street" type="text" required id="street" />

      <div className="control-row">
        <Input label="Postal Code" type="text" required id="postal-code" />
        <Input label="City" type="text" required id="city" />
      </div>

      {error && <Error title="Failed to submit order" message={error} />}
      <p className="modal-actions">

        {isSending && <span>Sending order data...</span>}

        {!isSending && (<>
          <Button type="button" textOnly onClick={handleClose}>Close</Button>
          <Button>Submit Order</Button>
        </>)}
      </p>

    </form>
  </Modal>
}