
import { Suspense } from 'react'
import OrderConfirmationPage from './components/OrderConfirmation'

export default function page() {
  return (
    <Suspense>
        <OrderConfirmationPage></OrderConfirmationPage>
    </Suspense>
  )
}
