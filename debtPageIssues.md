# BadMethodCallException - Internal Server Error
Call to undefined method App\Models\User::transactions()

PHP 8.2.30
Laravel 12.30.1
localhost:8008

## Stack Trace

0 - vendor\laravel\framework\src\Illuminate\Support\Traits\ForwardsCalls.php:67
1 - vendor\laravel\framework\src\Illuminate\Support\Traits\ForwardsCalls.php:36
2 - vendor\laravel\framework\src\Illuminate\Database\Eloquent\Model.php:2540
3 - vendor\laravel\framework\src\Illuminate\Database\Eloquent\Concerns\QueriesRelationships.php:1117
4 - vendor\laravel\framework\src\Illuminate\Database\Eloquent\Relations\Relation.php:119
5 - vendor\laravel\framework\src\Illuminate\Database\Eloquent\Concerns\QueriesRelationships.php:1116
6 - vendor\laravel\framework\src\Illuminate\Database\Eloquent\Concerns\QueriesRelationships.php:46
7 - vendor\laravel\framework\src\Illuminate\Database\Eloquent\Concerns\QueriesRelationships.php:172
8 - app\Http\Controllers\DebtController.php:23
9 - vendor\laravel\framework\src\Illuminate\Routing\ControllerDispatcher.php:46
10 - vendor\laravel\framework\src\Illuminate\Routing\Route.php:265
11 - vendor\laravel\framework\src\Illuminate\Routing\Route.php:211
12 - vendor\laravel\framework\src\Illuminate\Routing\Router.php:822
13 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:180
14 - vendor\laravel\framework\src\Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets.php:32
15 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
16 - vendor\inertiajs\inertia-laravel\src\Middleware.php:96
17 - app\Http\Middleware\HandleInertiaRequests.php:30
18 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
19 - app\Http\Middleware\HandleAppearance.php:21
20 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
21 - vendor\laravel\framework\src\Illuminate\Routing\Middleware\SubstituteBindings.php:50
22 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
23 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken.php:87
24 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
25 - vendor\laravel\framework\src\Illuminate\View\Middleware\ShareErrorsFromSession.php:48
26 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
27 - vendor\laravel\framework\src\Illuminate\Session\Middleware\StartSession.php:120
28 - vendor\laravel\framework\src\Illuminate\Session\Middleware\StartSession.php:63
29 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
30 - vendor\laravel\framework\src\Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse.php:36
31 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
32 - vendor\laravel\framework\src\Illuminate\Cookie\Middleware\EncryptCookies.php:74
33 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
34 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:137
35 - vendor\laravel\framework\src\Illuminate\Routing\Router.php:821
36 - vendor\laravel\framework\src\Illuminate\Routing\Router.php:800
37 - vendor\laravel\framework\src\Illuminate\Routing\Router.php:764
38 - vendor\laravel\framework\src\Illuminate\Routing\Router.php:753
39 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Kernel.php:200
40 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:180
41 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\TransformsRequest.php:21
42 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull.php:31
43 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
44 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\TransformsRequest.php:21
45 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\TrimStrings.php:51
46 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
47 - vendor\laravel\framework\src\Illuminate\Http\Middleware\ValidatePostSize.php:27
48 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
49 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance.php:109
50 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
51 - vendor\laravel\framework\src\Illuminate\Http\Middleware\HandleCors.php:48
52 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
53 - vendor\laravel\framework\src\Illuminate\Http\Middleware\TrustProxies.php:58
54 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
55 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\InvokeDeferredCallbacks.php:22
56 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
57 - vendor\laravel\framework\src\Illuminate\Http\Middleware\ValidatePathEncoding.php:26
58 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
59 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:137
60 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Kernel.php:175
61 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Kernel.php:144
62 - vendor\laravel\framework\src\Illuminate\Foundation\Application.php:1220
63 - public\index.php:20
64 - vendor\laravel\framework\src\Illuminate\Foundation\resources\server.php:23

## Request

GET /admin/debts

## Headers

* **host**: localhost:8008
* **connection**: keep-alive
* **sec-ch-ua-platform**: "Windows"
* **x-xsrf-token**: eyJpdiI6IlNUdm1Jd0lFOGhBdW5XUEF2ZTRHdGc9PSIsInZhbHVlIjoicWtab2NhQXUwdzFoQ0NQUTEyaHpVV2pXZDI2MHo1cHlVUHJGZjVWMktIVmZEWURqWnc2VmRiNGR6bUFoYVFiTEkxZXM5TmtCenZ5SndwRkVhb1ZhTmhWU1dVTmdxQWMwODN1RUZDdzZkYjBlNnd5YlNOVG4rNGxreEpSQVpZbnEiLCJtYWMiOiIwMGYzZjVjZTI3ZDYyNWMwY2MxNzAzZjc5MjQyNGUzZDA5Yjk3MDk0NWIwYTIzNDIwZDNjODYwOGRhZDczYmYwIiwidGFnIjoiIn0=
* **purpose**: prefetch
* **x-inertia-version**: 28b4c6378394b09297d72e36187f7e9f
* **sec-ch-ua**: "Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"
* **x-inertia**: true
* **sec-ch-ua-mobile**: ?0
* **x-requested-with**: XMLHttpRequest
* **user-agent**: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36
* **accept**: text/html, application/xhtml+xml
* **sec-fetch-site**: same-origin
* **sec-fetch-mode**: cors
* **sec-fetch-dest**: empty
* **referer**: http://localhost:8008/admin/customers
* **accept-encoding**: gzip, deflate, br, zstd
* **accept-language**: en-GB,en-US;q=0.9,en;q=0.8,ku;q=0.7
* **cookie**: ajs_anonymous_id=a739b47a-eb55-4329-9031-92342ef87a25; sidebar_state=true; admin_session=8ba5604c-a3a5-4418-bb39-3c120e3a7ab4; appearance=dark; XSRF-TOKEN=eyJpdiI6IlNUdm1Jd0lFOGhBdW5XUEF2ZTRHdGc9PSIsInZhbHVlIjoicWtab2NhQXUwdzFoQ0NQUTEyaHpVV2pXZDI2MHo1cHlVUHJGZjVWMktIVmZEWURqWnc2VmRiNGR6bUFoYVFiTEkxZXM5TmtCenZ5SndwRkVhb1ZhTmhWU1dVTmdxQWMwODN1RUZDdzZkYjBlNnd5YlNOVG4rNGxreEpSQVpZbnEiLCJtYWMiOiIwMGYzZjVjZTI3ZDYyNWMwY2MxNzAzZjc5MjQyNGUzZDA5Yjk3MDk0NWIwYTIzNDIwZDNjODYwOGRhZDczYmYwIiwidGFnIjoiIn0%3D; haji_printing_session=eyJpdiI6InVRcldVZnI2ODRkUjh3aFFtaWVycXc9PSIsInZhbHVlIjoicjZZWnJ1WTljdlBpUksxNWp4cUh4RTNDVDlNTzZaaDlYSmJTVTVUKzYrV0hONU1ESDBaaXdwNXlBRDRvWHFGaXV1clFsdUpUWHVtVDhLcmZlOGpQZ0xaNnozNzI5RWhjRC82OFBqUHROQkdCajg0SzN0OG1hMndQbzUxK3VrbFIiLCJtYWMiOiI3YzM2MWZkYThmMDU0ZDhkYjUyOTVmYTY0NjUyM2VkMGJjOGFkMDM5YWVjYTNhNTk0NzAwMmM0MDY1NjJjYTBiIiwidGFnIjoiIn0%3D

## Route Context

controller: App\Http\Controllers\DebtController@index
route name: admin.debts.index
middleware: web

## Route Parameters

No route parameter data available.

## Database Queries

* mysql - select `id`, `name`, `email`, `username`, `phone`, `role`, `created_at`, `updated_at` from `users` where `role` = 'admin' order by `id` asc limit 1 (24.18 ms)
