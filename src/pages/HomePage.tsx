import React, { useEffect, useState } from "react";
import { idUniqueV2 } from "id-unique-protocol";

import "./styles/homePage.scss";
export function HomePage() {
  const [reviewrState, setReviewrState] =
    useState<null | IReviewrQueryHomePage>(null);
  const { category_slug } = useParams<{ category_slug: string }>();
  const [allCategoryMovies, setAllCategoryMovies] = useState<
    IReviewHomepageQuery[] | null | undefined
  >(null);

  useEffect(() => {
    getAllCategoryReviews();

    async function getAllCategoryReviews() {
      const reviews = await new ReviewRepository().findAllCategoryReviews(
        category_slug as string,
      );

      setAllCategoryMovies(reviews);
    }
  }, [category_slug]);

  useEffect(() => {
    const reviewAuthIdentifier = localStorage.getItem("reviewr_uid");

    if (!reviewAuthIdentifier) return useNavigate()("/login");
    getReviewrData();

    async function getReviewrData() {
      const reviewrRepository =
        await new ReviewrsRepository().findOneByAuthenticatorUID(
          reviewAuthIdentifier as string,
        );

      setReviewrState(reviewrRepository);
    }
  }, []);

  return <div className="Homepage"></div>;
}
