import CVItemSkeleton from "./cv/cv-item/cv-item-skeleton";
import ContentPage from "./layout/content-page";

export default function MakerPageSeleton() {
  return (
    <ContentPage className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-1 sm:p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <CVItemSkeleton key={index} />
      ))}
    </ContentPage>
  );
}
