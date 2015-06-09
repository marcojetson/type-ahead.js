var example1 = new TypeAhead(document.getElementById('example1'), [
    'Asia', 'Africa', 'North America', 'South America', 'Antarctica', 'Europe', 'Australia'
]);

var example2 = new TypeAhead(document.getElementById('example2')),
    example2_xhr;

example2.getCandidates = function (callback) {
    example2_xhr && example2_xhr.abort();
    example2_xhr = $.getJSON('https://clients1.google.com/complete/search?client=youtube&tok=Iu2UFybBVjvwBqGBmnMaKw&callback=?&q=' + this.query, function (response) {
        var candidates = [];
        for (var i = 0; i < response[1].length; i++) {
            candidates.push(response[1][i][0]);
        }
        callback(candidates);
    });
};