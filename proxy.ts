import { convexAuthNextjsMiddleware ,isAuthenticatedNextjs} from "@convex-dev/auth/nextjs/server";
 import {NextRequest,NextResponse} from "next/server";
 const isPublicRoute=["/sign-in","/sign-up"];
export default convexAuthNextjsMiddleware(async(request:NextRequest)=>{
  const isAuthenticated = await isAuthenticatedNextjs();
  if(!isAuthenticated && !isPublicRoute.some(route=>request.nextUrl.pathname.startsWith(route))){
    const signInUrl=new URL("/sign-in",request.url);
    return NextResponse.redirect(signInUrl);
  }
  if(isAuthenticated && isPublicRoute.some(route => request.nextUrl.pathname.startsWith(route))){
    const homeUrl=new URL("/",request.url);
    return NextResponse.redirect(homeUrl);
  }
  return NextResponse.next();
});
 
export const config = {
  // The following matcher runs middleware on all routesL
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};