angular.module('app').controller('TaskGridPagerCtrl', ['$scope',
    function ($scope) {
        var paginationOptions = {
            maxBlocks: 5,
            minBlocks: 3
        };

        var generatePagesArray = function (currentPage, totalItems, pageSize, maxBlocks, minBlocks) {
            currentPage = currentPage || $scope.grid.options.paginationCurrentPage;
            pageSize = pageSize || $scope.grid.options.paginationPageSize;
            totalItems = totalItems || $scope.grid.options.totalItems;
            maxBlocks = maxBlocks || $scope.grid.options.paginationMaxBlocks || paginationOptions.maxBlocks;
            minBlocks = minBlocks || $scope.grid.options.paginationMinBlocks || paginationOptions.minBlocks;
            $scope.currentPage = currentPage;

            var maxPage,
                maxPivotPages,
                minPage,
                numPages,
                pages;
            // maxBlocks = maxBlocks && maxBlocks < 6 ? 6 : maxBlocks;

            pages = [];
            numPages = Math.ceil(totalItems / pageSize);
            $scope.pageTotal = numPages;
            if (numPages > 1) {
                pages.push({
                    type: 'first',
                    number: 1,
                    active: currentPage > 1,
                    current: currentPage === 1
                });
                pages.push({
                    type: 'prev',
                    number: Math.max(1, currentPage - 1),
                    active: currentPage > 1
                });
                maxPivotPages = Math.round((maxBlocks - minBlocks) / 2);
                minPage = Math.max(2, currentPage - maxPivotPages);
                maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
                minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
                var i = minPage;
                while (i <= maxPage) {
                    if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
                        pages.push({
                            type: 'more',
                            active: false
                        });
                    } else {
                        pages.push({
                            type: 'page',
                            number: i,
                            active: currentPage !== i,
                            current: currentPage === i
                        });
                    }
                    i++;
                }
                pages.push({
                    type: 'next',
                    number: Math.min(numPages, currentPage + 1),
                    active: currentPage < numPages
                });
                pages.push({
                    type: 'last',
                    number: numPages,
                    active: currentPage !== numPages,
                    current: currentPage === numPages
                });
            }
            return pages;
        };

        var deregP = $scope.$watch('grid.options.paginationCurrentPage + grid.options.paginationPageSize + grid.options.totalItems', function (newValues, oldValues) {
            $scope.pages = generatePagesArray();
        });

        $scope.$on('$destroy', function () {
            deregP();
        });
    }
]);
