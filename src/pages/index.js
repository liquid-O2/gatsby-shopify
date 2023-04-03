import React, { useState } from "react"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import Client from "shopify-buy"

import Layout from "../components/layout"
import Seo from "../components/seo"
import fetch from "isomorphic-fetch"
import Product from "../components/product"

const IndexPage = ({ data }) => {
  const products = data.products.edges

  const client = Client.buildClient(
    {
      domain: process.env.GATSBY_SHOPIFY_STORE_URL,
      storefrontAccessToken: process.env.GATSBY_STOREFRONT_ACCESS_TOKEN,
    },
    fetch
  )

  function handleCheckout(shopifyId, variantId) {
    client.product.fetch(shopifyId).then(product => {
      client.checkout.create().then(checkout => {
        const lineItemsToAdd = [
          {
            variantId: variantId,
            quantity: 1,
          },
        ]
        client.checkout.addLineItems(checkout.id, lineItemsToAdd).then(checkout => {
          const checkoutUrl = checkout.webUrl
          window.location.href = checkoutUrl
        })
      })
    })
  }

  return (
    <Layout>
      {products.map(product => (
        <Product key={product.node.shopifyId} product={product} handleCheckout={handleCheckout} />
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
            id
            shopifyId
          }
        }
      }
    }
  }
`
