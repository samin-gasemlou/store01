import { clearShopTokens, getShopAccessToken } from "./shopAuthApi";

export function isShopLoggedIn() {
  return !!getShopAccessToken();
}

export function shopLogout() {
  clearShopTokens();
}
