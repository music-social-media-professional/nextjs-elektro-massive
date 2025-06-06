"use client";

import { fallbackLng, Language, prevLngCookieName } from "@/app/i18n/settings";

import {
  CLEAR_CART_MUTATION,
  GET_AUTH_USER_CART_QUERY,
  GET_PRODUCTS_BY_IDS_QUERY,
  REMOVE_FROM_CART_MUTATION,
  UPDATE_CART_ITEM_MUTATION,
} from "@/graphql/queries/cart";
import {
  GetProductsByIdsQuery,
  GetProductsByIdsQueryVariables,
  GetUserCartQuery,
  GetUserCartQueryVariables,
  RemoveFromCartMutation,
  RemoveFromCartMutationVariables,
  UpdateCartItemMutation,
  UpdateCartItemMutationVariables,
} from "@/gql/graphql";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import request from "graphql-request";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { CartItemType } from "@/types/types";
import { useSignInModal } from "@/store/useSignInModal";
import { useCartStore } from "@/store/useCartStore";
import { useModalStore } from "@/store/useModalStore";

interface CalculatedValues {
  total: number;
  discountTotal: number;
  itemCount: number;
}

export const fetchProductsByIds = async (ids: string[], locale: Language) => {
  return request<GetProductsByIdsQuery, GetProductsByIdsQueryVariables>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
    GET_PRODUCTS_BY_IDS_QUERY,
    {
      ids,
      locale,
    }
  );
};

export const useCart = () => {
  const { status } = useSession();
  const [cookies] = useCookies(["i18next", prevLngCookieName]);
  const currentLanguage = (cookies.i18next || fallbackLng) as Language;

  const queryClient = useQueryClient();

  const { productIds, addProduct, removeProduct, clearCart } = useCartStore();

  const { isModalOpen, closeModal } = useModalStore();

  const { openSignInModal } = useSignInModal();

  const [cartWorker, setCartWorker] = useState<Worker | null>(null);
  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    total: 0,
    discountTotal: 0,
    itemCount: 0,
  });

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newWorker = new Worker(
        new URL("@/workers/cartCalculationsWorker.ts", import.meta.url)
      );
      setCartWorker(newWorker);
      return () => {
        newWorker.terminate();
      };
    }
  }, []);

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["cart", status, productIds],
    queryFn: async () => {
      if (status === "authenticated") {
        const response = await request<
          GetUserCartQuery,
          GetUserCartQueryVariables
        >(
          `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
          GET_AUTH_USER_CART_QUERY,
          {
            locale: currentLanguage,
          }
        );

        return response.userCart?.cart.cart_items as CartItemType[];
      } else {
        const response = await request<
          GetProductsByIdsQuery,
          GetProductsByIdsQueryVariables
        >(
          `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
          GET_PRODUCTS_BY_IDS_QUERY,
          {
            ids: productIds.map((p) => p.productId),
            locale: currentLanguage,
          }
        );

        return productIds
          .map((item) => ({
            quantity: item.quantity,
            product: response.products?.data.find(
              (p) => p.id === item.productId
            )?.attributes,
          }))
          .filter((item): item is CartItemType => Boolean(item.product));
      }
    },
  });

  useEffect(() => {
    if (cartWorker) {
      cartWorker.postMessage({ cartItems });
      cartWorker.onmessage = (e) => {
        const { total, discountTotal, itemCount } = e.data;
        setCalculatedValues({ total, discountTotal, itemCount });
      };
    }
  }, [cartWorker, cartItems]);

  const updateCartItemMutation = useMutation<
    CartItemType[],
    Error,
    { product: CartItemType; qtyChange: number }
  >({
    mutationFn: async ({ product, qtyChange }) => {
      if (status === "authenticated") {
        console.log(`Product: `, JSON.stringify(product.product.id));
        const response = await request<
          UpdateCartItemMutation,
          UpdateCartItemMutationVariables
        >(
          `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
          UPDATE_CART_ITEM_MUTATION,
          {
            input: {
              productId: product.product.id,
              qtyChange: qtyChange,
            },
            locale: currentLanguage,
          }
        );

        return (response.updateCartItem?.cart.cart_items ||
          []) as CartItemType[];
      } else {
        addProduct(product.product.id, qtyChange);
        return cartItems as CartItemType[];
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error) => {
      console.error("Error updating cart item:", error);
    },
  });

  const removeFromCartMutation = useMutation<
    RemoveFromCartMutation,
    Error,
    { product: CartItemType["product"] }
  >({
    mutationFn: async ({ product }) => {
      if (status === "authenticated") {
        return request<RemoveFromCartMutation, RemoveFromCartMutationVariables>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
          REMOVE_FROM_CART_MUTATION,
          {
            input: { productId: product.id },
            locale: currentLanguage,
          }
        );
      } else {
        removeProduct(product.id);

        return {
          removeFromCart: {
            cart: {
              cart_items: [],
            },
          },
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (status === "authenticated") {
        return request(
          `${process.env.NEXT_PUBLIC_API_URL}/api/graphql`,
          CLEAR_CART_MUTATION,
          {
            locale: currentLanguage,
          }
        );
      } else {
        clearCart();
        return {
          clearCart: {
            cart: {
              cart_items: [],
            },
          },
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleConfirm = useCallback(() => {
    if (status === "unauthenticated") {
      openSignInModal("/checkout");
    } else if (status === "authenticated") {
      router.push("/checkout");
    }
    closeModal();
  }, [status, router, openSignInModal, closeModal]);

  const handleCloseModal = useCallback(() => {
    closeModal();
  }, [closeModal]);

  return {
    isModalOpen,
    cartItems,
    isLoading,
    handleUpdateItem: (product: CartItemType, qtyChange: number) => {
      updateCartItemMutation.mutate({
        product,
        qtyChange,
      });
    },
    handleRemoveItem: (product: CartItemType["product"]) => {
      removeFromCartMutation.mutate({
        product,
      });
    },
    handleClearCart: () => clearCartMutation.mutate(),
    handleConfirm,
    handleCloseModal,
    calculateTotal: calculatedValues.total,
    calculateDiscountTotal: calculatedValues.discountTotal,
    totalCount: calculatedValues.itemCount,
  };
};
