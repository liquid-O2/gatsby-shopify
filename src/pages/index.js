import * as React from "react"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import Client from "shopify-buy"

import Layout from "../components/layout"
import Seo from "../components/seo"
import fetch from "isomorphic-fetch"

const IndexPage = ({ data }) => {
  const products = data.products.edges
  let checkoutUrl = ""
  const button = document.querySelector(".product-card-button")
  const client = Client.buildClient(
    {
      domain: process.env.GATSBY_SHOPIFY_STORE_URL,
      storefrontAccessToken: process.env.GATSBY_STOREFRONT_ACCESS_TOKEN,
    },
    fetch
  )

  function handleCheckout(shopifyId) {
    client.product.fetch(shopifyId).then(product => {
      client.checkout.create().then(checkout => {
        const lineItemsToAdd = [
          {
            variantId: product.variants[0].id,
            quantity: 1,
          },
        ]

        client.checkout.addLineItems(checkout.id, lineItemsToAdd).then(checkout => {
          checkoutUrl = checkout.webUrl
          button.textContent = "Loading...."
          window.location.href = checkoutUrl
        })
      })
    })
  }

  return (
    <Layout>
      {products.map(product => (
        <div className='product-card'>
          <figure className='product-card-image-wrapper'>
            <GatsbyImage image={product.node.featuredImage.gatsbyImageData} alt={product.node.title} className='product-card-image' />
          </figure>
          <article>
            <p className='product-card-header'>
              <span>{product.node.title}</span> <span>{`$${product.node.priceRangeV2.maxVariantPrice.amount} AUD`}</span>
            </p>
            <p className='product-card-description'>{product.node.description}</p>
            <div className='variant-pill-wrapper'>
              {product.node.variants.map(variant => (
                <p className='variant-pill'>{variant.title}</p>
              ))}
            </div>

            <button onClick={() => handleCheckout(product.node.shopifyId)} className='product-card-button'>
              BUY NOW
            </button>
          </article>
        </div>
      ))}
    </Layout>
  )
}

export const Head = () => <Seo title='Home' />

export default IndexPage

export const query = graphql`
  query FetchProducts {
    products: allShopifyProduct {
      edges {
        node {
          featuredImage {
            gatsbyImageData
          }
          onlineStoreUrl
          shopifyId
          title
          totalInventory
          totalVariants
          priceRangeV2 {
            maxVariantPrice {
              amount
            }
          }
          description
          status
          variants {
            availableForSale
            price
            title
          }
        }
      }
    }
  }
`
