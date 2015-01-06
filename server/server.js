
Meteor.methods({
    scrape: function () {
        results = Meteor.http.get("http://www.willhaben.at/iad/immobilien/mietwohnungen/mietwohnung-angebote?&sort=0&areaId=117229&parent_areaid=900");
        $ = cheerio.load(results.content);
        listings = $('.media .media-body a').text();

        return listings;
    }
});
