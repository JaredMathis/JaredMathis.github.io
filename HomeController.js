const u = require('wlj-utilities');

const {
    getBooks,
    getChapterCount,
    getVerses,
    getWords,
} = require('/bible');

const words = getWords();

const ctrl = 'HomeController';
angular.module('bible', []);

angular.module('bible').controller(ctrl, function ($scope) {
    function loadState() {
        let json = localStorage.getItem('state');
        $scope.state = JSON.parse(json) || {};

        $scope.state.toggledWords = $scope.state.toggledWords || {};
        $scope.state.fontSizeFactor = $scope.state.fontSizeFactor || 0;
        saveState();
    }

    function saveState() {
        localStorage.setItem('state', JSON.stringify($scope.state));
    }

    u.scope(ctrl, context => {
        loadState();

        $scope.textLarger = () => {
            $scope.state.fontSizeFactor += 1;
            saveState();
        };
        $scope.textSmaller = () => {
            $scope.state.fontSizeFactor -= 1;
            saveState();
        };

        $scope.books = getBooks();

        if (!$scope.state.selectedBook) {
            $scope.state.selectedBook = 'John';
        }
        if (!$scope.state.selectedChapter) {
            $scope.state.selectedChapter = 0;
        }

        $scope.$watch('state.selectedBook', () => {
            let log = false;
            
            let count = getChapterCount($scope.state.selectedBook);
            $scope.chapters = u.range(count);

            if (log) console.log('selected book watch');
            if (log) console.log({chapters:$scope.chapters});
            if (log) console.log({selectedChapter:$scope.state.selectedChapter});
        });

        $scope.resetChapter = () => {
            $scope.state.selectedChapter = $scope.chapters[0];
        };

        $scope.$watch(() => {
            return [$scope.state.selectedBook, $scope.state.selectedChapter] 
        }, () => {
            let log = false;
            if (log) console.log('saving state');
            saveState();
            $scope.verses = getVerses($scope.state.selectedBook, $scope.state.selectedChapter);
            if (log) console.log({verses: $scope.verses})
        }, true);

        $scope.clickWord = (word) => {
            $scope.state.toggledWords[word.word] = !$scope.state.toggledWords[word.word];
            saveState();
        };

        $scope.previousChapter = () => {
            let log = false;
            if (log) console.log('previousChapter');
            $scope.state.selectedChapter = $scope.state.selectedChapter - 1;
            if ($scope.selectedChapter < 0) {
                let selectedBookIndex = $scope.books.indexOf($scope.state.selectedBook) - 1;
                if (selectedBookIndex < 0) {
                    selectedBookIndex = $scope.books.length - 1;
                }
                $scope.state.selectedBook = $scope.books[selectedBookIndex];
                $scope.state.selectedChapter = getChapterCount($scope.state.selectedBook) - 1;
                if (log) console.log({'$scope.state.selectedChapter':$scope.state.selectedChapter})
            }
        };
        $scope.nextChapter = () => {
            let log = false;
            if (log) console.log('previousChapter');
            $scope.state.selectedChapter = $scope.state.selectedChapter + 1;
            if ($scope.state.selectedChapter > getChapterCount($scope.state.selectedBook) - 1) {
                let selectedBookIndex = $scope.books.indexOf($scope.state.selectedBook) + 1;
                if (selectedBookIndex < 0) {
                    selectedBookIndex = 0;
                }
                $scope.state.selectedBook = $scope.books[selectedBookIndex];
                $scope.state.selectedChapter = 0;
                if (log) console.log({'$scope.state.selectedChapter':$scope.state.selectedChapter})
            }
        };
        $scope.getStyle = function () {
            let square = $scope.state.fontSizeFactor * $scope.state.fontSizeFactor;
            let style = { 
                'font-size': (square * .02 + $scope.state.fontSizeFactor * .2 + 1) + 'em',
            };
            return style;
        };
        $scope.translateAll = function () {
            u.loop(words, w => {
                $scope.state.toggledWords[w] = true;
            });
            saveState();
        };
        $scope.unTranslateAll = function () {
            u.loop(words, w => {
                $scope.state.toggledWords[w] = false;
            });
            saveState();
        };
    });
});