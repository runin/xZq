var fs = require('fs');
var cheerio = require('cheerio');
var Entities = require('html-entities').XmlEntities;


exports.makeHtml = function () {
    fs.createReadStream(source).pipe(fs.createWriteStream(fileName));
    // 1、插入DOM
    var entities = new Entities();
    fs.readFile(fileName, function (err, data) {
        if (err) throw err;
        var origin = cheerio.load(oldHtml);
        var index = cheerio.load(data.toString());

        if (index('body .main').length > 0) {
            index('body .main').remove();
        }

        var mainBgStyle = origin('.wrapper').css('background');
        index('body').prepend('\r\r<section class="main">\r</section>\r');
        if (mainBgStyle) {
            index('.main').css('background', mainBgStyle.replace(/\"/g, ""));
        }

        origin('.content-item').each(function () {
            var dataX = origin(this).attr('data-x');
            var dataY = origin(this).attr('data-y');
            var width = origin(this).css('width');
            var height = origin(this).css('height');
            origin(this).find('.wrapper').attr('data-x', dataX).attr('data-y', dataY).css({
                'width': width,
                'height': height
            });
            index('.main').append(origin(this).html() + '\r');
        });

        fs.writeFile(fileName, entities.decode(index.html()), function (err) {
            if (err) throw err;
            console.log(fileName + ' saved!');
        });
    });
};