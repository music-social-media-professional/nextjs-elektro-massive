import { gql } from "@apollo/client";

export const GET_BRANDS = gql`
  query GetBrands {
    brands {
      data {
        id
        attributes {
          title
          logo {
            data {
              id
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_BANNERS = gql`
  query GetBanners {
    banners(sort: "order:asc", filters: { isActive: { eq: true } }) {
      data {
        id
        attributes {
          title
          altText
          order
          image {
            data {
              id
              attributes {
                formats
                url
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query GetSearchProducts($searchTerm: String!, $locale: I18NLocaleCode!) {
    products(
      filters: {
        or: [
          { title: { containsi: $searchTerm } }
          { part_number: { containsi: $searchTerm } }
        ]
      }
      locale: $locale
    ) {
      data {
        id
        attributes {
          part_number
          title
          retail
          currency
          image_link
          slug
          product_parameters {
            data {
              id
              attributes {
                parameter_value {
                  data {
                    id
                    attributes {
                      value
                      code
                      parameter_type {
                        data {
                          id
                          attributes {
                            name
                            slug
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          additional_images {
            link
          }
          subcategory {
            data {
              id
              attributes {
                slug
                locale
                categories {
                  data {
                    id
                    attributes {
                      locale
                      slug
                      name
                    }
                  }
                }
              }
            }
          }
          product_types {
            data {
              id
              attributes {
                locale
                slug
              }
            }
          }
          discount
        }
      }
    }
  }
`;

export const GET_FILTER_URL_MAPPINGS = gql`
  query GetFilterUrlMappings {
    urlFilterMappings(pagination: { limit: -1 }) {
      data {
        id
        attributes {
          latin_key
          uk
          ru
        }
      }
    }
  }
`;
