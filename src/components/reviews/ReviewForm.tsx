"use client";

import { PenTool, Star } from "lucide-react";
import React, { useState } from "react";
import Rating from "./Rating";
import { useTranslation } from "@/app/i18n/client";

interface ReviewFormProps {
  lng: string;
  onSubmit: (reviewData: any) => void;
}

const initialFormState = {
  customerName: "",
  comment: "",
  selectionConvenience: 0,
  managerConsultation: 0,
  productDelivery: 0,
  paymentProcess: 0,
};

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, lng }) => {
  const { t } = useTranslation(lng, "common");

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (name: string, raiting: number) => {
    setFormData({ ...formData, [name]: raiting });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const overallRating =
      (formData.selectionConvenience +
        formData.managerConsultation +
        formData.productDelivery +
        formData.paymentProcess) /
      4;
    onSubmit({
      ...formData,
      overallRating,
    });
    setFormData(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="customerName" className="block mb-1">
          {t("reviews.form.customerName")}
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label htmlFor="comment" className="block mb-1">
          {t("reviews.form.comment")}
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
          rows={4}
          required
        ></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="block mb-1">
            {t("reviews.form.selectionConvenience")}
          </label>
          <Rating
            name="selectionConvenience"
            value={formData.selectionConvenience}
            onChange={handleRatingChange}
          />
          {/* {renderStars("selectionConvenience", formData.selectionConvenience)} */}
        </div>
        <div>
          <label htmlFor="block mb-1">
            {" "}
            {t("reviews.form.managerConsultation")}
          </label>
          <Rating
            name="managerConsultation"
            value={formData.managerConsultation}
            onChange={handleRatingChange}
          />
        </div>
        <div>
          <label htmlFor="block mb-1">
            {t("reviews.form.productDelivery")}
          </label>
          <Rating
            name="productDelivery"
            value={formData.productDelivery}
            onChange={handleRatingChange}
          />
        </div>
        <div>
          <label htmlFor="block mb-1">{t("reviews.form.paymentProcess")}</label>
          <Rating
            name="paymentProcess"
            value={formData.paymentProcess}
            onChange={handleRatingChange}
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-gradient-elektro-massive-horizontal text-white py-2 px-4 rounded-full flex items-center"
      >
        <PenTool className="mr-2" size={18} />
        {t("reviews.form.submitReview")}
      </button>
    </form>
  );
};

export default ReviewForm;
