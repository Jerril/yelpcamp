const Campground = require('./models/campgrounds'),
    Comment = require('./models/comments');

const campgroundData = [
    {name: 'Stardust Camp', image: 'https://cf.bstatic.com/xdata/images/hotel/square200/224192405.webp?k=6374210a6aa82dcedada603c88d14d65957ad680023d12b61a16cc465483a12e&o=', description: 'Welcome to the camp where the heroes and champions of the galaxies reside... blah blah blah blah...'},
    {name: 'Dream Camp',image: 'https://cf.bstatic.com/xdata/images/city/square250/640006.webp?k=c0e8495899acd3665c198a4535795e01906ce7ae584638b5b95fe7fba0e1919b&o=',description: 'Welcome to the camp where the heroes and champions of the galaxies reside... blah blah blah blah...'},
    {name: 'Les Marthes',image: 'https://cf.bstatic.com/xdata/images/city/square250/850363.webp?k=709743702d60cb417433204dfb9468d5f108516ef30c38a5229e4b992f6d7180&o=',description: 'Welcome to the camp where the heroes and champions of the galaxies reside... blah blah blah blah...'}
];

function seedDB(){
    // clear the DB
    Campground.deleteMany({}, (err) => {
        if(err){
            console.log(err);
        }else{
            // insert new multiple data into the DB
            campgroundData.forEach(item => {
                Campground.create(item, (err, campground) => {
                    if(err){
                        console.log(err);
                    }else{
                        // Add new comment
                        Comment.create({
                            text: 'Wow! this campground looks like heaven on earth...',
                            author: 'Sango'
                        }, (err, comment) => {
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;