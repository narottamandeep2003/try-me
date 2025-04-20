import React, { Suspense } from 'react'
import ProductsPage from './components/ProductsPage'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ProductsPage></ProductsPage>
    </Suspense>
  )
}
