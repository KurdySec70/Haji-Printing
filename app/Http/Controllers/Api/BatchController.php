<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class BatchController extends Controller
{
    /**
     * Handle a batch of API requests in a single round-trip.
     */
    public function handle(Request $request): Response
    {
        $validated = $request->validate([
            'requests' => ['required', 'array', 'min:1'],
            'requests.*.method' => ['sometimes', 'string'],
            'requests.*.url' => ['required', 'string'],
            'requests.*.params' => ['sometimes', 'array'],
            'requests.*.body' => ['sometimes'],
            'requests.*.headers' => ['sometimes', 'array'],
        ]);

        $router = app('router');

        $results = collect($validated['requests'])->map(function (array $item) use ($request, $router) {
            $method = strtoupper($item['method'] ?? 'GET');
            $url = '/' . ltrim($item['url'], '/');

            if (! Str::startsWith($url, '/api/')) {
                return [
                    'status' => 422,
                    'body' => [
                        'success' => false,
                        'message' => 'Batch requests must target API routes',
                    ],
                ];
            }

            if ($url === '/api/batch') {
                return [
                    'status' => 409,
                    'body' => [
                        'success' => false,
                        'message' => 'Nested batch calls are not allowed',
                    ],
                ];
            }

            $params = $item['params'] ?? [];
            $body = $item['body'] ?? [];
            $headers = array_change_key_case($item['headers'] ?? [], CASE_LOWER);

            $server = $request->server->all();
            $server['HTTP_ACCEPT'] = $headers['accept'] ?? 'application/json';
            $server['CONTENT_TYPE'] = $headers['content-type'] ?? 'application/json';

            $subRequest = Request::create(
                $url,
                $method,
                $method === 'GET' ? array_merge($params, $body) : $params,
                $request->cookies->all(),
                [],
                $server,
                $method === 'GET' ? null : (is_string($body) ? $body : json_encode($body))
            );

            $subRequest->headers->add(array_merge($request->headers->all(), $headers));

            $response = $router->dispatch($subRequest);

            $content = $response->getContent();
            $decoded = json_decode($content, true);

            return [
                'status' => $response->getStatusCode(),
                'headers' => $response->headers->all(),
                'body' => json_last_error() === JSON_ERROR_NONE ? $decoded : $content,
            ];
        })->all();

        return response()->json([
            'success' => true,
            'results' => $results,
        ]);
    }
}
