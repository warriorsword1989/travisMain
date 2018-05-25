/**
 * service worker试验
 * @file       sw-poi.js
 * @author     ChenXiao
 * @date       2017-08-24 15:45:55
 *
 * @copyright: @Navinfo, all rights reserved.
 */

var CACHE_NAME = 'POI-TEST';

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log('Opened cache');
            // return cache.addAll(urlsToCache);
        })
    );
    console.log('---service worker installing.');
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // IMPORTANT: Clone the request. A request is a stream and
            // can only be consumed once. Since we are consuming this
            // once by cache and once by the browser for fetch, we need
            // to clone the response
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
                function (resp) {
                    // Check if we received a valid response
                    // if (!resp || resp.status !== 200 || resp.type !== 'basic') {
                    if (!resp || resp.status !== 200) {
                        return resp;
                    }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have 2 stream.
                    var responseToCache = resp.clone();

                    caches.open(CACHE_NAME)
                        .then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return resp;
                }
            );
        })
    );
});

self.addEventListener('activate', function (event) {
    var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                    return cacheName;
                })
            );
        })
    );
});
