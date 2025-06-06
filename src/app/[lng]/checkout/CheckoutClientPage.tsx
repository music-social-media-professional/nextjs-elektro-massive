"use client";

import React, { useState } from "react";

import { ExtendedFormProvider } from "@/hooks/extendedFormContext";
import { OrderFormData, useOrderForm } from "@/hooks/useOrderForm";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import dynamic from "next/dynamic";
import { AvailableLanguages } from "@/components/shared/LanguageToggler";
import { useLangMatches } from "@/hooks/useLangMatches";

interface CheckoutPageProps {
  params: {
    lng: string;
  };
  fullTranslatedPath: Record<AvailableLanguages, string>;
}

const ContactDetails = dynamic(
  () => import("@/components/order/ContactDetails"),
  {
    ssr: false,
  }
);
const Delivery = dynamic(() => import("@/components/order/Delivery"), {
  ssr: false,
});
const Payment = dynamic(() => import("@/components/order/Payment"), {
  ssr: false,
});
const Summary = dynamic(() => import("@/components/order/Summary"), {
  ssr: false,
});

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  params,
  fullTranslatedPath,
}) => {
  useLangMatches(fullTranslatedPath);

  const methods = useOrderForm();
  const [activeSection, setActiveSection] = React.useState<number>(1);
  const [showError, setShowError] = useState<boolean>(false);

  const onContinue = () => {
    setActiveSection((prev) => prev + 1);
  };

  //TODO: add lang support

  const customLabels = {
    checkout: "Оформлення замовлення",
  };

  return (
    <ExtendedFormProvider<OrderFormData> methods={methods}>
      <div className="max-w-6xl mx-auto p-4 font-sans">
        <Breadcrumbs customLabels={customLabels} />
        <h1 className="text-2xl font-bold mb-6">Оформлення замовлення</h1>

        {showError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Помилка! </strong>
            <span className="block sm:inline">
              Будь ласка, перевірте правильність заповнення всіх полів.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <ContactDetails
              isActive={activeSection === 1}
              onExpand={() => {
                setActiveSection(1);
              }}
              onContinue={() => {
                onContinue();
              }}
            />
            <Delivery
              isActive={activeSection === 2}
              onExpand={() => {
                setActiveSection(2);
              }}
              onContinue={() => {
                onContinue();
              }}
            />
            <Payment />
          </div>
          <div className="lg:col-span-2">
            <Summary
              lng={params.lng}
              onErrors={() => {
                setShowError(true);
              }}
            />
          </div>
        </div>
      </div>
    </ExtendedFormProvider>
  );
};

export default CheckoutPage;
