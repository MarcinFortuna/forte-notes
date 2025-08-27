import {createServerClient} from '@supabase/ssr'
import {type NextRequest, NextResponse} from 'next/server'

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}


export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value}) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({name, value, options}) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    );

    const isAuthRoute: boolean = ["/login", "/sign-up"].includes(request.nextUrl.pathname);

    if (isAuthRoute) {
        const {
            data: {user},
        } = await supabase.auth.getUser();
        if (user) {
            return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
        }
    }

    const {searchParams, pathname} = new URL(request.url);

    if (!searchParams.get("noteId") && pathname === "/") {
        const {
            data: {user},
        } = await supabase.auth.getUser();
        if (user) {
            const url = request.nextUrl.clone();

            // This uses fetch because you can't use Prisma directly in middleware
            // Middleware runs on edge, which is different from typical NodeJS environment
            const {newestNoteId} = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-note?userId=${user.id}`)
                .then((res) => res.json());

            if (newestNoteId) {
                url.searchParams.set("noteId", newestNoteId);
            } else {
                const {noteId} = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-note?userId=${user.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json());
                url.searchParams.set("noteId", noteId);
            }

            return NextResponse.redirect(url);
        }
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}