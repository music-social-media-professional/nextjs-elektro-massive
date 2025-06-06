import LocalizedLink from "./LocalizedLink";

interface LanguageUnavailablePlaceholderProps {
  title: string;
}

export default function LanguageUnavailablePlaceholder({
  title,
}: LanguageUnavailablePlaceholderProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h1 className="text-xl font-semibold mb-4">
          Извините, эта страница для ${title} пока не доступна на русском языке
        </h1>
        <p className="text-gray-600 mb-4">
          Мы работаем над переводом контента для ${title}. Вы можете посмотреть
          эту страницу на украинском языке.
        </p>
        <LocalizedLink
          lng="uk"
          href={`/`}
          className="text-blue-600 hover:underline"
        >
          Перейти на украинскую версию сайта
        </LocalizedLink>
      </div>
    </div>
  );
}
