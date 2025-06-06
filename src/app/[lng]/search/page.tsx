import { fallbackLng, languages } from "@/app/i18n/settings";
import CenteredSpinner from "@/components/shared/CenteredSpinner";
import SearchResults from "@/components/shared/SearchResults";
import { Metadata } from "next";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
  params: {
    lng: string;
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const title =
    params.lng === "uk"
      ? `Пошук${searchParams.q ? ` - ${searchParams.q}` : ""} | ELEKTRO-MASSIVE`
      : `Поиск${searchParams.q ? ` - ${searchParams.q}` : ""} | ELEKTRO-MASSIVE`;

  const description =
    params.lng === "uk"
      ? "Пошук товарів в каталозі ELEKTRO-MASSIVE. Знайдіть потрібні електротовари, будматеріали та сантехніку за найкращими цінами | ELEKTRO-MASSIVE"
      : "Поиск товаров в каталоге ELEKTRO-MASSIVE. Найдите нужные электротовары, стройматериалы и сантехнику по лучшим ценам | ELEKTRO-MASSIVE";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const SearchPage: React.FC<SearchPageProps> = ({ searchParams, params }) => {
  const query = searchParams.q || "";
  const lng = params.lng || fallbackLng;

  const fullTranslatedPath = languages.reduce(
    (acc, l) => ({
      ...acc,
      [l]: `search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    }),
    {}
  );

  return (
    <Suspense fallback={<CenteredSpinner />}>
      <SearchResults
        query={query}
        lng={lng}
        fullTranslatedPath={fullTranslatedPath}
      />
    </Suspense>
  );
};

export default SearchPage;
