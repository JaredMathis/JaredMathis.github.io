const {
    readFile,
    logIndent,
    merge,
    consoleLog,
    logProperties,
} = require('/utilities/log');

const {
    range,
} = require('/utilities/core');

const {
    getBooks,
    getChapterCount,
    getVerses,
} = require('/bible');

const ctrl = 'HomeController';
angular.module('bible', [])
    .controller(ctrl, function ($scope) {

        logIndent(ctrl, context => {
            $scope.books = getBooks();

            $scope.selectedBook = 'John';
            $scope.selectedChapter = 0;

            $scope.$watch('selectedBook', () => {
                let log = false;

                let count = getChapterCount($scope.selectedBook);
                $scope.chapters = range(count);

                if (log) consoleLog('selected book watch');
                if (log) consoleLog({chapters:$scope.chapters});
                if (log) consoleLog({selectedChapter:$scope.selectedChapter});
            });

            $scope.resetChapter = () => {
                $scope.selectedChapter = $scope.chapters[0];
            };

            $scope.$watch(() => {
                return [$scope.selectedBook, $scope.selectedChapter] 
            }, () => {
                let log = false;
                $scope.verses = getVerses($scope.selectedBook, $scope.selectedChapter);
                if (log) consoleLog({verses: $scope.verses})
            }, true);

            $scope.clickWord = (word) => {
                $scope.toggledWords[word.word] = !$scope.toggledWords[word.word];
            };

            $scope.toggledWords = {};

            $scope.previousChapter = () => {
                let log = false;
                if (log) consoleLog('previousChapter');
                $scope.selectedChapter = $scope.selectedChapter - 1;
                if ($scope.selectedChapter < 0) {
                    let selectedBookIndex = $scope.books.indexOf($scope.selectedBook) - 1;
                    if (selectedBookIndex < 0) {
                        selectedBookIndex = $scope.books.length - 1;
                    }
                    $scope.selectedBook = $scope.books[selectedBookIndex];
                    $scope.selectedChapter = getChapterCount($scope.selectedBook) - 1;
                    if (log) consoleLog({'$scope.selectedChapter':$scope.selectedChapter})
                }
            };
            $scope.nextChapter = () => {
                let log = false;
                if (log) consoleLog('previousChapter');
                $scope.selectedChapter = $scope.selectedChapter + 1;
                if ($scope.selectedChapter > getChapterCount($scope.selectedBook) - 1) {
                    let selectedBookIndex = $scope.books.indexOf($scope.selectedBook) + 1;
                    if (selectedBookIndex < 0) {
                        selectedBookIndex = 0;
                    }
                    $scope.selectedBook = $scope.books[selectedBookIndex];
                    $scope.selectedChapter = 0;
                    if (log) consoleLog({'$scope.selectedChapter':$scope.selectedChapter})
                }
            };
        });
    });