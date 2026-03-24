import CVItemSkeleton from "./cv/cv-item/cv-item-skeleton";
import ContentPage from "./layout/content-page";

export default function MakerPageSeleton() {
  return (
    <ContentPage className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 sm:p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <CVItemSkeleton key={index} />
      ))}
    </ContentPage>
  );
}
