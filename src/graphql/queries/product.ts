import { gql } from "@apollo/client";

// DO NOT COMMENT OR DELETE
// IT IS NEEDED FOR graphql-codegen
// export const GET_PRODUCT = gql`
//   query GetProduct($productId: ID!) {
//     product(id: $productId) {
//       data {
//         id
//         attributes {
//           part_number
//           title
//           retail
//           currency
//           image_link
//           description
//           discount
//           in_stock
//           slug
//           locale
//           additional_images {
//             id
//             link
//           }
//           product_parameters {
//             data {
//               id
//               attributes {
//                 parameter_value {
//                   data {
//                     id
//                     attributes {
//                       value
//                       code
//                       parameter_type {
//                         data {
//                           id
//                           attributes {
//                             name
//                             slug
//                           }
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//           subcategory {
//             data {
//               id
//               attributes {
//                 slug
//                 locale
//               }
//             }
//           }
//           category {
//             data {
//               id
//               attributes {
//                 slug
//                 locale
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug(
    $productSlug: String!
    $productTypeSlug: String!
    $locale: I18NLocaleCode!
  ) {
    products(filters: { slug: { eq: $productSlug } }, locale: $locale) {
      data {
        id
        attributes {
          part_number
          title
          retail
          currency
          image_link
          description
          discount
          in_stock
          slug
          locale
          langMatches
          additional_images {
            id
            link
          }
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
          subcategory {
            data {
              id
              attributes {
                slug
                locale
                title
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
          product_types(filters: { slug: { eq: $productTypeSlug } }) {
            data {
              id
              attributes {
                slug
                locale
                title
              }
            }
          }
        }
      }
    }
  }
`;
