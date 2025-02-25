/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auths)` | `/(auths)/forgot-password` | `/(auths)/login` | `/(auths)/opt` | `/(auths)/register` | `/(main)` | `/(main)/chat` | `/(main)/comment` | `/(main)/court-details` | `/(main)/create-post` | `/(main)/list-conversation` | `/(main)/payment` | `/(main)/payment-detail` | `/(main)/settings` | `/(tabs)` | `/(tabs)/` | `/(tabs)/account` | `/(tabs)/court` | `/(tabs)/history` | `/(tabs)/social-media` | `/_sitemap` | `/account` | `/chat` | `/comment` | `/court` | `/court-details` | `/create-post` | `/forgot-password` | `/history` | `/list-conversation` | `/login` | `/opt` | `/payment` | `/payment-detail` | `/register` | `/settings` | `/social-media`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
