import React from 'react'
import App, { Container } from 'next/app'
// import Head from 'next/head'
import ItemsContextProvider from '../Components/Context/ItemsContextProvider'
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
          <ItemsContextProvider>
            <Layout {...pageProps}>
              <Component {...pageProps} />
            </Layout>
          </ItemsContextProvider>
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
            `}
          </style>
        </Container>
      </React.Fragment>
    )
  }
}
