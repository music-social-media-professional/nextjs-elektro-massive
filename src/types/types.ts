import {
  CartItemFieldsFragment,
  CartProductFieldsFragment,
  GetBannersQuery,
  GetBlogPostsQuery,
  GetBrandsQuery,
  GetCategoriesQuery,
  GetCategoryBySlugQuery,
  GetFilteredProductsQuery,
  GetHomePageProductsQuery,
  GetOrderByOrderNumberQuery,
  GetProductBySlugQuery,
  GetProductTypeBySlugQuery,
  GetShopReviewsQuery,
  GetSubcategoryBySlugQuery,
  GetUserCartQuery,
} from "@/gql/graphql";

export type ProductAttributes = NonNullable<
  NonNullable<
    NonNullable<GetProductBySlugQuery["products"]>["data"]
  >[0]["attributes"]
>;

export type ProductTypeBySlug = NonNullable<
  GetProductTypeBySlugQuery["productTypes"]
>["data"][number];

export type ProductData = NonNullable<
  NonNullable<GetProductBySlugQuery["products"]>["data"][number]
>;

export type FilteredProduct = NonNullable<
  NonNullable<GetFilteredProductsQuery["filteredProducts"]>["products"][number]
>;

export type CategoryData = NonNullable<
  NonNullable<GetCategoryBySlugQuery["categories"]>["data"][number]
>;

export type CategoriesData = NonNullable<
  NonNullable<GetCategoriesQuery["categories"]>["data"]
>;

export type SubcategoryData = NonNullable<
  NonNullable<GetSubcategoryBySlugQuery["subcategories"]>["data"][number]
>;

export type ProductTypeData = NonNullable<
  NonNullable<GetProductTypeBySlugQuery["productTypes"]>["data"][number]
>;

export type OrderAttributes = NonNullable<
  NonNullable<
    GetOrderByOrderNumberQuery["orders"]
  >["data"][number]["attributes"]
>;

export type HomePageProductEntity =
  | NonNullable<
      NonNullable<GetHomePageProductsQuery["topProducts"]>["data"][number]
    >
  | NonNullable<
      NonNullable<GetHomePageProductsQuery["newProducts"]>["data"][number]
    >
  | NonNullable<
      NonNullable<GetHomePageProductsQuery["saleProducts"]>["data"][number]
    >;

export type ShopReview = NonNullable<
  NonNullable<GetShopReviewsQuery["shopReviews"]>["data"][number]
>;

export type BannersData = NonNullable<
  NonNullable<GetBannersQuery["banners"]>["data"]
>;

export type BannerImage = NonNullable<
  NonNullable<GetBannersQuery["banners"]>["data"][number]["attributes"]
>["image"];

export type BlogMainImage = NonNullable<
  NonNullable<GetBlogPostsQuery["blogPosts"]>["data"][number]["attributes"]
>["image"];

export type BlogPost = NonNullable<
  NonNullable<GetBlogPostsQuery["blogPosts"]>["data"]
>[number];

export type CartProductType = Omit<
  CartProductFieldsFragment,
  "__typename" | " $fragmentName"
>;
export type CartItemType = Omit<
  CartItemFieldsFragment,
  "__typename" | " $fragmentName"
> & { product: CartProductType };

export type Brand = NonNullable<
  NonNullable<GetBrandsQuery["brands"]>["data"][number]
>;
