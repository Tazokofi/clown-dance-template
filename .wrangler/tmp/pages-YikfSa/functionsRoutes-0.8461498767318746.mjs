import { onRequestPost as __api_comments__id__delete_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/comments/[id]/delete.js"
import { onRequestPost as __api_comments__id__like_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/comments/[id]/like.js"
import { onRequestPost as __api_comments__id__report_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/comments/[id]/report.js"
import { onRequestPost as __api_comments__id__vote_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/comments/[id]/vote.js"
import { onRequestGet as __api_videos__id__comments_js_onRequestGet } from "/Users/wadeharrell/clown-gallery/functions/api/videos/[id]/comments.js"
import { onRequestPost as __api_videos__id__comments_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/videos/[id]/comments.js"
import { onRequestPost as __api_videos__id__view_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/videos/[id]/view.js"
import { onRequestPost as __api_videos__id__vote_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/videos/[id]/vote.js"
import { onRequestPost as __api_admin_ban_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/admin/ban.js"
import { onRequestPost as __api_admin_unhide_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/admin/unhide.js"
import { onRequestPost as __api_auth_login_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/auth/login.js"
import { onRequestPost as __api_auth_logout_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/auth/logout.js"
import { onRequestGet as __api_auth_me_js_onRequestGet } from "/Users/wadeharrell/clown-gallery/functions/api/auth/me.js"
import { onRequestPost as __api_auth_signup_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/auth/signup.js"
import { onRequestPost as __api_avatars_select_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/avatars/select.js"
import { onRequestPost as __api_avatars_upload_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/avatars/upload.js"
import { onRequestGet as __api_videos_index_js_onRequestGet } from "/Users/wadeharrell/clown-gallery/functions/api/videos/index.js"
import { onRequestPost as __api_videos_index_js_onRequestPost } from "/Users/wadeharrell/clown-gallery/functions/api/videos/index.js"
import { onRequestGet as __avatars___path___js_onRequestGet } from "/Users/wadeharrell/clown-gallery/functions/avatars/[[path]].js"

export const routes = [
    {
      routePath: "/api/comments/:id/delete",
      mountPath: "/api/comments/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_comments__id__delete_js_onRequestPost],
    },
  {
      routePath: "/api/comments/:id/like",
      mountPath: "/api/comments/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_comments__id__like_js_onRequestPost],
    },
  {
      routePath: "/api/comments/:id/report",
      mountPath: "/api/comments/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_comments__id__report_js_onRequestPost],
    },
  {
      routePath: "/api/comments/:id/vote",
      mountPath: "/api/comments/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_comments__id__vote_js_onRequestPost],
    },
  {
      routePath: "/api/videos/:id/comments",
      mountPath: "/api/videos/:id",
      method: "GET",
      middlewares: [],
      modules: [__api_videos__id__comments_js_onRequestGet],
    },
  {
      routePath: "/api/videos/:id/comments",
      mountPath: "/api/videos/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_videos__id__comments_js_onRequestPost],
    },
  {
      routePath: "/api/videos/:id/view",
      mountPath: "/api/videos/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_videos__id__view_js_onRequestPost],
    },
  {
      routePath: "/api/videos/:id/vote",
      mountPath: "/api/videos/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_videos__id__vote_js_onRequestPost],
    },
  {
      routePath: "/api/admin/ban",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_ban_js_onRequestPost],
    },
  {
      routePath: "/api/admin/unhide",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_unhide_js_onRequestPost],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_js_onRequestPost],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_logout_js_onRequestPost],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_js_onRequestGet],
    },
  {
      routePath: "/api/auth/signup",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_signup_js_onRequestPost],
    },
  {
      routePath: "/api/avatars/select",
      mountPath: "/api/avatars",
      method: "POST",
      middlewares: [],
      modules: [__api_avatars_select_js_onRequestPost],
    },
  {
      routePath: "/api/avatars/upload",
      mountPath: "/api/avatars",
      method: "POST",
      middlewares: [],
      modules: [__api_avatars_upload_js_onRequestPost],
    },
  {
      routePath: "/api/videos",
      mountPath: "/api/videos",
      method: "GET",
      middlewares: [],
      modules: [__api_videos_index_js_onRequestGet],
    },
  {
      routePath: "/api/videos",
      mountPath: "/api/videos",
      method: "POST",
      middlewares: [],
      modules: [__api_videos_index_js_onRequestPost],
    },
  {
      routePath: "/avatars/:path*",
      mountPath: "/avatars",
      method: "GET",
      middlewares: [],
      modules: [__avatars___path___js_onRequestGet],
    },
  ]