import { useContext } from "react"
import Modal from "./UI/Modal"
import CartContext from "../store/CartContext"
import { currencyFormatter } from "../utils/formatting"
import Input from "./UI/Input"
import Button from "./UI/Button"
import UserProgressContext from "../store/UserProgressContext"

export default function Checkout() {
  const cartCtx = useContext(CartContext)
  const userProgressCtx = useContext(UserProgressContext)

  const totalAmount = cartCtx.items.reduce((total, item) => total + item.quantity * item.price, 0)

  function handleClose() {
    userProgressCtx.hideCheckout()
  }

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const customerData = Object.fromEntries(formData.entries())

    fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData
        }
      })
    })
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

      <p className="modal-actions">
        <Button type="button" textOnly onClick={handleClose}>Close</Button>
        <Button>Submit Order</Button>
      </p>

    </form>
  </Modal>
}