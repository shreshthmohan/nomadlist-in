import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
} from "@remix-run/react"

import tailwindStylesheetUrl from "./styles/tailwind.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Climate Finder | Choose places in India based on weather",
  viewport: "width=device-width,initial-scale=1",
})

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="flex min-h-full flex-col justify-between">
          <div className="mx-auto max-w-screen-lg px-3 pt-4 sm:pt-6 md:px-0">
            <header className="relative">
              <a className="skip-to-content" href="#main-content">
                Skip navigation
              </a>
              <nav role="navigation" className="text-center">
                <span className="flex gap-x-4">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "text-xl font-normal text-gray-800 no-underline decoration-gray-500 underline-offset-2 hover:text-gray-500 hover:underline"
                        : "text-xl font-normal text-gray-400 no-underline decoration-gray-500 underline-offset-2 hover:text-gray-500 hover:underline"
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="places"
                    className={({ isActive }) =>
                      isActive
                        ? "text-xl font-normal text-gray-800 no-underline decoration-gray-500 underline-offset-2 hover:text-gray-500 hover:underline"
                        : "text-xl font-normal text-gray-400 no-underline decoration-gray-500 underline-offset-2 hover:text-gray-500 hover:underline"
                    }
                  >
                    Places
                  </NavLink>
                  <NavLink
                    to="climate-finder"
                    className={({ isActive }) =>
                      isActive
                        ? "text-xl font-normal text-gray-800 no-underline decoration-gray-500 underline-offset-2 hover:text-gray-500 hover:underline"
                        : "text-xl font-normal text-gray-400 no-underline decoration-gray-500 underline-offset-2 hover:text-gray-500 hover:underline"
                    }
                  >
                    Climate Finder
                  </NavLink>
                </span>
              </nav>
            </header>
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
