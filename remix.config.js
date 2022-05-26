/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  serverDependenciesToBundle: [
    // d3 and its dependencies
    "d3",
    /^d3-.*/,
    "delaunator",
    "internmap",
    // d3 deps end
    "marked",
  ],
}
