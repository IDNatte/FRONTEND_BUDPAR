// Router config
import { wrap } from "svelte-spa-router/wrap";

export const routes = {
  "/": wrap({
    asyncComponent: () => import('./home/HomePage.svelte')
  }),

  "/search": wrap({
    asyncComponent: () => import('./search/SearchPage.svelte')
  }),

  // Map Page
  "/map": wrap({
    asyncComponent: () => import('./map/MapPage.svelte')
  }),

  '/direction': wrap({
    asyncComponent: () => import('./map/DirectionPage.svelte')
  }),

  // List page
  "/tour-list": wrap({
    asyncComponent: () => import('./tour/TourListPage.svelte')
  }),

  "/event-list": wrap({
    asyncComponent: () => import('./event/EventListPage.svelte')
  }),

  "/news-list": wrap({
    asyncComponent: () => import('./news/NewsListPage.svelte')
  }),

  // Detail Page
  // "/article-detail": wrap({
  //   asyncComponent: () => import('./content/ArticleDetailPage.svelte')
  // }),

  "/news-detail": wrap({
    asyncComponent: () => import('./content/NewsDetailPage.svelte')
  }),

  "/event-detail": wrap({
    asyncComponent: () => import('./content/EventDetailPage.svelte')
  }),

  "/tour-detail": wrap({
    asyncComponent: () => import('./content/TourDetailPage.svelte')
  }),

  "/hotel-detail": wrap({
    asyncComponent: () => import('./content/HotelDetailPage.svelte')
  }),

  "/resto-detail": wrap({
    asyncComponent: () => import('./content/RestoDetailPage.svelte')
  }),

  // kalender event
  "/event-calendar": wrap({
    asyncComponent: () => import('./misc/calendar/EventcalendarPage.svelte')
  }),

  // Not Found page
  "*": wrap({
    asyncComponent: () => import('./error/NotFoundPage.svelte')
  }),
}