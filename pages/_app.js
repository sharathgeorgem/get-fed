import React from 'react'
import App, { Container } from 'next/app'
// import Head from 'next/head'
import UserContextProvider from '../Components/Context/UserContextProvider'
import CartContextProvider from '../Components/Context/CartContextProvider'
// import compose from 'recompose'
import Layout from '../Components/Layout'

export default class MyApp extends App {
  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <React.Fragment>
        <Container>
          <UserContextProvider>
            <CartContextProvider>
              <Layout {...pageProps}>
                <Component {...pageProps} />
              </Layout>
            </CartContextProvider>
          </UserContextProvider>
          <style jsx global>
            {`
              a {
                color: white !important;
              }
              a:link {
                text-decoration: none !important;
                color: white !important;
              }
              a:hover {
                color: white;
              }
              .card {
                display: inline-block !important;
              }
              .card-columns {
                column-count: 3;
              }
              body {
                background-color: orange;
              }
            `}
          </style>
        </Container>
      </React.Fragment>
    )
  }
}
