import { apolloClient } from "../../libs/apolloClient";
import { gql } from "@apollo/client";
import { IReviewHomepageQuery } from "../../interfaces/querys/IReviewHomepageQuery";
import { IReviewMolde } from "../../interfaces/moldes/IReviewMolde";

export class ReviewRepository {
  async create(reviewMolde: IReviewMolde) {
    try {
      const { movieName, review, category, moviePictureUrl } = reviewMolde;
      const reviewCreated = await apolloClient.mutate({
        mutation: gql`
          mutation createReview(
            $movieName: String!
            $reviewText: String!
            $category: String!
            $moviePictureUrl: String
          ) {
            createReview(
              data: {
                movieName: $movieName
                reviewText: $reviewText
                moviePictureUrl: $moviePictureUrl
                likes: 0
                deslikes: 0
                category: $category
                reviewr: { connect: { id: "cl69v42jj7zyh0akjdufrwnbn" } }
              }
            ) {
              movieName
            }
          }
        `,
        variables: {
          movieName,
          reviewText: review,
          category: category,
          moviePictureUrl,
        },
      });

      await apolloClient.mutate({
        mutation: gql`
          mutation publishReviews {
            publishManyReviews(to: PUBLISHED) {
              count
            }
          }
        `,
      });
    } catch (e) {
      console.error(e);
    }
  }
  async findAllCategoryReviews(categorySlug: string) {
    console.log(categorySlug);
    const allReviews = await apolloClient.mutate<{
      reviews: IReviewHomepageQuery[];
    }>({
      mutation: gql`
        query findAllCategoryReviews($categorySlug: String!) {
          reviews(where: { category: $categorySlug }) {
            id
            movieName
            moviePictureUrl
            category
            likes
            deslikes

            reviewr {
              name
              avatarUrl
            }
          }
        }
      `,
      variables: {
        categorySlug,
      },
    });

    return allReviews.data?.reviews;
  }
  async findReviewByID(reviewId: string) {
    const allReviews = await apolloClient.mutate<{
      review: IReviewHomepageQuery;
    }>({
      mutation: gql`
        query findAllCategoryReviews($reviewId: ID!) {
          review(where: { id: $reviewId }) {
            id
            movieName
            moviePictureUrl
            category
            likes
            deslikes
            reviewText

            reviewr {
              name
              avatarUrl
            }
          }
        }
      `,
      variables: {
        reviewId,
      },
    });

    return allReviews.data?.review;
  }

  async updateLikes(value: number, reviewId: string) {
    await apolloClient.mutate({
      mutation: gql`
        mutation updateLikes($value: Int!, $reviewId: ID!) {
          updateReview(data: { likes: $value }, where: { id: $reviewId }) {
            movieName
          }
        }
      `,
      variables: {
        value,
        reviewId,
      },
    });

    await apolloClient.mutate({
      mutation: gql`
        mutation publishManyReviews {
          publishManyReviews(to: PUBLISHED) {
            count
          }
        }
      `,
    });
  }

  async updateDeslikes(value: number, reviewId: string) {
    await apolloClient.mutate({
      mutation: gql`
        mutation updateLikes($value: Int!, $reviewId: ID!) {
          updateReview(data: { deslikes: $value }, where: { id: $reviewId }) {
            movieName
          }
        }
      `,
      variables: {
        value,
        reviewId,
      },
    });

    await apolloClient.mutate({
      mutation: gql`
        mutation publishManyReviews {
          publishManyReviews(to: PUBLISHED) {
            count
          }
        }
      `,
    });
  }
}
