"use client";

import { useCallback, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { useTranslation } from "@/app/i18n/client";
import OptimizedImage from "./OptimizedImage";
import { AWS_CDN_URL } from "@/app/utils/constants";

interface SearchBarProps {
  lng: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ lng }) => {
  const { t } = useTranslation(lng, "header");
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();

  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(e.target.value);

    const newQueryString = createQueryString("q", newSearchTerm.trim());
    if (newSearchTerm.trim().length > 0) {
      router.push(`/${lng}/search?${newQueryString}`);
    } else {
      router.push(`/${lng}/`);
    }
  };

  return (
    <div className="flex-grow w-auto sm:w-3/4 lg:w-2/3 max-w-[730px]">
      <div className="flex items-center relative">
        <input
          type="text"
          className="bg-transparent border border-white text-white px-4 py-2 rounded-r-2xl focus:outline-none pr-14 w-full"
          placeholder={`${t("search.placeholder")}`}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
          <div className="bg-transparent p-2 pr-4 rounded-r-full rounded-l-2xl">
            <OptimizedImage
              src={`${AWS_CDN_URL}shared/public/icons/search.png`}
              alt="Search icon"
              className="h-6 w-6 invert"
              width={32}
              height={32}
              priority
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
