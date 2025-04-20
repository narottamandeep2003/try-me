import React, { Suspense } from 'react'
import ProductPage from './components/Product'

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductPage></ProductPage>
    </Suspense>
  )
}
