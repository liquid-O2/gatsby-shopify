import React, { useState } from "react"
import { GatsbyImage } from "gatsby-plugin-image"
const Product = ({ product, handleCheckout }) => {
  const [variantId, setVariantId] = useState(product.node.variants[0].shopifyId)
  const [price, setPrice] = useState(product.node.variants[0].price)

  return (
    <div className='product-card'>
      <figure className='product-card-image-wrapper'>
        <GatsbyImage image={product.node.featuredImage.gatsbyImageData} alt={product.node.title} className='product-card-image' />
      </figure>
      <article>
        <p className='product-card-header'>
          <span>{product.node.title}</span> <span>{`$${price} AUD`}</span>
        </p>
        <p className='product-card-description'>{product.node.description}</p>
        <div className='variant-pill-wrapper'>
          {product.node.variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => {
                setPrice(variant.price)
                setVariantId(variant.shopifyId)
              }}
              className={`variant-pill ${variantId === variant.shopifyId ? "active" : ""}`}>
              {variant.title}
            </button>
          ))}
        </div>
        <button onClick={() => handleCheckout(product.node.shopifyId, variantId)} className='product-card-button'>
          BUY NOW
        </button>
      </article>
    </div>
  )
}

export default Product
